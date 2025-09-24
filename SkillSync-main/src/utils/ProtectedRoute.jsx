import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireOnboarded = false }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Not logged in → go to login
  if (!user._id) return <Navigate to="/auth" replace />;

  // Requires onboarded, but user hasn't done it yet → send to onboard
  if (requireOnboarded && !user.isOnboarded) {
    return <Navigate to="/onboard" replace />;
  }

  // User already onboarded but tries to visit /onboard → redirect to dash
  if (!requireOnboarded && user.isOnboarded) {
    return <Navigate to="/dash" replace />;
  }

  return children;
}