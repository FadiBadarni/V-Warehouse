import React from "react";
import { Drawer, List, Toolbar, Hidden } from "@mui/material";
import { useTranslation } from "react-i18next";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListIcon from "@mui/icons-material/List";
import BuildIcon from "@mui/icons-material/Build";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
// import BarChartIcon from "@mui/icons-material/BarChart";
import "./Sidebar.scss";
import SidebarLink from "./SidebarLink";

const AdminLayout = ({ direction }) => {
  const drawerWidth = 60;
  const { t } = useTranslation("sidebar");

  const sidebarLinks = [
    { text: t("sidebar.home"), path: "/admin", icon: <DashboardIcon /> },
    {
      text: t("sidebar.itemList"),
      path: "/admin/item-list",
      icon: <ListIcon />,
    },
    {
      text: t("sidebar.itemManagement"),
      path: "/admin/item-management",
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
    // {
    //   text: t("sidebar.statistics"),
    //   path: "/admin/statistics",
    //   icon: <BarChartIcon />,
    // },
  ];

  const drawer = (
    <div className="badges-container">
      <Toolbar />
      <List>
        {sidebarLinks.map((link) => (
          <SidebarLink key={link.text} {...link} />
        ))}
      </List>
    </div>
  );

  return (
    <div className="sidebar">
      <Hidden smDown implementation="css">
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
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden mdUp implementation="css">
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
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
    </div>
  );
};

export default AdminLayout;
