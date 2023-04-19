import React from "react";
import AdminLayout from "../Sidebar/AdminLayout";
import { Box, Typography } from "@mui/material";
import useAdminRole from "../../../hooks/useAdminRole";
import { useTranslation } from "react-i18next";
import AddItemForm from "./AddItemForm";

import "./ItemManagement.scss";

const ItemManagement = () => {
  useAdminRole();
  const { i18n } = useTranslation();
  const direction = i18n.language === "he" ? "rtl" : "ltr";

  return (
    <div className="item-management">
      <AdminLayout direction={direction} />
      <Box className="item-management__section">
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          className="item-management__header"
        >
          Add a new item
        </Typography>
        <AddItemForm />
      </Box>
    </div>
  );
};

export default ItemManagement;
