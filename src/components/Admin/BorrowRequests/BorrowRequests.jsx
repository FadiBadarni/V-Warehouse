import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { getUserById } from "../../../api/admin";
import useAdminRole from "../../../hooks/useAdminRole";
import AdminLayout from "../AdminLayout";
import useBorrowRequests from "../../../hooks/useBorrowRequests";
import PendingRequests from "./PendingRequests";
import AwaitingPickupRequests from "./AwaitingPickupRequests";
import ClosedRequests from "./ClosedRequests";
import PendingReturnRequests from "./PendingReturnRequests";
import "./BorrowRequests.scss";
import useItemDetails from "../../../hooks/useItemDetails";

const BorrowRequests = () => {
  useAdminRole();
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const direction = i18n.language === "he" ? "rtl" : "ltr";
  const [activeTab, setActiveTab] = useState(0);
  const [expandedPendingRow, setExpandedPendingRow] = useState(-1);
  const [expandedWaitingRow, setExpandedWaitingRow] = useState(-1);
  const [expandedRejectedRow, setExpandedRejectedRow] = useState(-1);
  const [expandedClosedRow, setExpandedClosedRow] = useState(-1);
  const { itemDetails, fetchItemDetails } = useItemDetails();
  const {
    pendingRequests,
    awaitingPickupRequests,
    pendingReturnRequests,
    closedRequests,
    handleAccept,
    handleReject,
    handlePickupConfirm,
    handlePickupCancel,
    handleReturn,
    handleOverDue,
  } = useBorrowRequests();

  const handleRowClick = async (index, itemId, request) => {
    if (activeTab === 0) {
      setExpandedPendingRow(expandedPendingRow === index ? -1 : index);
    } else if (activeTab === 1) {
      setExpandedWaitingRow(expandedWaitingRow === index ? -1 : index);
    } else if (activeTab === 2) {
      setExpandedRejectedRow(expandedRejectedRow === index ? -1 : index);
    } else if (activeTab === 3) {
      setExpandedClosedRow(expandedClosedRow === index ? -1 : index);
    }

    await fetchItemDetails(itemId, request.userId);
    const user = await getUserById(request.userId);
    setUser(user);
  };

  return (
    <Box className="borrow-requests">
      <AdminLayout direction={direction}></AdminLayout>
      <Box className="borrow-requests__content">
        <Typography
          className="borrow-requests__title"
          variant="h4"
          gutterBottom
        >
          {t("borrowRequests.title")}
        </Typography>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Pending Requests" />
          <Tab label="Waiting For Pickup Requests" />
          <Tab label="Return Pending Requests" />
          <Tab label="Closed Requests" />
        </Tabs>
        {activeTab === 0 && (
          <PendingRequests
            requests={pendingRequests}
            handleAccept={handleAccept}
            handleReject={handleReject}
            handleRowClick={handleRowClick}
            expandedRow={expandedPendingRow}
            itemDetails={itemDetails}
            user={user}
          />
        )}
        {activeTab === 1 && (
          <AwaitingPickupRequests
            requests={awaitingPickupRequests}
            handleRowClick={handleRowClick}
            handlePickupConfirm={handlePickupConfirm}
            handlePickupCancel={handlePickupCancel}
            expandedRow={expandedWaitingRow}
            itemDetails={itemDetails}
            user={user}
          />
        )}
        {activeTab === 2 && (
          <PendingReturnRequests
            requests={pendingReturnRequests}
            handleRowClick={handleRowClick}
            handleReturn={handleReturn}
            handleOverDue={handleOverDue}
            expandedRow={expandedRejectedRow}
            itemDetails={itemDetails}
            user={user}
          />
        )}
        {activeTab === 3 && (
          <ClosedRequests
            requests={closedRequests}
            handleRowClick={handleRowClick}
            expandedRow={expandedClosedRow}
            itemDetails={itemDetails}
            user={user}
            actionsHeaderTitle="State"
          />
        )}
      </Box>
    </Box>
  );
};

export default BorrowRequests;
