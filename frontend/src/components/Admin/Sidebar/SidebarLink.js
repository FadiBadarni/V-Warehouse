import React from "react";
import { ListItem, ListItemIcon, Tooltip, Badge } from "@mui/material";
import { NavLink } from "react-router-dom";

const SidebarLink = ({ text, path, icon }) => (
  <NavLink
    to={path}
    end
    className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
  >
    <Tooltip title={text} placement="right">
      <ListItem button>
        <Badge color="secondary">
          <ListItemIcon>
            <span className="icon-large">{icon}</span>
          </ListItemIcon>
        </Badge>
      </ListItem>
    </Tooltip>
  </NavLink>
);

export default SidebarLink;
