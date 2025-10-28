import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Feed from "./Pages/Feed/Feed";
import LandingPage from "./Pages/LandingPage/LandingPage";
import AuthPages from "./Pages/AuthPage/AuthPages";
import Dashboard from "./Pages/DashBoard/Dashboard";
import { Toaster } from "react-hot-toast";
import RefreshHandler from "./utils/RefreshHandler";
import OnboardingFlow from "./Pages/AuthPage/Onboardingflow";
import UserProfilePopup from "./Pages/DashBoard/components/UserProfilePopup";
import MockInterviewPage from "./Pages/DashBoard/components/MockInterviewPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const PrivateRoute = ({ element }) => {
    if (!isAuthenticated) return <Navigate to="/" />;
    if (user && !user.isOnboarded) return <Navigate to="/onboard" />;
    return element;
  };

  return (
    <>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/x1" element={<UserProfilePopup />} />
        <Route path="/auth" element={<AuthPages />} />
        <Route path="/onboard"   element={<OnboardingFlow />}  />
        <Route path="/x2"   element={<MockInterviewPage />}  />
        <Route path="/dash" element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
