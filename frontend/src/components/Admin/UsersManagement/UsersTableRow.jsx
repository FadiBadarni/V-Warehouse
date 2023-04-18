import React from "react";
import { TableCell, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import "./UsersManagement.scss";

const UsersTableRow = ({ user, index, handleRowClick, expandedRow }) => {
  const isOpen = expandedRow === index;

  return (
    <motion.tr
      className="users-table__row"
      key={user.id}
      layout
      initial={false}
      animate={isOpen ? "open" : "closed"}
    >
      <TableCell>
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => handleRowClick(index, user.id)}
        >
          {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>
      <TableCell>{user.id}</TableCell>
      <TableCell> {user.email}</TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell> {user.year}</TableCell>
      <TableCell> {user.role}</TableCell>
    </motion.tr>
  );
};

export default UsersTableRow;
