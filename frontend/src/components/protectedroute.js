import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './validateuser';


const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  
  if (!isAuthenticated && !isLoading) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute