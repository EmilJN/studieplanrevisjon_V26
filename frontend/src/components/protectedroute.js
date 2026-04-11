import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./validateuser";
import NavBar from "./navbar";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
