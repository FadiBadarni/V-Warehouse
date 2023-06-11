import React from "react";
import useAdminRole from "../../../hooks/useAdminRole";
import AdminLayout from "../Sidebar/AdminLayout";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import images from "../../../constants/images";

import "./Statistics.scss";

const ComingSoonPage = () => {
  return (
    <Box
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundImage: `url(${images.graphs})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          filter: "blur(8px)",
          zIndex: 1,
        }}
      />
      <Typography
        variant="h1"
        style={{
          color: "white",
          fontWeight: "900",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          zIndex: 2,
        }}
      >
        Coming Soon
      </Typography>
    </Box>
  );
};

const Statistics = () => {
  useAdminRole();
  const { i18n } = useTranslation();
  const direction = i18n.language === "he" ? "rtl" : "ltr";

  return (
    <Box className="statistics">
      <AdminLayout direction={direction}></AdminLayout>
      <Box className="statistics__content">
        <ComingSoonPage />
      </Box>
    </Box>
  );
};

export default Statistics;
