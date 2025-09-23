import React, { useState } from 'react';
import { 
  Home, User, Users, MessageSquare, Video, ShoppingBag, Settings, Moon, Sun,
  MapPin, Calendar, Mail, ExternalLink, Edit3, Save, X, Plus, Trash2, Star
} from 'lucide-react';

const ProfilePage = () => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [userData, setUserData] = useState({
      name: "Alex Johnson",
      title: "Senior Full Stack Developer",
      location: "San Francisco, CA",
      email: "alex.johnson@email.com",
      website: "alexjohnson.dev",
      joinDate: "March 2022",
      avatar: "/api/placeholder/80/80",
      stats: {
        connections: 342,
        profileViews: "1.2K",
        responseRate: "95%"
      },
      skills: ["React", "Node.js", "TypeScript", "Python", "AWS"],
      bio: "Passionate full-stack developer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. Love mentoring junior developers and contributing to open-source projects. Always excited about new technologies and best practices.",
      experience: [
        {
          id: 1,
          title: "Senior Frontend Developer",
          company: "TechCorp Inc",
          duration: "2022 - Present",
          location: "San Francisco, CA",
          type: "Full-time",
          description: "Leading frontend development for enterprise applications using React, TypeScript, and modern web technologies.",
          technologies: ["React", "TypeScript", "GraphQL", "AWS"]
        },
        {
          id: 2,
          title: "Frontend Developer",
          company: "StartupXYZ",
          duration: "2020 - 2022",
          location: "Remote",
          type: "Full-time",
          description: "Built responsive web applications and collaborated with design teams to create exceptional user experiences.",
          technologies: ["React", "JavaScript", "Node.js", "MongoDB"]
        }
      ],
      projects: [
        {
          id: 1,
          name: "E-Commerce Platform",
          description: "Full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.",
          status: "Completed",
          rating: 4.9,
          technologies: ["React", "Node.js", "PostgreSQL", "Stripe"]
        },
        {
          id: 2,
          name: "Task Management App",
          description: "Collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
          status: "In Progress",
          rating: 4.8,
          technologies: ["React", "TypeScript", "Socket.io", "MongoDB"]
        }
      ]
    });
  
    const [tempBio, setTempBio] = useState(userData.bio);
    const [newExperience, setNewExperience] = useState({
      title: '', company: '', duration: '', location: '', type: 'Full-time', description: '', technologies: []
    });
    const [newSkill, setNewSkill] = useState('');
    const [newProject, setNewProject] = useState({
      name: '', description: '', status: 'In Progress', technologies: []
    });


     // CRUD Operations (Backend API calls would go here)
  const updateBio = () => {
    setUserData({...userData, bio: tempBio});
    setIsEditingBio(false);
    // API call: await updateUserBio(tempBio);
  };

  const addExperience = () => {
    const experience = {
      ...newExperience,
      id: Date.now(),
      technologies: newExperience.technologies.filter(tech => tech.trim() !== '')
    };
    setUserData({
      ...userData,
      experience: [...userData.experience, experience]
    });
    setNewExperience({ title: '', company: '', duration: '', location: '', type: 'Full-time', description: '', technologies: [] });
    setShowAddExperience(false);
    // API call: await addUserExperience(experience);
  };

  const deleteExperience = (id) => {
    setUserData({
      ...userData,
      experience: userData.experience.filter(exp => exp.id !== id)
    });
    // API call: await deleteUserExperience(id);
  };

  const addSkill = () => {
    if (newSkill.trim() && !userData.skills.includes(newSkill.trim())) {
      setUserData({
        ...userData,
        skills: [...userData.skills, newSkill.trim()]
      });
      setNewSkill('');
      setShowAddSkill(false);
      // API call: await addUserSkill(newSkill);
    }
  };

  const removeSkill = (skill) => {
    setUserData({
      ...userData,
      skills: userData.skills.filter(s => s !== skill)
    });
    // API call: await removeUserSkill(skill);
  };

  const addProject = () => {
    const project = {
      ...newProject,
      id: Date.now(),
      rating: 0,
      technologies: newProject.technologies.filter(tech => tech.trim() !== '')
    };
    setUserData({
      ...userData,
      projects: [...userData.projects, project]
    });
    setNewProject({ name: '', description: '', status: 'In Progress', technologies: [] });
    setShowAddProject(false);
    // API call: await addUserProject(project);
  };

  const deleteProject = (id) => {
    setUserData({
      ...userData,
      projects: userData.projects.filter(proj => proj.id !== id)
    });
    // API call: await deleteUserProject(id);
  };


    return(
    <div className="p-6 max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-20 h-20 rounded-full border-2 border-green-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{userData.name}</h1>
              <p className="text-xl text-gray-300 mb-2">{userData.title}</p>
              <div className="flex items-center text-gray-400 text-sm space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{userData.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ExternalLink className="w-4 h-4" />
                  <span>{userData.website}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {userData.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Edit Profile
          </button>
        </div>

        {/* Stats */}
        <div className="flex space-x-8">
          <div>
            <div className="text-2xl font-bold text-green-500">{userData.stats.connections}</div>
            <div className="text-sm text-gray-400">Connections</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">{userData.stats.profileViews}</div>
            <div className="text-sm text-gray-400">Profile Views</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">{userData.stats.responseRate}</div>
            <div className="text-sm text-gray-400">Response Rate</div>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {userData.skills.map((skill, index) => (
              <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">About</h3>
            <button
              onClick={() => setIsEditingBio(!isEditingBio)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          {isEditingBio ? (
            <div>
              <textarea
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
                rows="4"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setIsEditingBio(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={updateBio}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 leading-relaxed">{userData.bio}</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Experience Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Experience</h2>
              <button
                onClick={() => setShowAddExperience(true)}
                className="text-green-500 hover:text-green-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Add Experience Form */}
            {showAddExperience && (
              <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-white font-medium mb-4">Add Experience</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={newExperience.title}
                    onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 2020 - 2022)"
                    value={newExperience.duration}
                    onChange={(e) => setNewExperience({...newExperience, duration: e.target.value})}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={newExperience.location}
                    onChange={(e) => setNewExperience({...newExperience, location: e.target.value})}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                  className="w-full mt-4 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 resize-none"
                  rows="3"
                />
                <input
                  type="text"
                  placeholder="Technologies (comma-separated)"
                  value={newExperience.technologies.join(', ')}
                  onChange={(e) => setNewExperience({...newExperience, technologies: e.target.value.split(', ')})}
                  className="w-full mt-4 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setShowAddExperience(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addExperience}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    Add Experience
                  </button>
                </div>
              </div>
            )}

            {/* Experience List */}
            <div className="space-y-6">
              {userData.experience.map((exp) => (
                <div key={exp.id} className="border-b border-gray-800 pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                      <p className="text-green-500 font-medium">{exp.company}</p>
                    </div>
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                    <span>{exp.duration}</span>
                    <span>{exp.location}</span>
                    <span className="bg-gray-700 px-2 py-1 rounded text-xs">{exp.type}</span>
                  </div>
                  <p className="text-gray-300 mb-3">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, index) => (
                      <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
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
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Skills & Endorsements</h2>
              <button
                onClick={() => setShowAddSkill(true)}
                className="text-green-500 hover:text-green-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Add Skill Form */}
            {showAddSkill && (
              <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <input
                  type="text"
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setShowAddSkill(false)}
                    className="px-3 py-1 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addSkill}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {userData.skills.slice(0, 6).map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-medium">{skill}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-400">{Math.floor(Math.random() * 20) + 80}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Projects</h2>
              <button
                onClick={() => setShowAddProject(true)}
                className="text-green-500 hover:text-green-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Add Project Form */}
            {showAddProject && (
              <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-white font-medium mb-3">Add Project</h3>
                <input
                  type="text"
                  placeholder="Project Name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  className="w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
                <textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 resize-none"
                  rows="3"
                />
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                  className="w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
                <input
                  type="text"
                  placeholder="Technologies (comma-separated)"
                  value={newProject.technologies.join(', ')}
                  onChange={(e) => setNewProject({...newProject, technologies: e.target.value.split(', ')})}
                  className="w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowAddProject(false)}
                    className="px-3 py-1 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addProject}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors"
                  >
                    Add Project
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {userData.projects.map((project) => (
                <div key={project.id} className="border-b border-gray-800 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{project.name}</h3>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{project.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      project.status === 'Completed' ? 'bg-green-600 text-white' :
                      project.status === 'In Progress' ? 'bg-blue-600 text-white' :
                      'bg-yellow-600 text-white'
                    }`}>
                      {project.status}
                    </span>
                    {project.rating > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-400">{project.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
