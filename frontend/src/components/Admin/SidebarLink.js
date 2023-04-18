import React from "react";
import { ListItem, ListItemIcon, Tooltip, Badge } from "@mui/material";
import { Link } from "react-router-dom";

const SidebarLink = ({ text, path, icon }) => (
  <Link to={path} className="sidebar-link">
    <Tooltip title={text} placement="right">
      <ListItem button>
        <Badge color="secondary">
          <ListItemIcon>
            <span className="icon-large">{icon}</span>
          </ListItemIcon>
        </Badge>
      </ListItem>
    </Tooltip>
  </Link>
);

export default SidebarLink;
