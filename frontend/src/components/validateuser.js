// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

// Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status when the app loads
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get("/user/get_user");
        if (response.status === 200) {
          setCurrentUser(response.data);
        } else {
          console.error("Invalid token or unauthorized");
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

const logout = () => {
  window.location.href = "http://127.0.0.1:5000/backend/user/logout";
};

const value = { currentUser, isAuthenticated: !!currentUser, isLoading, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
