import React from "react";
import useAdminRole from "../../hooks/useAdminRole";
import AdminLayout from "./AdminLayout";
import "./Admin.scss";

const Admin = () => {
  useAdminRole();

  return (
    <div className="admin-home">
      <AdminLayout></AdminLayout>
      <div className="home-content"></div>
    </div>
  );
};

export default Admin;
