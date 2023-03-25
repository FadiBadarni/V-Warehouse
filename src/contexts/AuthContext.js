import { createContext, useContext, useState, useEffect } from "react";
import { getUserInfo } from "../api/api";
import jwtDecode from "jwt-decode";

const initialAuthContextValue = {
  isAuthenticated: false,
  login: async (token) => {},
  user: null,
  logout: () => {},
  loading: true,
  showTokenExpiredModal: false,
  setShowTokenExpiredModal: () => {},
};

export const AuthContext = createContext(initialAuthContextValue);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showTokenExpiredModal, setShowTokenExpiredModal] = useState(false);

  const checkAuthentication = async () => {
    const token = await window.localStorage.getItem("token");
    setIsAuthenticated(!!token);
    if (token) {
      try {
        const userInfo = await getUserInfo();
        if (userInfo.status === "TokenExpired") {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("userId");
          setIsAuthenticated(false);
          setUser(null);
          setShowTokenExpiredModal(true);
        } else {
          setUser(userInfo);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const login = async (token) => {
    window.localStorage.setItem("token", token);
    setIsAuthenticated(true);
    try {
      const userInfo = await getUserInfo(); // Fetch user info
      const decodedToken = jwtDecode(token);
      userInfo.roles = decodedToken.roles;
      setUser(userInfo); // Set user state
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  const logout = () => {
    window.localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null); // Clear user state
  };

  const value = {
    isAuthenticated,
    login,
    user,
    logout,
    loading,
    showTokenExpiredModal,
    setShowTokenExpiredModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
