import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Feed from './Pages/Feed/Feed'
import LandingPage from './Pages/LandingPage/LandingPage'
import AuthPages from './Pages/AuthPage/AuthPages'
import Dashboard from './Pages/DashBoard/DashBoard'
import { Toaster } from 'react-hot-toast';
import RefreshHandler from './utils/RefreshHandler'
import OnboardingFlow from './Pages/AuthPage/Onboardingflow'


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const PrivateRoute=({element}) => {
    return isAuthenticated ? element : <Navigate to="/" />;
  }

  return (
    
      <>
        <RefreshHandler setIsAuthenticated={setIsAuthenticated}/>
        <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPages />} />
        <Route path="/onboard" element={<OnboardingFlow />} />
        <Route path="/dash" element={<PrivateRoute element={<Dashboard/>}/>} />
      </Routes>
      <Toaster />
        
      </>
    
  )
}

export default App
