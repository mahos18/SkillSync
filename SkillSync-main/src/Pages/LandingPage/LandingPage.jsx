import React from 'react';
import { ArrowRight, Users, Eye, TrendingUp,  CheckCircle,  Zap,MapPin,Video,Bot,BarChart3,Shield,Globe } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();
    const toAuthPage = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <CheckCircle className="text-green-500 w-6 h-6" />
          <span className="text-sm text-gray-300">Professional Networking Reimagined</span>
        </div>
        <div className="flex space-x-4">
          <button className="text-white hover:text-green-500 transition-colors cursor-pointer" onClick={toAuthPage} >Login</button>
          <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-medium transition-colors" onClick={toAuthPage}>
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl font-bold leading-tight mb-8">
              Connect.
              <br />
              <span className="text-green-500">Collaborate.</span>
              <br />
              Grow.
            </h1>
            
            <p className="text-gray-300 text-lg mb-8 max-w-md">
              Join a community where professionals meet, collaborate, and thrive. Discover opportunities around you, connect with nearby experts, and take your career to the next level.
            </p>

            <div className="flex space-x-4 mb-12">
              <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
                
                <button className="border border-gray-600 hover:border-gray-400 px-6 py-3 rounded-lg font-medium transition-colors" onClick={toAuthPage}>
                    Login
                </button>
                
            </div>

            {/* Stats */}
            <div className="flex space-x-8">
              <div>
                <div className="text-3xl font-bold text-green-500">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500">500+</div>
                <div className="text-sm text-gray-400">Skills Matched</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500">85%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>

          {/* 3D Visualization */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
            <div className="relative space-y-6">
              <div className="flex justify-end">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">Design</span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">React</span>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">Node.js</span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">Python</span>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="w-18 h-18 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">AI/ML</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose SkillSync */}
      <section className="max-w-7xl mx-auto px-6 py-20">
  <div className="text-center mb-16">
    <h2 className="text-4xl font-bold mb-4">
      Why Choose <span className="text-green-500">SkillSync</span>?
    </h2>
    <p className="text-gray-300 max-w-2xl mx-auto">
      Experience the future of professional networking with cutting-edge technology and intuitive design that puts your career growth first.
    </p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {/* Nearby Connect */}
    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
        <MapPin className="w-6 h-6 text-green-500" />
      </div>
      <h3 className="text-xl font-bold mb-3">Nearby Connect</h3>
      <p className="text-gray-300">
        Find and connect with professionals in your vicinity for instant collaboration.
      </p>
    </div>

    {/* Mock Interviews */}
    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
        <Video className="w-6 h-6 text-green-500" />
      </div>
      <h3 className="text-xl font-bold mb-3">Mock Interviews</h3>
      <p className="text-gray-300">
        Practice technical and behavioral interviews with real-time feedback.
      </p>
    </div>

    {/* AI-Powered Matching */}
    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
        <Bot className="w-6 h-6 text-green-500" />
      </div>
      <h3 className="text-xl font-bold mb-3">AI-Powered Matching</h3>
      <p className="text-gray-300">
        Smart algorithms connect you with the right professionals based on skills and goals.
      </p>
    </div>

    {/* Skill Tracking */}
    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
        <BarChart3 className="w-6 h-6 text-green-500" />
      </div>
      <h3 className="text-xl font-bold mb-3">Skill Tracking</h3>
      <p className="text-gray-300">
        Monitor your skill growth and visualize your career trajectory over time.
      </p>
    </div>

    {/* Privacy & Security */}
    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
        <Shield className="w-6 h-6 text-green-500" />
      </div>
      <h3 className="text-xl font-bold mb-3">Privacy & Security</h3>
      <p className="text-gray-300">
        Your personal and professional data is secured with enterprise-grade protocols.
      </p>
    </div>

    {/* Career Opportunities */}
    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
        <Globe className="w-6 h-6 text-green-500" />
      </div>
      <h3 className="text-xl font-bold mb-3">Career Opportunities</h3>
      <p className="text-gray-300">
        Discover new job roles, internships, and collaborations within the global network.
      </p>
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Network?</h2>
        <p className="text-gray-300 mb-8">
          Join thousands of professionals already using SkillSync to accelerate their careers.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-lg font-medium transition-colors">
            Get Started Free
          </button>
          <button className="border border-gray-600 hover:border-gray-400 px-8 py-4 rounded-lg font-medium transition-colors">
            Schedule Demo
          </button>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
          <p className="text-gray-300">
            See how top companies are using SkillSync to build stronger teams
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
          <div className="text-xl font-bold">TechCorp</div>
          <div className="text-xl font-bold">InnovateLab</div>
          <div className="text-xl font-bold">FutureWorks</div>
          <div className="text-xl font-bold">SkillForge</div>
          <div className="text-xl font-bold">ConnectPro</div>
          <div className="text-xl font-bold">NetworkHub</div>
          <div className="text-xl font-bold">TalentSync</div>
          <div className="text-xl font-bold">ProLink</div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;