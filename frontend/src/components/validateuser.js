// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

// Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status when the app loads
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Validate token and get user data
        const response = await api.get("/user/get_user");
        if (response.status === 200) {
          const userData = await response.data;
          setCurrentUser(userData);
          setIsVerified(userData.verified);
        } else {
          // If token is invalid, clear it
          console.error("Invalid token or unauthorized");
          localStorage.removeItem("token");
          setCurrentUser(null);
          setIsVerified(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setCurrentUser(null);
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post(
        "/user/login",
        { email: email, password: password });

      if (response.status !== 200) {
        const errorData = await response.data;
        throw new Error(errorData.message || "Login failed");
      }

      // Get user details after login
      const userResponse = await api.get("/user/get_user");

      if (userResponse.status === 200) {
        const userData = await userResponse.data;
        setCurrentUser(userData);
        setIsVerified(userData.verified);
        return { success: true, data: response.data };
      } else {
        throw new Error("Failed to get user data");
      }
    } catch (error) {
      return { success: false, error: error.response.data.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setIsVerified(false);
  };

  // Check if user is authenticated
  const isAuthenticated = !!currentUser;

  const value = {
    currentUser,
    isAuthenticated,
    isVerified,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = () => useContext(AuthContext);
// Custom hook to use the auth context
//export const useAuth = () => {
//  const login = async (email, password) => {
//    try {
//      const response = await api.post("/user/login", {
//        email,
//        password,
//      });
//
//      return {
//        success: true,
//        data: response.data,
//      };
//    } catch (error) {
//      return {
//        success: false,
//        error: error.response?.data?.message || "Innlogging feilet",
//      };
//    }
//  };
//
//  return { login };
//};
