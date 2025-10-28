// ConnectNearbyPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useUser } from '../../../context/UserContext';
import { 
  MapPin, Loader, AlertCircle, Navigation, 
  Users, Crosshair, Eye, UserPlus, X, CircleUserRound
} from 'lucide-react';
import UserProfilePopup from './UserProfilePopup';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

    

// Custom marker icons
const createCustomIcon = (color = '#10b981', isCurrentUser = false) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <div style="
          width: ${isCurrentUser ? '48px' : '40px'}; 
          height: ${isCurrentUser ? '48px' : '40px'}; 
          background-color: ${color}; 
          border: 3px solid white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          cursor: pointer;
          transition: transform 0.2s;
          ${isCurrentUser ? 'animation: pulse 2s infinite;' : ''}
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        ${isCurrentUser ? `
          <div style="
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            background: ${color};
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: bold;
            white-space: nowrap;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">You</div>
        ` : ''}
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          }
          50% { 
            transform: scale(1.15); 
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.6);
          }
        }
        .custom-marker:hover > div > div {
          transform: scale(1.1);
        }
      </style>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48]
  });
};

// Component to recenter map
const RecenterMap = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom(), {
        duration: 1.5
      });
    }
  }, [center, map]);
  
  return null;
};

const ConnectNearbyPage = ({ activeTab, currentUserId }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchRadius, setSearchRadius] = useState(1); // km
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const mapRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Get current user location
  useEffect(() => {
    if (activeTab === 'Connect Nearby') {
      getCurrentLocation();
    }
  }, [activeTab]);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(location);
        fetchNearbyUsers(location);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Please enable location access to see nearby users');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Fetch nearby users from backend
  const fetchNearbyUsers = async (location) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/user/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lng,
          radius: searchRadius
        })
      });

      const data = await response.json();
      if (data.success) {
        setNearbyUsers(data.users);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching nearby users:', error);
      setError('Failed to load nearby users');
      setLoading(false);
    }
  };

  // Connect with user
  const handleConnect = async (userId) => {
    try {
      const response = await fetch('http://localhost:8080/friend-request/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: currentUserId,
          receiver: userId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Connection request sent successfully!');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request');
    }
  };

  // View user profile
  const handleViewProfile = (user) => {
    setModalUser(user);
    setShowUserModal(true);
  };

  // Refresh nearby users
  const handleRefresh = () => {
    if (currentLocation) {
      fetchNearbyUsers(currentLocation);
    } else {
      getCurrentLocation();
    }
  };

  // Change search radius
  const handleRadiusChange = (newRadius) => {
    setSearchRadius(newRadius);
    if (currentLocation) {
      fetchNearbyUsers(currentLocation);
    }
  };

  // Recenter map to user location
  const recenterMap = () => {
    if (mapRef.current && currentLocation) {
      mapRef.current.flyTo(currentLocation, 13, {
        duration: 1.5
      });
    }
  };

  if (loading && !currentLocation) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg mb-2">Getting your location...</p>
          <p className="text-gray-400 text-sm">Please allow location access</p>
        </div>
      </div>
    );
  }

  if (error && !currentLocation) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Location Access Required</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={getCurrentLocation}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Enable Location
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <UserProfilePopup
        userId={selectedUserId}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        currentUserId={currentUserId} // Your logged-in user's ID
      />
      <div className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-green-500" />
            <div>
              <h1 className="text-xl font-bold text-white">Connect Nearby</h1>
              <p className="text-sm text-gray-400">
                {nearbyUsers.length} {nearbyUsers.length === 1 ? 'user' : 'users'} within {searchRadius}km
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Radius Selector */}
            <select
              value={searchRadius}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
            >
              <option value={1}>1 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
              title="Refresh"
            >
              <Navigation className="w-5 h-5" />
            </button>

            {/* Recenter Button */}
            <button
              onClick={recenterMap}
              className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
              title="Recenter Map"
            >
              <Crosshair className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {currentLocation && (
          <MapContainer
            center={currentLocation}
            zoom={13}
            style={{ height: '100%', width: '100%', backgroundColor: '#000' }}
            ref={mapRef}
            zoomControl={true}
            className="z-0"
          >
            {/* Map Tiles */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            <RecenterMap center={currentLocation} />

            {/* Search Radius Circle */}
            <Circle
              center={currentLocation}
              radius={searchRadius * 1000} // Convert km to meters
              pathOptions={{
                color: '#10b981',
                fillColor: '#10b981',
                fillOpacity: 0.1,
                weight: 2
              }}
            />

            {/* Current User Marker */}
            <Marker 
              position={currentLocation}
              icon={createCustomIcon('#10b981', true)}
              zIndexOffset={1000}
            >
              <Popup>
                <div className="text-center p-2">
                  <div className="font-bold text-green-600 mb-1">Your Location</div>
                  <div className="text-xs text-gray-600">
                    Lat: {currentLocation.lat.toFixed(4)}<br/>
                    Lng: {currentLocation.lng.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Nearby Users Markers */}
            {nearbyUsers.map((user) => (
              <Marker
                key={user._id}
                position={[user.latitude, user.longitude]}
                icon={createCustomIcon('#3b82f6', false)}
              >
                <Popup>
                  <div className="p-3 min-w-[250px]">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{user.fullName}</h3>
                        <p className="text-sm text-gray-600">{user.currentPosition}</p>
                      </div>
                    </div>
                    
                    {user.location && (
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <MapPin className="w-3 h-3 mr-1" />
                        {user.location}
                      </div>
                    )}

                    {user.distance && (
                      <div className="text-xs text-gray-500 mb-3 font-medium">
                        📍 {user.distance.toFixed(2)} m away
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProfile(user)}
                        className="flex-1 flex items-center justify-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm transition-colors font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>
                      {/* <button
                        onClick={() => handleConnect(user._id)}
                        className="flex-1 flex items-center justify-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors font-medium"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Connect</span>
                      </button> */}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* Loading Overlay */}
        {loading && currentLocation && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
              <Loader className="w-8 h-8 text-green-500 animate-spin mx-auto mb-2" />
              <p className="text-white">Loading nearby users...</p>
            </div>
          </div>
        )}
      </div>

      {/* Nearby Users List (Bottom Panel) */}
      {nearbyUsers.length > 0 ? (
        <div className="bg-gray-900 border-t border-gray-800 p-4 max-h-64 overflow-y-auto">
          <div className="flex items-center space-x-2 mb-3">
            <Users className="w-5 h-5 text-green-500" />
            <h3 className="text-white font-semibold">Nearby Users</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {nearbyUsers.map((user) => (
              <div
                key={user._id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-green-500 transition-colors cursor-pointer"
                onClick={() => handleViewProfile(user)}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm truncate">{user.fullName}</h4>
                    <p className="text-gray-400 text-xs truncate">{user.currentPosition}</p>
                  </div>
                </div>
                {user.distance && (
                  <p className="text-green-400 text-xs font-medium">
                    📍 {user.distance.toFixed(1)} m away
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        !loading && currentLocation && (
          <div className="bg-gray-900 border-t border-gray-800 p-8 text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">No Users Nearby</h3>
            <p className="text-gray-400 mb-4">
              There are no users within {searchRadius}km of your location. Try increasing the search radius.
            </p>
            <button
              onClick={handleRefresh}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Refresh
            </button>
          </div>
        )
      )}

      {/* User Detail Modal */}
      {showUserModal && modalUser && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
          onClick={() => setShowUserModal(false)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">User Profile</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {modalUser.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{modalUser.fullName}</h3>
                <p className="text-gray-400">{modalUser.currentPosition}</p>
              </div>
            </div>

            {modalUser.location && (
              <div className="flex items-center text-gray-300 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span>{modalUser.location}</span>
              </div>
            )}

            {modalUser.distance && (
              <div className="bg-gray-800 rounded-lg p-3 mb-6">
                <p className="text-green-400 text-sm font-medium">
                  📍 {modalUser.distance.toFixed(2)} km away from you
                </p>
              </div>
            )}

            {modalUser.bio && (
              <div className="mb-6">
                <h4 className="text-white font-medium mb-2">About</h4>
                <p className="text-gray-400 text-sm">{modalUser.bio}</p>
              </div>
            )}

            <div className="flex space-x-3">
              {/* <button
                onClick={() => {
                  handleConnect(modalUser._id);
                  setShowUserModal(false);
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Connect</span>
              </button> */}
              <button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                onClick={() => {
                  setSelectedUserId(modalUser._id);
                  setShowProfile(true);
                  setShowUserModal(false)                }}
              >
                <CircleUserRound className="w-5 h-5" />
                <span> View Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectNearbyPage;