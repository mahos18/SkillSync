import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Users, MessageSquare,MapPinned,PictureInPicture2, Video, ShoppingBag, LogOut } from 'lucide-react';
import { XCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import ProfilePage from './components/ProfilePage';
import Feed from '../Feed/Feed';
import ConnectionsPage from './components/connectionsPage';
import ConnectnearbyPage from './components/ConnectnearbyPage';
import MockInterviewPage from './components/MockInterviewPage';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const tabs = ['Home', 'Profile', 'Connections', 'Messages', 'Interview', 'Marketplace'];

  // Initialize activeTab based on URL hash
  const [activeTab, setActiveTab] = useState('Home');

   const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // landing page
  };

  useEffect(() => {
    const hash = location.hash.replace('#', ''); // remove #
    if (hash && tabs.map(t => t.toLowerCase()).includes(hash)) {
      setActiveTab(hash.charAt(0).toUpperCase() + hash.slice(1));
    }
  }, [location.hash]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`#${tab.toLowerCase()}`, { replace: true }); // update hash
  };


  const sidebarItems = [
    { name: 'Home', icon: Home },
    { name: 'Profile', icon: User },
    { name: 'Connections', icon: Users },
    { name: 'Connect Nearby', icon: MapPinned },
    { name: 'Mock Interview', icon: PictureInPicture2 },
    { name: 'Messages', icon: MessageSquare }
  ];

  return (
    <div className="h-screen bg-black flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 h-full bg-gray-950 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">SkillSync</h1>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleTabClick(item.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.name
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-red-400 hover:bg-gray-800 transition-colors" onClick={() => setShowPopup(true)}>
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-[#111827] border border-gray-700 p-6 rounded-2xl shadow-xl w-[90%] max-w-sm text-center transition-all duration-300">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-white mb-2">
              Confirm Logout
            </h2>
            <p className="text-gray-400 text-sm mb-5">
              Are you sure you want to log out? You’ll need to log in again to
              continue.
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setShowPopup(false)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'Profile' && <ProfilePage />}
        {activeTab === 'Home' && <Feed />}
        {activeTab === 'Connections' && <ConnectionsPage />}
        {activeTab === 'Connect Nearby' && < ConnectnearbyPage activeTab={activeTab} />}
        {activeTab === 'Mock Interview' && < MockInterviewPage />}
        {activeTab === 'Messages' && (
          <div className="p-6 text-gray-300">Your messages and conversations.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
