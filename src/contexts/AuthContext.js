import { createContext, useContext, useState, useEffect } from "react";
import { getUserInfo } from "../api/api";
export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await window.localStorage.getItem("token");
      setIsAuthenticated(!!token);
      if (token) {
        try {
          const userInfo = await getUserInfo();
          setUser(userInfo);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
      setLoading(false);
    };

    checkAuthentication();
  }, []);

  const login = async (token) => {
    window.localStorage.setItem("token", token);
    setIsAuthenticated(true);
    try {
      const userInfo = await getUserInfo(); // Fetch user info
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
