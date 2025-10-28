import React, { useState, useEffect, useRef } from 'react';
import {
  Video, VideoOff, Mic, MicOff, Play, Square, SkipForward,
  ChevronRight, Code, Database, Cloud, Brain, Shield,
  Smartphone, Layers, Server, BarChart3, Activity, Clock,
  CheckCircle, AlertCircle, TrendingUp, Eye
} from 'lucide-react';

// Mock questions data
const mockQuestions = {
  'Backend Developer': [
    { id: 1, question: 'Explain the difference between SQL and NoSQL databases. When would you use each?', difficulty: 'Medium' },
    { id: 2, question: 'What is REST API? How does it differ from GraphQL?', difficulty: 'Easy' },
    { id: 3, question: 'Describe how you would optimize a slow database query.', difficulty: 'Hard' },
    { id: 4, question: 'What are microservices and what are their advantages?', difficulty: 'Medium' },
    { id: 5, question: 'Explain authentication vs authorization.', difficulty: 'Easy' }
  ],
  'Frontend Developer': [
    { id: 1, question: 'What is the Virtual DOM and how does React use it?', difficulty: 'Medium' },
    { id: 2, question: 'Explain the difference between var, let, and const in JavaScript.', difficulty: 'Easy' },
    { id: 3, question: 'How would you optimize the performance of a React application?', difficulty: 'Hard' },
    { id: 4, question: 'What are React Hooks and why were they introduced?', difficulty: 'Medium' },
    { id: 5, question: 'Explain CSS Box Model.', difficulty: 'Easy' }
  ],
  'Full Stack Developer': [
    { id: 1, question: 'Describe the entire flow from frontend to backend when a user submits a form.', difficulty: 'Medium' },
    { id: 2, question: 'How do you handle state management in a full-stack application?', difficulty: 'Hard' },
    { id: 3, question: 'What security measures would you implement in a full-stack app?', difficulty: 'Hard' },
    { id: 4, question: 'Explain CORS and why it exists.', difficulty: 'Medium' },
    { id: 5, question: 'How do you deploy a full-stack application?', difficulty: 'Medium' }
  ],
  'Mobile App Developer': [
    { id: 1, question: 'What is the difference between native and hybrid mobile apps?', difficulty: 'Easy' },
    { id: 2, question: 'Explain the mobile app lifecycle.', difficulty: 'Medium' },
    { id: 3, question: 'How do you handle offline functionality in mobile apps?', difficulty: 'Hard' },
    { id: 4, question: 'What are the best practices for mobile app performance?', difficulty: 'Medium' },
    { id: 5, question: 'Explain push notifications and how they work.', difficulty: 'Medium' }
  ],
  'DevOps Engineer': [
    { id: 1, question: 'What is CI/CD and why is it important?', difficulty: 'Medium' },
    { id: 2, question: 'Explain the difference between Docker and Kubernetes.', difficulty: 'Hard' },
    { id: 3, question: 'What is Infrastructure as Code (IaC)?', difficulty: 'Medium' },
    { id: 4, question: 'How do you monitor application performance in production?', difficulty: 'Medium' },
    { id: 5, question: 'Explain blue-green deployment strategy.', difficulty: 'Hard' }
  ],
  'Data Scientist': [
    { id: 1, question: 'Explain the difference between supervised and unsupervised learning.', difficulty: 'Easy' },
    { id: 2, question: 'What is overfitting and how do you prevent it?', difficulty: 'Medium' },
    { id: 3, question: 'Describe the process of feature engineering.', difficulty: 'Hard' },
    { id: 4, question: 'What evaluation metrics would you use for a classification problem?', difficulty: 'Medium' },
    { id: 5, question: 'Explain bias-variance tradeoff.', difficulty: 'Hard' }
  ],
  'Cloud Engineer': [
    { id: 1, question: 'What are the main differences between IaaS, PaaS, and SaaS?', difficulty: 'Easy' },
    { id: 2, question: 'Explain auto-scaling in cloud environments.', difficulty: 'Medium' },
    { id: 3, question: 'How do you ensure high availability in cloud architecture?', difficulty: 'Hard' },
    { id: 4, question: 'What is serverless computing and when would you use it?', difficulty: 'Medium' },
    { id: 5, question: 'Describe cloud security best practices.', difficulty: 'Hard' }
  ],
  'AI/ML Engineer': [
    { id: 1, question: 'What is the difference between AI, ML, and Deep Learning?', difficulty: 'Easy' },
    { id: 2, question: 'Explain how neural networks work.', difficulty: 'Hard' },
    { id: 3, question: 'What is transfer learning and when would you use it?', difficulty: 'Medium' },
    { id: 4, question: 'How do you handle imbalanced datasets?', difficulty: 'Medium' },
    { id: 5, question: 'Explain gradient descent and its variants.', difficulty: 'Hard' }
  ],
  'Security Engineer': [
    { id: 1, question: 'What is the CIA triad in cybersecurity?', difficulty: 'Easy' },
    { id: 2, question: 'Explain SQL injection and how to prevent it.', difficulty: 'Medium' },
    { id: 3, question: 'What is penetration testing and why is it important?', difficulty: 'Medium' },
    { id: 4, question: 'Describe common encryption algorithms and their use cases.', difficulty: 'Hard' },
    { id: 5, question: 'How do you implement zero-trust security?', difficulty: 'Hard' }
  ],
  'Database Engineer': [
    { id: 1, question: 'Explain database normalization and its different forms.', difficulty: 'Medium' },
    { id: 2, question: 'What are database indexes and how do they work?', difficulty: 'Medium' },
    { id: 3, question: 'Describe ACID properties in databases.', difficulty: 'Easy' },
    { id: 4, question: 'How do you handle database replication?', difficulty: 'Hard' },
    { id: 5, question: 'Explain query optimization techniques.', difficulty: 'Hard' }
  ]
};

