import React from "react";
import { ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { Link } from "react-router-dom";

const SidebarLink = ({ text, path, icon }) => (
  <Link to={path} className="sidebar-link">
    <ListItem button>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  </Link>
);

export default SidebarLink;
