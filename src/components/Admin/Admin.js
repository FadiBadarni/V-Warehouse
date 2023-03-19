import React from "react";
import useAdminRole from "../../hooks/useAdminRole";
import AdminLayout from "./AdminLayout";
import "./Admin.scss";

const Admin = () => {
  useAdminRole();

  return (
    <div className="admin-home">
      <AdminLayout></AdminLayout>
      <div className="home-content">
        <div className="header">
          <h1>Admin Control Panel Home Page</h1>
        </div>
      </div>
    </div>
  );
};

export default Admin;
