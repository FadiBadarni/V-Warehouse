import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

const useAdminRole = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminRole = useCallback(() => {
    if (!loading) {
      if (user && user.role === "ADMIN") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        if (!user) {
          navigate("/auth/login");
        } else {
          navigate("/unauthorized");
        }
      }
    }
  }, [user, navigate, loading]);

  useEffect(() => {
    checkAdminRole();
  }, [user, navigate, loading, checkAdminRole]);

  return isAdmin;
};

export default useAdminRole;
