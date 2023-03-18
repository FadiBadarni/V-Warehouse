import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useAdminRole = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      navigate("/unauthorized");
    }
  }, [user, navigate, loading]);
};

export default useAdminRole;
