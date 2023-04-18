import React from "react";
import { TableRow, TableCell } from "@mui/material";
import "./Statistics.scss";
const InstancesTableRow = ({ instance, index, handleRowClick }) => {
  return (
    <TableRow
      key={instance.id}
      onClick={() => handleRowClick(index, instance.id)}
    >
      <TableCell>{instance.instanceId}</TableCell>
      <TableCell>{instance.itemName}</TableCell>
      <TableCell>{instance.state}</TableCell>
    </TableRow>
  );
};

export default InstancesTableRow;
