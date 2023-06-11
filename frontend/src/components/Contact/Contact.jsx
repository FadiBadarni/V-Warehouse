import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import emailjs from "emailjs-com";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import MessageIcon from "@mui/icons-material/Message";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";

import "./Contact.scss";

const Contact = () => {
  const { t } = useTranslation("contact");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        event.target,
        process.env.REACT_APP_EMAILJS_USER_ID
      )
      .then(
        (result) => {
          setName("");
          setEmail("");
          setMessage("");
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <Box className="contact">
      <Box className="contact__content">
        <Typography variant="h4" className="contact__title">
          {t("contact.getInTouch")}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box className="contact__info">
              <Typography variant="h6" className="contact__info-title">
                {t("contact.contactInformation")}
              </Typography>
              <Typography variant="body1" className="contact__info-item">
                <strong>{t("contact.address")}:</strong> 1234 Fadi St, Anytown,
                Israel
              </Typography>
              <Typography variant="body1" className="contact__info-item">
                <strong>{t("contact.phone")}:</strong> (052) 418-3083
              </Typography>
              <Typography variant="body1" className="contact__info-item">
                <strong>{t("contact.email")}:</strong> fadibadarnii@gmail.com
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="contact__form-paper">
              <form className="contact__form" onSubmit={handleSubmit}>
                <Box className="contact__form-group">
                  <TextField
                    id="name"
                    name="name"
                    label={t("contact.name")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleIcon />
                        </InputAdornment>
                      ),
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                    fullWidth
                    className="contact__form-field"
                    required
                  />
                </Box>
                <Box className="contact__form-group">
                  <TextField
                    id="email"
                    name="email"
                    label={t("contact.email")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    fullWidth
                    className="contact__form-field"
                    required
                  />
                </Box>
                <Box className="contact__form-group">
                  <TextField
                    id="message"
                    name="message"
                    label={t("contact.message")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MessageIcon />
                        </InputAdornment>
                      ),
                    }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    className="contact__form-field"
                    required
                  />
                </Box>
                <Box className="contact__form-group">
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className="contact__form-submit"
                    startIcon={<SendIcon />}
                  >
                    {t("contact.sendMessage")}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Contact;
