import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function RefreshHandler({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (token && user) {
      setIsAuthenticated(true);

      // If user is not onboarded, force to onboarding
      if (!user.isOnboarded && location.pathname !== "/onboard") {
        navigate("/onboard", { replace: true });
        return;
      }

      // If user is onboarded but stuck on root/auth, send to dashboard
      if (user.isOnboarded && (location.pathname === "/" || location.pathname === "/auth")) {
        navigate("/dash", { replace: true });
      }
    } else {
      // No token or user, logout state
      setIsAuthenticated(false);
    }
  }, [location, token, user, setIsAuthenticated, navigate]);

  return null;
}

export default RefreshHandler;
