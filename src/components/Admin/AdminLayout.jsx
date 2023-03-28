import React from "react";
import { Drawer, List, ListItem, ListItemText, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Admin.scss";

const AdminLayout = ({ direction }) => {
  const drawerWidth = 240;
  const { t } = useTranslation();

  const sidebarLinks = [
    { text: t("sidebar.home"), path: "/admin" },
    { text: t("sidebar.equipmentList"), path: "/admin/equipment-list" },
    {
      text: t("sidebar.equipmentManagement"),
      path: "/admin/equipment-management",
    },
    { text: t("sidebar.usersManagement"), path: "/admin/users-management" },
    { text: t("sidebar.borrowRequests"), path: "/admin/borrow-requests" },
    { text: t("sidebar.statistics"), path: "/admin/statistics" },
  ];
  return (
    <div className="admin-page">
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor={direction === "rtl" ? "right" : "left"}
      >
        <Toolbar />
        <List>
          {sidebarLinks.map(({ text, path }) => (
            <Link to={path} key={text} className="sidebar-link">
              <ListItem button>
                <ListItemText primary={text} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default AdminLayout;
