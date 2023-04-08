import React from "react";
import { TableCell, TableHead, TableRow } from "@mui/material";

const UsersTableHeaders = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>User Name</TableCell>
        <TableCell>Year</TableCell>
        <TableCell>Role</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default UsersTableHeaders;
