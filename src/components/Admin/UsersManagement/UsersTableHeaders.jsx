import React from "react";
import { TableCell, TableHead, TableRow } from "@mui/material";

const UsersTableHeaders = () => {
  return (
    <TableHead className="users-table__header">
      <TableRow>
        <TableCell />
        <TableCell>ID</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>User Name</TableCell>
        <TableCell>Year</TableCell>
        <TableCell>Role</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default UsersTableHeaders;
