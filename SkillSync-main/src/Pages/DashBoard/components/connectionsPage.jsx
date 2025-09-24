import React, { useState } from 'react';
import { 
  Search, Filter, Users, MapPin, Star, Plus, Check, X, 
  MessageCircle, UserPlus, UserCheck, Clock, Zap, Mail,
  MoreHorizontal, Eye, Building
} from 'lucide-react';

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

  // Mock data - replace with actual backend data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      avatar: '/api/placeholder/60/60',
      skills: ['React', 'TypeScript', 'Next.js', 'Figma'],
      connections: 234,
      mutualConnections: 5,
      rating: 4.9,
      status: 'available',
      connectionStatus: 'none', // none, pending, connected
      bio: 'Passionate frontend developer with 5+ years of experience building modern web applications.',
      experience: '5+ years',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Alex Rodriguez',
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Austin, TX',
      avatar: '/api/placeholder/60/60',
      skills: ['Node.js', 'React', 'MongoDB', 'AWS'],
      connections: 189,
      mutualConnections: 12,
      rating: 4.8,
      status: 'busy',
      connectionStatus: 'pending',
      bio: 'Building scalable web applications and mentoring junior developers.',
      experience: '7+ years',
      lastActive: '1 day ago'
    },
    {
      id: 3,
      name: 'Maya Patel',
      title: 'UI/UX Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      avatar: '/api/placeholder/60/60',
      skills: ['Figma', 'Sketch', 'Prototyping', 'User Research'],
      connections: 312,
      mutualConnections: 8,
      rating: 4.9,
      status: 'available',
      connectionStatus: 'connected',
      bio: 'Creating beautiful and functional user experiences for web and mobile.',
      experience: '6+ years',
      lastActive: 'Online now'
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Backend Developer',
      company: 'CloudTech',
      location: 'Seattle, WA',
      avatar: '/api/placeholder/60/60',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      connections: 156,
      mutualConnections: 3,
      rating: 4.7,
      status: 'available',
      connectionStatus: 'none',
      bio: 'Specializing in backend architecture and database optimization.',
      experience: '4+ years',
      lastActive: '30 minutes ago'
    },
    {
      id: 5,
      name: 'Emma Wilson',
      title: 'DevOps Engineer',
      company: 'CloudOps Inc',
      location: 'Denver, CO',
      avatar: '/api/placeholder/60/60',
      skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
      connections: 298,
      mutualConnections: 15,
      rating: 4.8,
      status: 'available',
      connectionStatus: 'none',
      bio: 'Building robust infrastructure and automating deployment processes.',
      experience: '8+ years',
      lastActive: '1 hour ago'
    },
    {
      id: 6,
      name: 'James Thompson',
      title: 'Mobile Developer',
      company: 'AppForge',
      location: 'Los Angeles, CA',
      avatar: '/api/placeholder/60/60',
      skills: ['React Native', 'Flutter', 'iOS', 'Android'],
      connections: 187,
      mutualConnections: 6,
      rating: 4.6,
      status: 'busy',
      connectionStatus: 'none',
      bio: 'Creating cross-platform mobile applications with native performance.',
      experience: '5+ years',
      lastActive: '4 hours ago'
    }
  ]);

  const [connectionRequests, setConnectionRequests] = useState([
    {
      id: 7,
      name: 'Lisa Wang',
      title: 'Data Scientist',
      company: 'AI Labs',
      avatar: '/api/placeholder/60/60',
      skills: ['Python', 'Machine Learning', 'TensorFlow'],
      mutualConnections: 4,
      requestDate: '2 days ago',
      message: 'Hi! I saw your work on React projects. Would love to connect and share experiences.'
    },
    {
      id: 8,
      name: 'Michael Brown',
      title: 'Product Manager',
      company: 'InnovateCorp',
      avatar: '/api/placeholder/60/60',
      skills: ['Product Strategy', 'Agile', 'Analytics'],
      mutualConnections: 7,
      requestDate: '1 day ago',
      message: 'Hello! I\'m impressed by your development skills. Let\'s connect!'
    }
  ]);

  const handleConnect = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, connectionStatus: 'pending' }
        : user
    ));
    // Backend API call would go here
    // await sendConnectionRequest(userId);
  };

  const handleAcceptRequest = (requestId) => {
    const request = connectionRequests.find(req => req.id === requestId);
    setConnectionRequests(connectionRequests.filter(req => req.id !== requestId));
    setUsers([...users, { ...request, connectionStatus: 'connected' }]);
    // Backend API call would go here
    // await acceptConnectionRequest(requestId);
  };

  const handleRejectRequest = (requestId) => {
    setConnectionRequests(connectionRequests.filter(req => req.id !== requestId));
    // Backend API call would go here
    // await rejectConnectionRequest(requestId);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSkills = selectedFilters.skills.length === 0 || 
                         selectedFilters.skills.some(skill => user.skills.includes(skill));
    
    const matchesLocation = !selectedFilters.location || 
                           user.location.toLowerCase().includes(selectedFilters.location.toLowerCase());
    
    return matchesSearch && matchesSkills && matchesLocation;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getConnectionButtonContent = (connectionStatus) => {
    switch(connectionStatus) {
      case 'none':
        return { icon: UserPlus, text: 'Connect', className: 'bg-green-500 hover:bg-green-600' };
      case 'pending':
        return { icon: Clock, text: 'Pending', className: 'bg-gray-600 cursor-not-allowed' };
      case 'connected':
        return { icon: UserCheck, text: 'Connected', className: 'bg-blue-600 hover:bg-blue-700' };
      default:
        return { icon: UserPlus, text: 'Connect', className: 'bg-green-500 hover:bg-green-600' };
    }
  };

  const UserCard = ({ user, showRequestActions = false, onAccept, onReject }) => {
    const { icon: ConnectionIcon, text: connectionText, className: buttonClassName } = getConnectionButtonContent(user.connectionStatus);

    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-gray-700"
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${getStatusColor(user.status)}`}></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{user.name}</h3>
              <p className="text-green-400 font-medium">{user.title}</p>
              <div className="flex items-center text-gray-400 text-sm mt-1">
                <Building className="w-4 h-4 mr-1" />
                <span>{user.company}</span>
                <span className="mx-2">•</span>
                <MapPin className="w-4 h-4 mr-1" />
                <span>{user.location}</span>
              </div>
            </div>
          </div>
          
          {!showRequestActions ? (
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onAccept(user.id)}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => onReject(user.id)}
                className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {user.bio && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{user.bio}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {user.skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs">
              {skill}
            </span>
          ))}
          {user.skills.length > 4 && (
            <span className="text-gray-400 text-xs">+{user.skills.length - 4} more</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{user.connections}</span>
            </div>
            {user.mutualConnections > 0 && (
              <div className="flex items-center space-x-1">
                <span>{user.mutualConnections} mutual</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{user.rating}</span>
            </div>
          </div>

          {!showRequestActions && (
            <button
              onClick={() => handleConnect(user.id)}
              disabled={user.connectionStatus !== 'none'}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors text-white ${buttonClassName}`}
            >
              <ConnectionIcon className="w-4 h-4" />
              <span>{connectionText}</span>
            </button>
          )}
        </div>

        {showRequestActions && user.message && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <p className="text-gray-300 text-sm">{user.message}</p>
            <span className="text-gray-500 text-xs mt-1 block">{user.requestDate}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-700 text-gray-300 hover:border-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Skills</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500">
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
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">Experience</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500">
                <option value="all">All Levels</option>
                <option value="junior">Junior (1-2 years)</option>
                <option value="mid">Mid-level (3-5 years)</option>
                <option value="senior">Senior (5+ years)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">Availability</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500">
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-900/50 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'discover'
              ? 'bg-green-500 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Discover People
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'requests'
              ? 'bg-green-500 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Requests ({connectionRequests.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'discover' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-6">
          {connectionRequests.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No connection requests</h3>
              <p className="text-gray-400">When people send you connection requests, they'll appear here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectionRequests.map(request => (
                <UserCard 
                  key={request.id} 
                  user={request} 
                  showRequestActions={true}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State for Discover */}
      {activeTab === 'discover' && filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
          <p className="text-gray-400">Try adjusting your search or filters to find more people.</p>
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;