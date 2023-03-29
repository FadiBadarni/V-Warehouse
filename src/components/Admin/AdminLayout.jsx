import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Toolbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListIcon from "@mui/icons-material/List";
import BuildIcon from "@mui/icons-material/Build";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import "./Admin.scss";

const SidebarLink = ({ text, path, icon }) => (
  <Link to={path} className="sidebar-link">
    <ListItem button>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  </Link>
);

const AdminLayout = ({ direction }) => {
  const drawerWidth = 240;
  const { t } = useTranslation();

  const sidebarLinks = [
    { text: t("sidebar.home"), path: "/admin", icon: <DashboardIcon /> },
    {
      text: t("sidebar.equipmentList"),
      path: "/admin/equipment-list",
      icon: <ListIcon />,
    },
    {
      text: t("sidebar.equipmentManagement"),
      path: "/admin/equipment-management",
      icon: <BuildIcon />,
    },
    {
      text: t("sidebar.usersManagement"),
      path: "/admin/users-management",
      icon: <PeopleIcon />,
    },
    {
      text: t("sidebar.borrowRequests"),
      path: "/admin/borrow-requests",
      icon: <AssignmentIcon />,
    },
    {
      text: t("sidebar.statistics"),
      path: "/admin/statistics",
      icon: <BarChartIcon />,
    },
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
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.text} {...link} />
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default AdminLayout;
