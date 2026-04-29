import React, { useState } from 'react';
import { 
  User, MapPin, Mail, ExternalLink, FileText, Plus, Trash2, 
  ArrowRight, ArrowLeft, Check, Upload, Camera, Briefcase, 
  Code, FolderOpen, CheckCircle 
} from 'lucide-react';
import axios from 'axios';
import { handleError, handleSuccess } from '../../utils/Toaster';
import { Navigate, useNavigate } from 'react-router-dom';

const OnboardingFlow = () => {
    const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    currentPosition: '',
    location: '',
    additionalEmail: '',
    website: '',
    bio: '',
    
    // Step 2: Skills
    
    
    // Step 3: Experience
    experience: [{
      jobTitle: '',
      company: '',
      duration: '',
      location: '',
      description: '',
      technologies: ['']
    }],
    skills: [''],
    
    // Step 4: Projects
    projects: [{
      projectName: '',
      description: '',
      status: 'In Progress',
      technologies: ['']
    }]
  });

  const steps = [
    { title: 'Basic Info', icon: User, description: 'Tell us about yourself' },
    { title: 'Skills', icon: Code, description: 'What are you good at?' },
    { title: 'Experience', icon: Briefcase, description: 'Your work history' },
    { title: 'Projects', icon: FolderOpen, description: 'Showcase your work' }
  ];

  const handleInputChange = (section, index, field, value) => {
    if (section === 'basic') {
      setFormData({ ...formData, [field]: value });
    } else if (section === 'skills') {
      const newSkills = [...formData.skills];
      newSkills[index] = value;
      setFormData({ ...formData, skills: newSkills });
    } else if (section === 'experience') {
      const newExperience = [...formData.experience];
      if (field === 'technologies') {
        newExperience[index].technologies = value;
      } else {
        newExperience[index][field] = value;
      }
      setFormData({ ...formData, experience: newExperience });
    } else if (section === 'projects') {
      const newProjects = [...formData.projects];
      if (field === 'technologies') {
        newProjects[index].technologies = value;
      } else {
        newProjects[index][field] = value;
      }
      setFormData({ ...formData, projects: newProjects });
    }
  };

  const addItem = (section) => {
    if (section === 'skills') {
      setFormData({ ...formData, skills: [...formData.skills, ''] });
    } else if (section === 'experience') {
      setFormData({
        ...formData,
        experience: [...formData.experience, {
          jobTitle: '',
          company: '',
          duration: '',
          location: '',
          description: '',
          technologies: ['']
        }]
      });
    } else if (section === 'projects') {
      setFormData({
        ...formData,
        projects: [...formData.projects, {
          projectName: '',
          description: '',
          status: 'In Progress',
          technologies: ['']
        }]
      });
    }
  };

  const removeItem = (section, index) => {
    if (section === 'skills' && formData.skills.length > 1) {
      const newSkills = formData.skills.filter((_, i) => i !== index);
      setFormData({ ...formData, skills: newSkills });
    } else if (section === 'experience' && formData.experience.length > 1) {
      const newExperience = formData.experience.filter((_, i) => i !== index);
      setFormData({ ...formData, experience: newExperience });
    } else if (section === 'projects' && formData.projects.length > 1) {
      const newProjects = formData.projects.filter((_, i) => i !== index);
      setFormData({ ...formData, projects: newProjects });
    }
  };

  const addTechnology = (section, itemIndex) => {
    if (section === 'experience') {
      const newExperience = [...formData.experience];
      newExperience[itemIndex].technologies.push('');
      setFormData({ ...formData, experience: newExperience });
    } else if (section === 'projects') {
      const newProjects = [...formData.projects];
      newProjects[itemIndex].technologies.push('');
      setFormData({ ...formData, projects: newProjects });
    }
  };

  const removeTechnology = (section, itemIndex, techIndex) => {
    if (section === 'experience') {
      const newExperience = [...formData.experience];
      if (newExperience[itemIndex].technologies.length > 1) {
        newExperience[itemIndex].technologies = newExperience[itemIndex].technologies.filter((_, i) => i !== techIndex);
        setFormData({ ...formData, experience: newExperience });
      }
    } else if (section === 'projects') {
      const newProjects = [...formData.projects];
      if (newProjects[itemIndex].technologies.length > 1) {
        newProjects[itemIndex].technologies = newProjects[itemIndex].technologies.filter((_, i) => i !== techIndex);
        setFormData({ ...formData, projects: newProjects });
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Clean up empty strings from arrays
    await sendCurrentLocationToServer();
    const cleanedData = {
      ...formData,
      skills: formData.skills.filter(skill => skill.trim() !== ''),
      experience: formData.experience.map(exp => ({
        ...exp,
        technologies: exp.technologies.filter(tech => tech.trim() !== '')
      })),
      projects: formData.projects.map(proj => ({
        ...proj,
        technologies: proj.technologies.filter(tech => tech.trim() !== '')
      }))
    };

    console.log('Submitting onboarding data:', cleanedData);
    console.log('Profile picture:', profilePicture);
    
    const token = localStorage.getItem("token");
    console.log(token)

    try {
        const res = await axios.put(
        "https://skill-sync-two-zeta.vercel.app//auth/onboard", 
        cleanedData,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        if (res.data.success) {
        console.log("Profile updated:", res.data.user);
        
        
        localStorage.setItem("user", JSON.stringify(res.data.user));
        handleSuccess('Onboarding completed! Redirecting to dashboard');
        // navigate("/dash");
        }
    } catch (err) {
      const msg =err.response?.data?.message ||"Something went wrong. Please try again.";
      handleError(msg)
        console.error( err.message);
    }
    

  };


  // getAndSendLocation.js (can be inline inside component)
  async function sendCurrentLocationToServer() {
    // 1. quick check
    if (!("geolocation" in navigator)) {
      handleError("Geolocation not supported by this browser.");
      return;
    }

    // 2. get permission & position (wrapped as Promise for async/await)
    const getPosition = () =>
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          (err) => reject(err),
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60 * 1000, // 1 minute
          }
        );
      });

    try {
      const position = await getPosition();
      const { latitude, longitude } = position.coords;

      // 3. prepare payload
      const payload = { latitude, longitude };

      const token = localStorage.getItem("token");
      if (!token) {
        handleError("Not authenticated. Please log in.");
        return;
      }

      // 4. send to backend (adjust URL to match your server)
      const res = await axios.put(
        "https://skill-sync-two-zeta.vercel.app//auth/onboard", // or your chosen endpoint
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        handleSuccess("Location shared — onboarding continues!");
        // optionally update user in localStorage: localStorage.setItem('user', JSON.stringify(res.data.user));
      } else {
        handleError(res.data?.message || "Failed to save location");
      }
    } catch (err) {
      // 5. handle permission denial / errors
      if (err && err.code === 1) {
        // PERMISSION_DENIED
        handleError("Location permission denied. Allow location to use Nearby Connect.");
      } else if (err && err.code === 2) {
        handleError("Position unavailable. Try again.");
      } else if (err && err.code === 3) {
        handleError("Location request timed out. Try again.");
      } else {
        handleError(err?.response?.data?.message || err?.message || "Unknown error");
      }
      console.error("Geolocation/send error:", err);
    }
  }





  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h2>
        <p className="text-gray-400">Let's get to know you better</p>
      </div>

      {/* Profile Picture Upload */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-gray-700 overflow-hidden bg-gray-800 flex items-center justify-center">
            {profilePicturePreview ? (
              <img src={profilePicturePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 p-2 rounded-full cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-white" />
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white text-sm font-medium mb-2">Current Position</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.currentPosition}
              onChange={(e) => handleInputChange('basic', 0, 'currentPosition', e.target.value)}
              placeholder="e.g., Senior Full Stack Developer"
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('basic', 0, 'location', e.target.value)}
              placeholder="e.g., San Francisco, CA"
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">Additional Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={formData.additionalEmail}
              onChange={(e) => handleInputChange('basic', 0, 'additionalEmail', e.target.value)}
              placeholder="contact@example.com"
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">Website/Portfolio</label>
          <div className="relative">
            <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('basic', 0, 'website', e.target.value)}
              placeholder="https://yourportfolio.com"
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">Bio</label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('basic', 0, 'bio', e.target.value)}
            placeholder="Tell us about yourself, your experience, and what you're passionate about..."
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors resize-none"
            rows="4"
          />
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Your Skills</h2>
        <p className="text-gray-400">What technologies and skills do you work with?</p>
      </div>

      <div className="space-y-4">
        {formData.skills.map((skill, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={skill}
                onChange={(e) => handleInputChange('skills', index, '', e.target.value)}
                placeholder="e.g., React, Python, AWS..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              />
            </div>
            {formData.skills.length > 1 && (
              <button
                onClick={() => removeItem('skills', index)}
                className="p-3 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => addItem('skills')}
        className="flex items-center space-x-2 text-green-500 hover:text-green-400 transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span>Add Another Skill</span>
      </button>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Work Experience</h2>
        <p className="text-gray-400">Share your professional journey</p>
      </div>

      {formData.experience.map((exp, index) => (
        <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Experience {index + 1}</h3>
            {formData.experience.length > 1 && (
              <button
                onClick={() => removeItem('experience', index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={exp.jobTitle}
              onChange={(e) => handleInputChange('experience', index, 'jobTitle', e.target.value)}
              placeholder="Job Title"
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
            <input
              type="text"
              value={exp.company}
              onChange={(e) => handleInputChange('experience', index, 'company', e.target.value)}
              placeholder="Company"
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
            <input
              type="text"
              value={exp.duration}
              onChange={(e) => handleInputChange('experience', index, 'duration', e.target.value)}
              placeholder="Duration (e.g., 2020 - 2022)"
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
            <input
              type="text"
              value={exp.location}
              onChange={(e) => handleInputChange('experience', index, 'location', e.target.value)}
              placeholder="Location"
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
          </div>

          <textarea
            value={exp.description}
            onChange={(e) => handleInputChange('experience', index, 'description', e.target.value)}
            placeholder="Describe your role and achievements..."
            className="w-full mb-4 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 resize-none"
            rows="3"
          />

          <div className="space-y-2">
            <label className="block text-white text-sm font-medium">Technologies Used</label>
            {exp.technologies.map((tech, techIndex) => (
              <div key={techIndex} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => {
                    const newTechnologies = [...exp.technologies];
                    newTechnologies[techIndex] = e.target.value;
                    handleInputChange('experience', index, 'technologies', newTechnologies);
                  }}
                  placeholder="Technology/Tool"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
                {exp.technologies.length > 1 && (
                  <button
                    onClick={() => removeTechnology('experience', index, techIndex)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addTechnology('experience', index)}
              className="text-green-500 hover:text-green-400 text-sm transition-colors"
            >
              + Add Technology
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => addItem('experience')}
        className="flex items-center space-x-2 text-green-500 hover:text-green-400 transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span>Add Another Experience</span>
      </button>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Your Projects</h2>
        <p className="text-gray-400">Showcase your best work</p>
      </div>

      {formData.projects.map((project, index) => (
        <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Project {index + 1}</h3>
            {formData.projects.length > 1 && (
              <button
                onClick={() => removeItem('projects', index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={project.projectName}
              onChange={(e) => handleInputChange('projects', index, 'projectName', e.target.value)}
              placeholder="Project Name"
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
            <select
              value={project.status}
              onChange={(e) => handleInputChange('projects', index, 'status', e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <textarea
            value={project.description}
            onChange={(e) => handleInputChange('projects', index, 'description', e.target.value)}
            placeholder="Describe your project, its features, and impact..."
            className="w-full mb-4 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 resize-none"
            rows="3"
          />

          <div className="space-y-2">
            <label className="block text-white text-sm font-medium">Technologies Used</label>
            {project.technologies.map((tech, techIndex) => (
              <div key={techIndex} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => {
                    const newTechnologies = [...project.technologies];
                    newTechnologies[techIndex] = e.target.value;
                    handleInputChange('projects', index, 'technologies', newTechnologies);
                  }}
                  placeholder="Technology/Framework"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
                {project.technologies.length > 1 && (
                  <button
                    onClick={() => removeTechnology('projects', index, techIndex)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addTechnology('projects', index)}
              className="text-green-500 hover:text-green-400 text-sm transition-colors"
            >
              + Add Technology
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => addItem('projects')}
        className="flex items-center space-x-2 text-green-500 hover:text-green-400 transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span>Add Another Project</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      
      <div className="w-full max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
            <span className="text-gray-400 text-sm">Step {currentStep + 1} of {steps.length}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-4 mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    index < currentStep 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : index === currentStep 
                        ? 'border-green-500 text-green-500' 
                        : 'border-gray-600 text-gray-400'
                  }`}>
                    {index < currentStep ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className={`text-sm font-medium ${
                      index <= currentStep ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-px flex-1 mx-4 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
          {/* {currentStep === 0 && renderBasicInfo()}
          {currentStep === 1 && renderSkills()}
          {currentStep === 2 && renderExperience()}
          {currentStep === 3 && renderProjects()} */}
          {currentStep < steps.length ? (
            <>
              {currentStep === 0 && renderBasicInfo()}
              {currentStep === 1 && renderSkills()}
              {currentStep === 2 && renderExperience()}
              {currentStep === 3 && renderProjects()}
            </>
          ) : <div>Invalid step</div>}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Setup</span>
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;