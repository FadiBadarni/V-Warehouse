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
  activeTab
}) => {
  return (
    <Box>
      <Typography className="requests-title" variant="h5" gutterBottom>
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
        activeTab={ activeTab}
      />
    </Box>
  );
};

export default PendingReturnRequests;
