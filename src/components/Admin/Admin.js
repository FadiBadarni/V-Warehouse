import React from "react";
import useAdminRole from "../../hooks/useAdminRole";

const Admin = () => {
  useAdminRole();

  return <div>Admin Page</div>;
};

export default Admin;
