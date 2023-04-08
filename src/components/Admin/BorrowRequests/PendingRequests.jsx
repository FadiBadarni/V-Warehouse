import React, { memo } from "react";
import { Typography, Box } from "@mui/material";
import RequestsTable from "./RequestsTable";
import { useTranslation } from "react-i18next";

const PendingRequests = ({
  requests,
  handleAccept,
  handleReject,
  handleRowClick,
  expandedRow,
  itemDetails,
  user,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography className="requests-title" variant="h5" gutterBottom>
        {t("borrowRequests.pendingTitle")}
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

export default memo(PendingRequests);
