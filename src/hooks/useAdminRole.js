import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const useAdminRole = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user && user.role === "ADMIN") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        navigate("/unauthorized");
      }
    }
  }, [user, navigate, loading]);

  return isAdmin;
};

export default useAdminRole;
