import React from "react";
import useAdminRole from "../../hooks/useAdminRole";
import AdminLayout from "./AdminLayout";
import { useTranslation } from "react-i18next";
import "./Admin.scss";

const Admin = () => {
  useAdminRole();
  const { i18n } = useTranslation();
  const direction = i18n.language === "he" ? "rtl" : "ltr";

  return (
    <div className="admin-home">
      <AdminLayout direction={direction}></AdminLayout>
      <div className="home-content">
        <div className="header">
          <h1>Admin Control Panel Home Page</h1>
        </div>
      </div>
    </div>
  );
};

export default Admin;
