import React from "react";
import { Typography, Box } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PeopleIcon from "@mui/icons-material/People";
import InfoIcon from "@mui/icons-material/Info";
import CommentIcon from "@mui/icons-material/Comment";
import { useTranslation } from "react-i18next";

import "./RowDetails.scss";

const UserInfo = ({ request, user }) => {
  const { t } = useTranslation("userInfo");

  return (
    <Box className="expanded-row">
      {user && (
        <Card className="user-details-card">
          <div className="card__header"></div>
          <CardContent className="card__content">
            <Typography variant="h6" className="card__title">
              {t("userInfo.userInformation")}
            </Typography>
            <Typography variant="h6" className="card__helper-text">
              <PeopleIcon className="card__icon" /> {t("userInfo.username")} -{" "}
              {user.username}
            </Typography>
            <Typography variant="h6" className="card__item">
              <EmailIcon className="card__icon" /> {t("userInfo.email")} -{" "}
              {user.email}
            </Typography>
            <Typography variant="h6" className="card__item">
              <InfoIcon className="card__icon" /> {t("userInfo.role")} -{" "}
              {user.role}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default UserInfo;
