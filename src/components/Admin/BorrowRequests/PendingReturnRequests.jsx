import React from "react";
import { Typography, Box } from "@mui/material";
import RequestsTable from "./RequestsTable";

const PendingReturnRequests = ({
  requests,
  handleReturn,
  handleOverDue,
  handleRowClick,
  expandedRow,
  itemDetails,
  user,
}) => {
  return (
    <Box>
      <Typography className="pending-requests-title" variant="h5" gutterBottom>
        Requests Pending Return
      </Typography>
      <RequestsTable
        requests={requests}
        handleReturn={handleReturn}
        handleOverDue={handleOverDue}
        handleRowClick={handleRowClick}
        expandedRow={expandedRow}
        itemDetails={itemDetails}
        user={user}
      />
    </Box>
  );
};

export default PendingReturnRequests;
