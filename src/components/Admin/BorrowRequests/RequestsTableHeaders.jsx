import React from "react";
import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";

const RequestsTableHeaders = ({ orderBy, order, handleSortRequestDate }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell />
        <TableCell>Student ID</TableCell>
        <TableCell>Item ID</TableCell>
        <TableCell>Borrowing Start</TableCell>
        <TableCell>Borrowing End</TableCell>
        <TableCell>Borrowing Reason</TableCell>
        <TableCell>Quantity</TableCell>
        <TableCell>
          <TableSortLabel
            active={orderBy === "sentRequestTime"}
            direction={order}
            onClick={handleSortRequestDate}
          >
            Request Date
          </TableSortLabel>
        </TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default RequestsTableHeaders;
