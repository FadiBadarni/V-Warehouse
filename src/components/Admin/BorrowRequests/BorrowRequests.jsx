import React, { useEffect, useState } from "react";
import useAdminRole from "../../../hooks/useAdminRole";
import AdminLayout from "../AdminLayout";
import { useTranslation } from "react-i18next";
import { getWarehouseRequests, getUserById } from "../../../api/admin";
import { getWarehouseItemById, translateText } from "../../../api/api";
import { Typography, Box } from "@mui/material";
import RequestsTable from "./RequestsTable";
import "./BorrowRequests.scss";

const BorrowRequests = () => {
  useAdminRole();
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "he" ? "rtl" : "ltr";

  const [requests, setRequests] = useState([]);
  const [expandedRow, setExpandedRow] = useState(-1);
  const [itemDetails, setItemDetails] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await getWarehouseRequests();
        setRequests(requests);
      } catch (error) {
        console.error("Error fetching warehouse items:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleRowClick = async (index, itemId, request) => {
    setExpandedRow(expandedRow === index ? -1 : index);
    await fetchItemDetails(itemId, request.userId);
    const user = await getUserById(request.userId);
    setUser(user);
  };

  const fetchItemDetails = async (itemId, userId) => {
    try {
      const itemDetails = await getWarehouseItemById(itemId);
      if (i18n.language !== "en") {
        const translatedName = await translateText(
          itemDetails.name,
          i18n.language
        );
        const translatedDescription = await translateText(
          itemDetails.description,
          i18n.language
        );
        const translatedType = await translateText(
          itemDetails.type,
          i18n.language
        );
        const translatedAccompanyingEquipment = await translateText(
          itemDetails.accompanyingEquipment,
          i18n.language
        );
        const translatedSafetyInstructions = await translateText(
          itemDetails.safetyInstructions,
          i18n.language
        );
        setItemDetails({
          ...itemDetails,
          name: translatedName,
          description: translatedDescription,
          type: translatedType,
          accompanyingEquipment: translatedAccompanyingEquipment,
          safetyInstructions: translatedSafetyInstructions,
        });
      } else {
        setItemDetails(itemDetails);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
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
        <Typography
          className="borrow-requests__pending-title"
          variant="h5"
          gutterBottom
        >
          {t("borrowRequests.pendingTitle")}
        </Typography>
        <RequestsTable
          requests={requests}
          expandedRow={expandedRow}
          itemDetails={itemDetails}
          user={user}
          handleRowClick={handleRowClick}
          setExpandedRow={setExpandedRow}
        />
      </Box>
    </Box>
  );
};

export default BorrowRequests;
