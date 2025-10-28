// ConnectionsPage.jsx (replace your existing file)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component'; // optional; remove if you don't use it
import { 
  Search, Filter, Users, MapPin, Plus, Check, X, 
  UserPlus, UserCheck, Clock, Eye, Building
} from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { LoaderCircle } from 'lucide-react'
import UserProfilePopup from './UserProfilePopup';

const API_BASE = 'http://localhost:8080';

const ConnectionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('discover');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    skills: [],
    location: '',
    experience: 'all',
    availability: 'all'
  });

  const [users, setUsers] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]); // incoming
  const [loading, setLoading] = useState(true);

  // Usage in your connections page:
    const [showProfile, setShowProfile] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

  // pagination (optional)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_LIMIT = 12;

  const { currentUser, updateUser } = useUser();
  const token = localStorage.getItem('token');

  // helper for obtaining stable userId (some places use id, some _id)
  const currentUserId = currentUser?._id || currentUser?.id || null;

  // Fetch discoverable users (paginated)
  const fetchUsers = async (pageToLoad = 1) => {
    if (!currentUserId) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE}/user/connections`,
        { userId: currentUserId, page: pageToLoad, limit: PAGE_LIMIT }
      );
      if (res.data.success) {
        const incoming = res.data.users || [];
        if (pageToLoad === 1) setUsers(incoming);
        else setUsers(prev => [...prev, ...incoming]);

        if (incoming.length < PAGE_LIMIT) setHasMore(false);
      }
    } catch (err) {
      console.error('fetchUsers error', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch incoming friend requests (where current user is receiver)
  const fetchIncomingRequests = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/friend/requests/incoming`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setConnectionRequests(res.data.requests || []);
      }
    } catch (err) {
      console.error('fetchIncomingRequests', err?.response?.data || err.message);
    }
  };

  // initial load & when user changes
  useEffect(() => {
    if (!currentUserId) return;
    setUsers([]);
    setPage(1);
    setHasMore(true);
    fetchUsers(1);
    fetchIncomingRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  // load next page
  useEffect(() => {
    if (page === 1) return;
    fetchUsers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // send a connection request
  const sendRequest = async (receiverId) => {
    if (!token) return alert('You must be logged in');
    try {
      // optimistic UI
      setUsers(prev => prev.map(u => u._id === receiverId ? { ...u, connectionStatus: 'pending' } : u));

      const res = await axios.post(`${API_BASE}/friend/request`, { receiverId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.data.success) {
        // revert if server rejected
        setUsers(prev => prev.map(u => u._id === receiverId ? { ...u, connectionStatus: 'none' } : u));
        return alert(res.data.msg || 'Could not send request');
      }
      // optionally push it to outgoingRequests state if you maintain one
    } catch (err) {
      console.error('sendRequest', err?.response?.data || err.message);
      // revert optimistic
      setUsers(prev => prev.map(u => u._id === receiverId ? { ...u, connectionStatus: 'none' } : u));
      alert(err?.response?.data?.msg || 'Request failed');
    }
  };

  // accept incoming request (requestId)
  const acceptRequest = async (requestId) => {
    if (!token) return alert('You must be logged in');
    try {
      const res = await axios.post(`${API_BASE}/friend/accept`, { requestId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const req = res.data.request;
        // req.sender contains sender id populated by controller
        const senderId = req.sender?._id || req.sender?.id || req.sender;
        // mark sender as connected in users list (if present)
        setUsers(prev => prev.map(u => u._id === senderId ? { ...u, connectionStatus: 'connected' } : u));
        // remove from incoming list
        setConnectionRequests(prev => prev.filter(r => r._id !== requestId));
        // optionally update local currentUser connections in context and localStorage (so ProtectedRoute etc sees it)
        if (updateUser) {
          const updatedUser = { ...currentUser };
          const already = (updatedUser.connections || []).some(c => c.toString() === senderId.toString());
          if (!already) {
            updatedUser.connections = [...(updatedUser.connections || []), senderId];
            updateUser(updatedUser);
          }
        }
      } else {
        alert(res.data.msg || 'Could not accept');
      }
    } catch (err) {
      console.error('acceptRequest', err?.response?.data || err.message);
      alert(err?.response?.data?.msg || 'Accept failed');
    }
  };

  // reject incoming request
  const rejectRequest = async (requestId) => {
    if (!token) return alert('You must be logged in');
    try {
      const res = await axios.post(`${API_BASE}/friend/reject`, { requestId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setConnectionRequests(prev => prev.filter(r => r._id !== requestId));
      } else {
        alert(res.data.msg || 'Could not reject');
      }
    } catch (err) {
      console.error('rejectRequest', err?.response?.data || err.message);
      alert(err?.response?.data?.msg || 'Reject failed');
    }
  };

  // filteredUsers (search + simple filters)
  const filteredUsers = users.filter(userItem => {
    const matchesSearch =
      (!searchQuery) ||
      (userItem.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (userItem.currentPosition || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (userItem.skills || []).some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkills = selectedFilters.skills.length === 0 ||
      selectedFilters.skills.some(skill => (userItem.skills || []).includes(skill));

    const matchesLocation = !selectedFilters.location ||
      (userItem.location || '').toLowerCase().includes(selectedFilters.location.toLowerCase());

    return matchesSearch && matchesSkills && matchesLocation;
  });

  const getConnectionButtonContent = (connectionStatus) => {
    switch(connectionStatus) {
      case 'none':
      case undefined:
        return { icon: UserPlus, text: 'Connect', className: 'bg-green-500 hover:bg-green-600' };
      case 'pending':
        return { icon: Clock, text: 'Pending', className: 'bg-gray-600 cursor-not-allowed' };
      case 'connected':
        return { icon: UserCheck, text: 'Connected', className: 'bg-blue-600 hover:bg-blue-700' };
      default:
        return { icon: UserPlus, text: 'Connect', className: 'bg-green-500 hover:bg-green-600' };
    }
  };

  const UserCard = ({ userItem, showRequestActions = false }) => {
    const { icon: ConnectionIcon, text: connectionText, className: buttonClassName } = getConnectionButtonContent(userItem.connectionStatus);

    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-green-700 flex items-center justify-center text-white text-xl font-bold">
                {userItem.fullName?.charAt(0) || '?'}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{userItem.fullName}</h3>
              <p className="text-green-400 font-medium">{userItem.currentPosition}</p>
              <div className="flex items-center text-gray-400 text-sm mt-1">
                <Building className="w-4 h-4 mr-1" />
                <span>{userItem.company || ''}</span>
                <span className="mx-2">•</span>
                <MapPin className="w-4 h-4 mr-1" />
                <span>{userItem.location || ''}</span>
              </div>
            </div>
          </div>

          {!showRequestActions ? (
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors" 
              onClick={() => {
                  setSelectedUserId(userItem._id);
                  setShowProfile(true);                }}
                  >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2" />
          )}
        </div>

        {userItem.bio && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{userItem.bio}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {(userItem.skills || []).slice(0, 4).map((skill, index) => (
            <span key={index} className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs">
              {skill}
            </span>
          ))}
          {(userItem.skills || []).length > 4 && (
            <span className="text-gray-400 text-xs">+{userItem.skills.length - 4} more</span>
          )}
        </div>

        {!showRequestActions && (
          <button
            onClick={() => {
              if (userItem.connectionStatus === 'none' || userItem.connectionStatus === undefined) {
                sendRequest(userItem._id);
              }
            }}
            disabled={userItem.connectionStatus === 'pending' || userItem.connectionStatus === 'connected'}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors text-white ${buttonClassName}`}
          >
            <ConnectionIcon className="w-4 h-4" />
            <span>{connectionText}</span>
          </button>
        )}
      </div>
    );
  };

  if (loading && page === 1) return <div className="text-white text-center mt-20 flex items-center justify-center"> <LoaderCircle className='mr-2 h-6 w-6 animate-spin' />Loading</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <UserProfilePopup
        userId={selectedUserId}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        currentUserId={currentUser.id} // Your logged-in user's ID
      />
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Connections</h1>
          <p className="text-gray-400">Discover and connect with professionals</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${showFilters ? 'bg-green-500 border-green-500 text-white' : 'border-gray-700 text-gray-300 hover:border-gray-600'}`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-8">
          {/* filters UI unchanged */}
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Skills</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white">
                <option value="">All Skills</option>
                <option value="react">React</option>
                <option value="python">Python</option>
                <option value="nodejs">Node.js</option>
                <option value="aws">AWS</option>
              </select>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                placeholder="Enter location"
                value={selectedFilters.location}
                onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
            {/* <div>
              <label className="block text-white text-sm font-medium mb-2">Experience</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white">
                <option value="all">All Levels</option>
                <option value="junior">Junior (1-2 years)</option>
                <option value="mid">Mid-level (3-5 years)</option>
                <option value="senior">Senior (5+ years)</option>
              </select>
            </div> */}
            {/* <div>
              <label className="block text-white text-sm font-medium mb-2">Availability</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white">
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
              </select>
            </div> */}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-900/50 p-1 rounded-lg w-fit">
        <button onClick={() => setActiveTab('discover')} className={`px-6 py-2 rounded-lg ${activeTab === 'discover' ? 'bg-green-500 text-white' : 'text-gray-300 hover:text-white'}`}>Discover People</button>
        <button onClick={() => setActiveTab('requests')} className={`px-6 py-2 rounded-lg ${activeTab === 'requests' ? 'bg-green-500 text-white' : 'text-gray-300 hover:text-white'}`}>Requests ({connectionRequests.length})</button>
      </div>

      {/* Content */}
      {activeTab === 'discover' ? (
        filteredUsers.length > 0 ? (
          <InfiniteScroll
            dataLength={users.length}
            next={() => setPage(prev => prev + 1)}
            hasMore={hasMore}
            loader={<h4 className="text-white text-center my-4 flex items-center justify-center text-2xl"><LoaderCircle className='mr-2 h-6 w-6 animate-spin' />Loading</h4>}
            endMessage={<p className="text-gray-400 text-center mt-4">No more users</p>}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(userItem => (
                <UserCard key={userItem._id} userItem={userItem} />
              ))}
            </div>
          </InfiniteScroll>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
            <p className="text-gray-400">Try adjusting your search or filters to find more people.</p>
          </div>
        )
      ) : (
        // Requests tab
        connectionRequests.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No connection requests</h3>
            <p className="text-gray-400">When people send you connection requests, they'll appear here.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectionRequests.map(req => (
              <div key={req._id} className="bg-gray-900/50 p-6 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-green-700 flex items-center justify-center text-white text-xl font-bold">
                      {req.sender?.fullName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{req.sender?.fullName}</h3>
                      <p className="text-green-400">{req.sender?.currentPosition}</p>
                      <div className="text-gray-400 text-sm mt-1">{req.sender?.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => acceptRequest(req._id)} className="px-3 py-1 bg-green-500 rounded text-white">Accept</button>
                    <button onClick={() => rejectRequest(req._id)} className="px-3 py-1 bg-gray-600 rounded text-white">Reject</button>
                  </div>
                </div>
                {req.message && <p className="text-gray-300 mb-2">{req.message}</p>}
                <div className="text-gray-500 text-xs">Sent: {new Date(req.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default ConnectionsPage;
