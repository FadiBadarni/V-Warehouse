import React, { useState } from "react";
import useAdminRole from "../../hooks/useAdminRole";
import AdminLayout from "./Sidebar/AdminLayout";
import { useTranslation } from "react-i18next";
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import BroadcastOnPersonalIcon from "@mui/icons-material/BroadcastOnPersonal";
import { broadcastMessageToAllUsers } from "../../api/AdminService";
import CheckMark from "./ItemManagement/CheckMark";
import ListIcon from "@mui/icons-material/List";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";

import "./Admin.scss";

const Admin = () => {
  useAdminRole();
  const { i18n, t } = useTranslation("adminHome");
  const direction = i18n.language === "he" ? "rtl" : "ltr";
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastMessageError, setBroadcastMessageError] = useState("");
  const [showCheckMark, setShowCheckMark] = useState(false);

  const validateBroadcastMessage = () => {
    if (broadcastMessage.trim() === "") {
      setBroadcastMessageError("The broadcast message cannot be empty.");
      return false;
    } else if (broadcastMessage.trim().length < 10) {
      setBroadcastMessageError(
        "The broadcast message must be at least 10 characters long."
      );
      return false;
    } else {
      setBroadcastMessageError("");
      return true;
    }
  };

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (validateBroadcastMessage()) {
      await broadcastMessageToAllUsers(broadcastMessage);
      setShowCheckMark(true);
      setTimeout(() => setShowCheckMark(false), 3000);
      setBroadcastMessage("");
    }
  };

  return (
    <div className="admin-home">
      <AdminLayout direction={direction}></AdminLayout>
      <Container>
        <Box className="admin-home__content">
          <Box className="admin-home__header">
            <div>{t("adminHome.title")}</div>
          </Box>
          <Box mt={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} className="admin-section">
                  <AssignmentIcon
                    fontSize="large"
                    className="admin-section__icon"
                  />
                  <Typography variant="h6">
                    {t("adminHome.requestsTitle")}
                  </Typography>
                  <Button
                    component={Link}
                    to="/admin/borrow-requests"
                    variant="contained"
                    size="small"
                    className="admin-section__button"
                  >
                    {t("adminHome.requestsButton")}
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} className="admin-section">
                  <PeopleIcon
                    fontSize="large"
                    className="admin-section__icon"
                  />
                  <Typography variant="h6">
                    {t("adminHome.usersTitle")}
                  </Typography>
                  <Button
                    component={Link}
                    to="/admin/users-management"
                    variant="contained"
                    size="small"
                    className="admin-section__button"
                  >
                    {t("adminHome.usersButton")}
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} className="admin-section">
                  <ListIcon fontSize="large" className="admin-section__icon" />
                  <Typography variant="h6">
                    {t("adminHome.listTitle")}
                  </Typography>
                  <Button
                    component={Link}
                    to="/admin/item-list"
                    variant="contained"
                    size="small"
                    className="admin-section__button"
                  >
                    {t("adminHome.listButton")}
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={3} className="admin-section">
                  <BroadcastOnPersonalIcon
                    fontSize="large"
                    className="admin-section__icon"
                  />
                  <Typography variant="h6">
                    {t("adminHome.broadcastTitle")}
                  </Typography>
                  <Box
                    component="form"
                    mt={2}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    onSubmit={handleBroadcastSubmit}
                  >
                    <TextField
                      label={t("adminHome.broadcastMessageLabel")}
                      multiline
                      rows={3}
                      fullWidth
                      variant="outlined"
                      className="admin-section__input"
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                    />
                    {broadcastMessageError && (
                      <div
                        className="broadcast-message-error"
                        style={{ marginTop: "1rem", color: "red" }}
                      >
                        {broadcastMessageError}
                      </div>
                    )}
                    <CheckMark show={showCheckMark} />
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      className="admin-section__button"
                      mt={2}
                    >
                      {t("adminHome.broadcastButton")}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Admin;
