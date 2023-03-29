import React from "react";
import { Typography, Box } from "@mui/material";
import RequestsTable from "./RequestsTable";

const ClosedRequests = ({
  requests,
  handleRowClick,
  expandedRow,
  itemDetails,
  user,
  actionsHeaderTitle,
}) => {
  return (
    <Box>
      <Typography className="rejected-requests-title" variant="h5" gutterBottom>
        Closed Requests
      </Typography>
      <RequestsTable
        requests={requests}
        handleRowClick={handleRowClick}
        expandedRow={expandedRow}
        itemDetails={itemDetails}
        user={user}
        actionsHeaderTitle={actionsHeaderTitle}
        showState={true}
      />
    </Box>
  );
};

export default ClosedRequests;
