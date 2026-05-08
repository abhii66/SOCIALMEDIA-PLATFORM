import { useAuth } from "../store/authStore";
import { Navigate } from "react-router";

function ProtectedRoute({ children, allowedRoles }) {
  const { loading, currentUser, isAuthenticated } = useAuth();

  if (loading) {
    return <p className="text-center text-sm text-[#a1a1a6] py-20 animate-pulse">Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admins are allowed everywhere unless specific roles are listed
  if (allowedRoles) {
    const userRole = currentUser?.isAdmin ? "ADMIN" : "USER";
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
