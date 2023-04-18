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
  setitemsId,
  items,
  activeTab
}) => {
  return (
    <Box>
      <Typography className="requests-title" variant="h5" gutterBottom>
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
        setitemsId={ setitemsId}
        items={items}
        activeTab={activeTab}
      />
    </Box>
  );
};

export default AwaitingPickupRequests;
