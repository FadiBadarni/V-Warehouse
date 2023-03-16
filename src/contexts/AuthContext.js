import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await window.localStorage.getItem("token");
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuthentication();
  }, []);

  const login = (token) => {
    window.localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
