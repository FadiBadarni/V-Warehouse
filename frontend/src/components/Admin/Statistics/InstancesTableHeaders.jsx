import React from "react";
import { TableCell, TableHead, TableRow } from "@mui/material";

const InstancesTableHeaders = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Instance ID</TableCell>
        <TableCell>Item Name</TableCell>
        <TableCell>State</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default InstancesTableHeaders;
