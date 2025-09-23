import React, { useState } from 'react';
import { 
  Home, User, Users, MessageSquare, Video, ShoppingBag, Settings, Moon, Sun,
  MapPin, Calendar, Mail, ExternalLink, Edit3, Save, X, Plus, Trash2, Star
} from 'lucide-react';
import ProfilePage from './components/ProfilePage';
import Feed from '../Feed/Feed';


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  
  const [isDarkMode, setIsDarkMode] = useState(true);

  // User data state (this would come from your backend)
  

  const sidebarItems = [
    { name: 'Home', icon: Home },
    { name: 'Profile', icon: User },
    { name: 'Connections', icon: Users },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Interview', icon: Video },
    { name: 'Marketplace', icon: ShoppingBag },
  ];

 
  

  return (
    <div className="h-screen bg-black flex overflow-hidden">
        {/* Static Sidebar */}
        <div className="w-64 h-full bg-gray-950 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">SkillSync</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
            {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
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

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-800">
            {/* <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="font-medium">Light Mode</span>
            </button> */}
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
            </button>
        </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
        {activeTab === 'Profile' && <ProfilePage />}
        {activeTab === 'Home' && <Feed />}
        {activeTab === 'Connections' && (
            <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Connections</h1>
            <p className="text-gray-300">Manage your professional connections here.</p>
            </div>
        )}
        {activeTab === 'Messages' && (
            <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Messages</h1>
            <p className="text-gray-300">Your messages and conversations.</p>
            </div>
        )}
        {activeTab === 'Interview' && (
            <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Interview</h1>
            <p className="text-gray-300">Schedule and manage your interviews.</p>
            </div>
        )}
        {activeTab === 'Marketplace' && (
            <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Marketplace</h1>
            <p className="text-gray-300">Browse and post job opportunities.</p>
            </div>
        )}
        </div>
    </div>
    );

};

export default Dashboard;