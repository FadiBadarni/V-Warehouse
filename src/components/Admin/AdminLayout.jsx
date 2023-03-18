import React from "react";
import { Drawer, List, ListItem, ListItemText, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import "./Admin.scss";

const drawerWidth = 240;

const sidebarLinks = [
  { text: "Home", path: "/admin" },
  { text: "Equipment List", path: "/admin/equipment-list" },
  { text: "Equipment Management", path: "/admin/equipment-management" },
  { text: "Loan Management", path: "/admin/loan-management" },
  { text: "Equipment Ordering", path: "/admin/equipment-orders" },
  { text: "Statistics", path: "/admin/statistics" },
];

const AdminLayout = ({ children }) => (
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
      anchor="left"
    >
      <Toolbar />
      <List>
        {sidebarLinks.map(({ text, path }) => (
          <Link to={path} key={text} className="sidebar-link">
            <ListItem ListItemButton>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  </div>
);

export default AdminLayout;
