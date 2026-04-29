import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { handleSuccess,handleError } from '../../utils/Toaster';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react'

const AuthPages = () => {
  const navigate = useNavigate();
  const API = "https://skill-sync-two-zeta.vercel.app/auth";
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [Loading,setLoading]=useState(false)
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupChange = (e) => {
    setSignupForm({
      ...signupForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async () => {
    if (loginForm.email ,loginForm.password==""){
      handleError('All Fields are required');
      return;
    }
    

    try {
      setLoading(true);
      const res = await axios.post(`${API}/login`, loginForm);

      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));

      handleSuccess("Login successful!");
      navigate("/dash");
    } catch (err) {
      console.error(err?.response?.data || err.message);
      handleError(err?.response?.data?.message || "Wrong Email or Password");
    } finally{
      setLoading(false);
    }
  };

  const handleSignupSubmit = async () => {
    
    if (signupForm.fullName,signupForm.email ,signupForm.password==""){
      handleError('All Fields are required');
      return;
    }
    if(signupForm.fullName.length<6){
      handleError('Please enter Full Name');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupForm.email || !emailRegex.test(signupForm.email)) {
      handleError('Please enter a valid email address');
      return;
    }
    if(signupForm.password.length<5){
      handleError('Password minimum lenght:6');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      handleError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API}/register`, signupForm);

      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));
      
      handleSuccess("Signup successful!");
      handleSuccess("Please Complete your Profile");
      navigate("/onboard");
    } catch (err) {
      console.error(err?.response?.data || err.message);
      handleError(err?.response?.data?.message || "Signup failed");
    } finally{
      setLoading(false);
    }
  };

  const switchToSignup = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Animated background dots */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-white rounded-full opacity-60"></div>
      <div className="absolute bottom-32 left-16 w-3 h-3 bg-green-500 rounded-full opacity-40"></div>
      
      <div className="relative w-full max-w-md">
        {/* Login Form */}
        <div className={`bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 transition-all duration-500 ease-in-out ${
          isLogin ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none absolute inset-0'
        }`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button type="button" className="text-green-500 text-sm hover:text-green-400 transition-colors">
                Forgot password?
              </button>
            </div>

            {
              Loading?(
                <button
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <LoaderCircle className='mr-2 h-6 w-6 animate-spin' />
                </button>
              ):(
                <button
                  onClick={handleLoginSubmit}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Log in</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )
            }
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={switchToSignup}
                className="text-green-500 hover:text-green-400 font-medium transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Signup Form */}
        <div className={`bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 transition-all duration-500 ease-in-out ${
          !isLogin ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none absolute inset-0'
        }`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Join SkillSync</h2>
            <p className="text-gray-400">Create your account to get started</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  value={signupForm.fullName}
                  onChange={handleSignupChange}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={signupForm.email}
                  onChange={handleSignupChange}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={signupForm.password}
                  onChange={handleSignupChange}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={signupForm.confirmPassword}
                  onChange={handleSignupChange}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {
              Loading?(
                <button
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <LoaderCircle className='mr-2 h-6 w-6 animate-spin' />
                </button>
              ):(
                <button
                  onClick={handleSignupSubmit}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )
            }
                
                
              </div>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={switchToLogin}
                className="text-green-500 hover:text-green-400 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;