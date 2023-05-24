import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getUserInfo } from "../api/UserService";
import jwtDecode from "jwt-decode";

const initialAuthContextValue = {
  isAuthenticated: false,
  login: async (token) => {},
  user: null,
  logout: () => {},
  loading: true,
  showTokenExpiredModal: false,
  setShowTokenExpiredModal: () => {},
  handleTokenExpired: () => {},
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

  const checkAuthentication = useCallback(async () => {
    const token = await window.localStorage.getItem("token");
    setIsAuthenticated(!!token);
    if (token) {
      try {
        const userInfo = await getUserInfo();
        if (userInfo.status === "TokenExpired") {
          handleTokenExpired();
        } else {
          setUser(userInfo);
        }
      } catch (error) {
        console.error("Error fetching user info :", error);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const handleTokenExpired = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUser(null);
    setShowTokenExpiredModal(true);
  };

  const login = async (token) => {
    window.localStorage.setItem("token", token);
    setIsAuthenticated(true);
    try {
      const userInfo = await getUserInfo();
      const decodedToken = jwtDecode(token);
      userInfo.roles = decodedToken.roles;
      setUser(userInfo);
    } catch (error) {
      console.error("Error fetching user info123:", error);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    login,
    user,
    logout,
    loading,
    showTokenExpiredModal,
    setShowTokenExpiredModal,
    handleTokenExpired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
