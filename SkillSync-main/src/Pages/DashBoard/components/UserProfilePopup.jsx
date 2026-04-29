import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  X, MapPin, Mail, ExternalLink, Calendar, Star, UserPlus, UserCheck, 
  MessageCircle, Building, Users, Eye, Briefcase, Code, FolderOpen,
  Clock, CheckCircle, Award
} from 'lucide-react';

const UserProfilePopup = ({ userId, isOpen, onClose, currentUserId }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("none");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  console.log(userId)

  // Mock user data - replace with actual API call
  const mockUserData = {
    1: {
      id: 1,
      name: 'Rohit Kulkarni',
      title: 'Game Developer',
      company: 'GameStudio',
      location: 'Pune, India',
      email: 'rohit.kulkarni@email.com',
      website: 'rohitkulkarni.dev',
      joinDate: 'January 2023',
      avatar: '/api/placeholder/100/100',
      connectionStatus: 'none', // none, pending, connected
      mutualConnections: 5,
      stats: {
        connections: 189,
        profileViews: '2.1K',
        responseRate: '94%'
      },
      skills: [
        { name: 'Unity', endorsements: 45, level: 95 },
        { name: 'C#', endorsements: 38, level: 90 },
        { name: '3D Modelling', endorsements: 29, level: 85 },
        { name: 'Game Design', endorsements: 33, level: 88 },
        { name: 'Blender', endorsements: 22, level: 80 },
        { name: 'VR Development', endorsements: 15, level: 75 }
      ],
      bio: 'Building immersive gaming experiences with cutting-edge technology. Specialized in Unity development and VR/AR applications. Passionate about creating games that tell compelling stories and push the boundaries of interactive entertainment.',
      experience: [
        {
          id: 1,
          title: 'Senior Game Developer',
          company: 'GameStudio Inc',
          duration: '2022 - Present',
          location: 'Pune, India',
          type: 'Full-time',
          description: 'Leading development of AAA mobile games using Unity. Implemented advanced graphics systems and optimized performance for mobile platforms. Mentoring junior developers and establishing best practices.',
          technologies: ['Unity', 'C#', '3D Modelling', 'Shader Programming']
        },
        {
          id: 2,
          title: 'Game Developer',
          company: 'IndieGames Co',
          duration: '2020 - 2022',
          location: 'Mumbai, India',
          type: 'Full-time',
          description: 'Developed multiple successful indie games for PC and mobile platforms. Collaborated with designers and artists to create engaging gameplay mechanics.',
          technologies: ['Unity', 'C#', 'Game Design', 'Mobile Optimization']
        }
      ],
      projects: [
        {
          id: 1,
          name: 'VR Adventure Quest',
          description: 'Immersive VR adventure game with puzzle-solving mechanics. Features hand tracking, spatial audio, and dynamic environment interactions.',
          status: 'Completed',
          rating: 4.8,
          technologies: ['Unity', 'VR SDK', 'C#', 'Blender']
        },
        {
          id: 2,
          name: 'Mobile Racing Game',
          description: 'High-performance racing game for mobile devices with realistic physics and stunning graphics. Supports multiplayer gameplay.',
          status: 'In Progress',
          rating: 4.6,
          technologies: ['Unity', 'Multiplayer Networking', 'Mobile Optimization', 'Physics']
        },
        {
          id: 3,
          name: 'AR Educational App',
          description: 'Augmented reality application for interactive learning. Allows students to visualize complex 3D models in real-world environments.',
          status: 'Completed',
          rating: 4.9,
          technologies: ['AR Foundation', 'Unity', 'Educational Design', '3D Animation']
        }
      ]
    },
    2: {
      id: 2,
      name: 'Manav Desai',
      title: 'Blockchain Developer',
      company: 'CryptoTech',
      location: 'Ahmedabad, India',
      email: 'manav.desai@email.com',
      website: 'manavdesai.tech',
      joinDate: 'March 2023',
      avatar: '/api/placeholder/100/100',
      connectionStatus: 'connected',
      mutualConnections: 12,
      stats: {
        connections: 298,
        profileViews: '3.5K',
        responseRate: '96%'
      },
      skills: [
        { name: 'Solidity', endorsements: 52, level: 92 },
        { name: 'Ethereum', endorsements: 48, level: 90 },
        { name: 'Web3.js', endorsements: 35, level: 88 },
        { name: 'Smart Contracts', endorsements: 41, level: 94 },
        { name: 'DeFi', endorsements: 28, level: 85 },
        { name: 'React', endorsements: 33, level: 82 }
      ],
      bio: 'Exploring decentralized applications and building the future of finance. Specialized in smart contract development and DeFi protocols. Contributing to open-source blockchain projects and educating developers about Web3 technologies.',
      experience: [
        {
          id: 1,
          title: 'Senior Blockchain Developer',
          company: 'CryptoTech Solutions',
          duration: '2023 - Present',
          location: 'Ahmedabad, India',
          type: 'Full-time',
          description: 'Architecting and developing DeFi protocols and smart contracts. Leading blockchain integration projects and optimizing gas efficiency for Ethereum-based applications.',
          technologies: ['Solidity', 'Ethereum', 'Web3.js', 'Hardhat']
        }
      ],
      projects: [
        {
          id: 1,
          name: 'DeFi Lending Platform',
          description: 'Decentralized lending and borrowing platform with automated market makers and yield farming capabilities.',
          status: 'Completed',
          rating: 4.7,
          technologies: ['Solidity', 'Ethereum', 'React', 'Web3.js']
        }
      ]
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Fetch user profile data
  useEffect(() => {
  if (!isOpen || !userId) return;

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://skill-sync-two-zeta.vercel.app//user/${userId}`);
      if (res.data.success && res.data.user) {
        const user = res.data.user;
        setUserProfile({
          id: user._id,
          name: user.fullName,
          title: user.currentPosition || "Not specified",
          company: user.company || "N/A",
          location: user.location || "N/A",
          email: user.email,
          website: user.website || "",
          joinDate: new Date(user.createdAt).toLocaleDateString(),
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=10b981&color=fff`,
          connectionStatus: "none",
          mutualConnections: user.connections?.length || 0,
          stats: {
            connections: user.connections?.length || 0,
            profileViews: "0",
            responseRate: "100%"
          },
          skills: user.skills || [],
          bio: user.bio || "No bio available",
          experience: user.experience || [],
          projects: user.projects || []
        });
        setConnectionStatus(res.data.connectionStatus || "none");
      } else {
        setUserProfile(null);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [isOpen, userId]);


  const handleConnect = async () => {
    try {
      // Backend API call
      // await sendConnectionRequest(userId);
      setUserProfile({
        ...userProfile,
        connectionStatus: 'pending'
      });
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const handleMessage = () => {
    // Navigate to messages or open message modal
    console.log('Opening message for user:', userId);
  };

  const getConnectionButton = () => {
    switch (connectionStatus) {
      case 'none':
        return (
          <button
            onClick={handleConnect}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>Connect</span>
          </button>
        );
      case 'pending':
        return (
          <div className="flex space-x-2">
            <button
              onClick={handleAccept}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <UserCheck className="w-5 h-5" />
              <span>Accept</span>
            </button>
            <button
              onClick={handleReject}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Reject</span>
            </button>
          </div>
        );
      case 'connected':
        return (
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <UserCheck className="w-5 h-5" />
              <span>Connected</span>
            </button>
            <button
              onClick={handleMessage}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Message</span>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-gray-900 border border-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto focus:outline-none"
      >
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        ) : userProfile ? (
          <>
            {/* Header with Close Button */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Profile Details</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Profile Header */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-24 h-24 rounded-full border-4 border-green-500"
                    />
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">{userProfile.name}</h1>
                      <p className="text-xl text-green-400 mb-2">{userProfile.title}</p>
                      <div className="flex items-center text-gray-400 text-sm space-x-4">
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4" />
                          <span>{userProfile.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{userProfile.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{userProfile.email}</span>
                        </div>
                        {userProfile.website && (
                          <div className="flex items-center space-x-1">
                            <ExternalLink className="w-4 h-4" />
                            <span>{userProfile.website}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {userProfile.joinDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {getConnectionButton()}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-8">
                    <div>
                      <div className="text-2xl font-bold text-green-500">{userProfile.stats.connections}</div>
                      <div className="text-sm text-gray-400">Connections</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">{userProfile.stats.profileViews}</div>
                      <div className="text-sm text-gray-400">Profile Views</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">{userProfile.stats.responseRate}</div>
                      <div className="text-sm text-gray-400">Response Rate</div>
                    </div>
                  </div>
                  
                  {userProfile.mutualConnections > 0 && (
                    <div className="text-gray-400 text-sm">
                      <Users className="w-4 h-4 inline mr-1" />
                      {userProfile.mutualConnections} mutual connections
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                  <p className="text-gray-300 leading-relaxed">{userProfile.bio}</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Experience Section */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <Briefcase className="w-6 h-6 text-green-500" />
                      <h2 className="text-xl font-bold text-white">Experience</h2>
                    </div>

                    <div className="space-y-6">
                      {userProfile.experience.map((exp) => (
                        <div key={exp.id} className="border-b border-gray-700 pb-6 last:border-b-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                              <p className="text-green-400 font-medium">{exp.company}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                            <span>{exp.duration}</span>
                            <span>{exp.location}</span>
                            <span className="bg-gray-700 px-2 py-1 rounded text-xs">{exp.type}</span>
                          </div>
                          <p className="text-gray-300 mb-3">{exp.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, index) => (
                              <span key={index} className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skills & Projects Sidebar */}
                <div className="space-y-6">
                  {/* Skills Section */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Code className="w-5 h-5 text-green-500" />
                      <h2 className="text-lg font-bold text-white">Skills & Endorsements</h2>
                    </div>

                    <div className="space-y-4">
                      {userProfile.skills.map((skill, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{skill}</span>
                            <div className="flex items-center space-x-2">
                              <Award className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-gray-400">{skill.endorsements}</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects Section */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <FolderOpen className="w-5 h-5 text-green-500" />
                      <h2 className="text-lg font-bold text-white">Projects</h2>
                    </div>

                    <div className="space-y-4">
                      {userProfile.projects.map((project) => (
                        <div key={project.name} className="border-b border-gray-700 pb-4 last:border-b-0">
                          <h3 className="font-semibold text-white mb-1">{project.name}</h3>
                          <p className="text-gray-300 text-sm mb-2">{project.description}</p>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              project.status === 'Completed' ? 'bg-green-600/20 text-green-400' :
                              project.status === 'In Progress' ? 'bg-blue-600/20 text-blue-400' :
                              'bg-yellow-600/20 text-yellow-400'
                            }`}>
                              {project.status}
                            </span>
                            {project.rating && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-400">{projects.rating}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech, index) => (
                              <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="text-gray-400 text-xs">+{project.technologies.length - 3}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-400">User profile not found.</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePopup;