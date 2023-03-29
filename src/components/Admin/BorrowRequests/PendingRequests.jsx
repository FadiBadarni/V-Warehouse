import React from "react";
import { Typography, Box } from "@mui/material";
import RequestsTable from "./RequestsTable";

const PendingRequests = ({
  requests,
  handleAccept,
  handleReject,
  handleRowClick,
  expandedRow,
  itemDetails,
  user,
}) => {
  return (
    <Box>
      <Typography className="pending-requests-title" variant="h5" gutterBottom>
        Requests Pending
      </Typography>
      <RequestsTable
        requests={requests}
        handleAccept={handleAccept}
        handleReject={handleReject}
        handleRowClick={handleRowClick}
        expandedRow={expandedRow}
        itemDetails={itemDetails}
        user={user}
      />
    </Box>
  );
};

export default PendingRequests;