const roles = [
  { id: 'Backend Developer', name: 'Backend Developer', icon: Server, color: 'bg-blue-500' },
  { id: 'Frontend Developer', name: 'Frontend Developer', icon: Code, color: 'bg-green-500' },
  { id: 'Full Stack Developer', name: 'Full Stack Developer', icon: Layers, color: 'bg-purple-500' },
  { id: 'Mobile App Developer', name: 'Mobile App Developer', icon: Smartphone, color: 'bg-pink-500' },
  { id: 'DevOps Engineer', name: 'DevOps Engineer', icon: Server, color: 'bg-orange-500' },
  { id: 'Database Engineer', name: 'Database Engineer', icon: Database, color: 'bg-yellow-500' },
  { id: 'Cloud Engineer', name: 'Cloud Engineer', icon: Cloud, color: 'bg-cyan-500' },
  { id: 'AI/ML Engineer', name: 'AI/ML Engineer', icon: Brain, color: 'bg-indigo-500' },
  { id: 'Data Scientist', name: 'Data Scientist', icon: BarChart3, color: 'bg-teal-500' },
  { id: 'Security Engineer', name: 'Security Engineer', icon: Shield, color: 'bg-red-500' }
];

const MockInterviewPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  // Mock analytics data
  const [analytics, setAnalytics] = useState({
    stressLevel: 30,
    confidence: 75,
    clarity: 65,
    eyeContact: 80
  });

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const currentQuestions = selectedRole ? mockQuestions[selectedRole] : [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // Start camera
  useEffect(() => {
    if (interviewStarted && videoEnabled) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [interviewStarted, videoEnabled]);

  // Timer
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRecording]);

  // Simulate analytics updates
  useEffect(() => {
    if (isRecording) {
      const analyticsInterval = setInterval(() => {
        setAnalytics({
          stressLevel: Math.floor(Math.random() * 40) + 20,
          confidence: Math.floor(Math.random() * 30) + 60,
          clarity: Math.floor(Math.random() * 35) + 50,
          eyeContact: Math.floor(Math.random() * 25) + 65
        });
      }, 8000);
      return () => clearInterval(analyticsInterval);
    }
  }, [isRecording]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: audioEnabled 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const startInterview = () => {
    setInterviewStarted(true);
    setIsRecording(true);
    setTimer(0);
    setCurrentQuestionIndex(0);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const endInterview = () => {
    setIsRecording(false);
    stopCamera();
    alert('Interview completed! Your performance has been recorded.');
    setInterviewStarted(false);
    setSelectedRole(null);
    setTimer(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMetricColor = (value) => {
    if (value >= 70) return 'text-green-500';
    if (value >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Hard': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  // Role Selection Screen
  if (!selectedRole) {
    return (
      <div className="h-full bg-black p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Mock Interview Preparation</h1>
            <p className="text-gray-400">Select a role to start your interview practice</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500 transition-all group"
                >
                    <div className="section1 flex items-center justify-evenly">  
                        <div className={`w-15 h-15 ${role.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="dev">
                            <h3 className="text-white font-semibold text-xl mb-2">{role.name}</h3>
                            <p className="text-gray-400 text-sm mb-4">
                            {mockQuestions[role.id]?.length || 0} practice questions
                            </p>
                        </div>
                    </div>
                  
                  <div className="flex items-center mx-10 text-green-500 text-sm font-medium">
                    <span>Start Practice</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Interview Setup Screen
  if (!interviewStarted) {
    return (
      <div className="h-full bg-black flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready for {selectedRole} Interview?
            </h2>
            <p className="text-gray-400 mb-6">
              You will be presented with {currentQuestions.length} questions. Take your time to answer each one thoughtfully.
            </p>

            {/* Camera Preview */}
            <div className="bg-black rounded-lg overflow-hidden mb-6 aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-lg transition-colors ${
                  videoEnabled ? 'bg-gray-800 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {videoEnabled ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
              </button>
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-lg transition-colors ${
                  audioEnabled ? 'bg-gray-800 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {audioEnabled ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
              </button>
            </div>

            {/* Start Button */}
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedRole(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={startInterview}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Interview</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interview Interface
  return (
    <div className="h-full bg-black flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">Recording</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timer)}</span>
            </div>
          </div>

          <div className="text-white font-medium">
            Question {currentQuestionIndex + 1} of {currentQuestions.length}
          </div>

          <button
            onClick={endInterview}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Square className="w-4 h-4" />
            <span>End Interview</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-3 gap-6 p-6 overflow-y-auto">
        {/* Left: Video Feed */}
        <div className="col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-3 border-b border-gray-800">
              <h3 className="text-white font-medium">Your Video</h3>
            </div>
            <div className="aspect-video bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 flex items-center justify-center space-x-2">
              <button
                onClick={toggleVideo}
                className={`p-2 rounded-lg transition-colors ${
                  videoEnabled ? 'bg-gray-800 hover:bg-gray-700' : 'bg-red-600'
                }`}
              >
                {videoEnabled ? <Video className="w-4 h-4 text-white" /> : <VideoOff className="w-4 h-4 text-white" />}
              </button>
              <button
                onClick={toggleAudio}
                className={`p-2 rounded-lg transition-colors ${
                  audioEnabled ? 'bg-gray-800 hover:bg-gray-700' : 'bg-red-600'
                }`}
              >
                {audioEnabled ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Panel */}
        <div className="col-span-2 flex flex-col">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Interview Question</h3>
              <span className={`${getDifficultyColor(currentQuestion.difficulty)} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                {currentQuestion.difficulty}
              </span>
            </div>

            <div className="flex-1 bg-gray-800 rounded-lg p-6 mb-6">
              <p className="text-white text-lg leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex space-x-4">
              {currentQuestionIndex < currentQuestions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Next Question</span>
                  <SkipForward className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={endInterview}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Interview</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Analytics Dashboard */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="grid grid-cols-4 gap-4">
          {/* Stress Level */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-red-500" />
                <span className="text-gray-400 text-sm">Stress Level</span>
              </div>
              <span className={`text-lg font-bold ${getMetricColor(100 - analytics.stressLevel)}`}>
                {analytics.stressLevel}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analytics.stressLevel}%` }}
              ></div>
            </div>
          </div>

          {/* Confidence */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-gray-400 text-sm">Confidence</span>
              </div>
              <span className={`text-lg font-bold ${getMetricColor(analytics.confidence)}`}>
                {analytics.confidence}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analytics.confidence}%` }}
              ></div>
            </div>
          </div>

          {/* Clarity */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span className="text-gray-400 text-sm">Answer Clarity</span>
              </div>
              <span className={`text-lg font-bold ${getMetricColor(analytics.clarity)}`}>
                {analytics.clarity}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analytics.clarity}%` }}
              ></div>
            </div>
          </div>

          {/* Eye Contact */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-purple-500" />
                <span className="text-gray-400 text-sm">Eye Contact</span>
              </div>
              <span className={`text-lg font-bold ${getMetricColor(analytics.eyeContact)}`}>
                {analytics.eyeContact}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analytics.eyeContact}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterviewPage;