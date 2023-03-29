import React from "react";
import { Typography, Box } from "@mui/material";

import RequestsTable from "./RequestsTable";

const AwaitingPickupRequests = ({
  requests,
  handleRowClick,
  handlePickupConfirm,
  handlePickupCancel,
  expandedRow,
  itemDetails,
  user,
  actionsHeaderTitle,
}) => {
  return (
    <Box>
      <Typography
        className="waiting-for-pickup-requests-title"
        variant="h5"
        gutterBottom
      >
        Requests Awaiting Pickup
      </Typography>
      <RequestsTable
        requests={requests}
        handleRowClick={handleRowClick}
        handlePickupConfirm={handlePickupConfirm}
        handlePickupCancel={handlePickupCancel}
        expandedRow={expandedRow}
        itemDetails={itemDetails}
        user={user}
        actionsHeaderTitle={actionsHeaderTitle}
      />
    </Box>
  );
};

export default AwaitingPickupRequests;
