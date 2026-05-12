import toast from "react-hot-toast";
import { useAuth } from "../store/authStore";
import { Navigate } from "react-router";

function ProtectedRoute({ children, allowedRoles }) {
  //get user login status from store
  const { loading, currentUser, isAuthenticated} = useAuth();
  //loading state
  if (loading) {
    return <p>Loading...</p>;
  }
  //if user not logged in
  if (!isAuthenticated) {
    toast.error("Redirecting to login page.",{duration:2000})
    //redirect to Login
    return <Navigate to="/login" replace />;
  }

  //check roles
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
   
    //redirect to Login
    
    return <Navigate to="/unauthorized" replace state={{ redirectTo: "/" }} />;
  }

  return children;
}

export default ProtectedRoute;