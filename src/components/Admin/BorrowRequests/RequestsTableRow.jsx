import React from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Button,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import RowDetails from "./RowDetails";

const RequestsTableRow = ({
  request,
  index,
  expandedRow,
  itemDetails,
  user,
  handleRowClick,
  setExpandedRow,
}) => {
  return (
    <React.Fragment>
      <TableRow
        onClick={() => handleRowClick(index, request.itemId, request)}
        sx={{ cursor: "pointer" }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              setExpandedRow(expandedRow === index ? -1 : index);
            }}
          >
            {expandedRow === index ? (
              <KeyboardArrowUp />
            ) : (
              <KeyboardArrowDown />
            )}
          </IconButton>
        </TableCell>
        <TableCell>{request.userId}</TableCell>
        <TableCell>{request.itemId}</TableCell>
        <TableCell>
          {request.intendedStartDate.replace("T", " ").slice(0, 16)}
        </TableCell>
        <TableCell>
          {request.intendedReturnDate.replace("T", " ").slice(0, 16)}
        </TableCell>
        <TableCell>{request.borrowingReason}</TableCell>
        <TableCell>{request.quantity}</TableCell>
        <TableCell>
          {request.sentRequestTime.replace("T", " ").slice(0, 19)}
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            Reject
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <RowDetails
                request={request}
                user={user}
                itemDetails={itemDetails}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default RequestsTableRow;
