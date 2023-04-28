import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import emailjs from "emailjs-com";
import "./Contact.scss";

const Contact = () => {
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
          console.log(result.text);
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
          Get in Touch
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box className="contact__info">
              <Typography variant="h6" className="contact__info-title">
                Contact Information
              </Typography>
              <Typography variant="body1" className="contact__info-item">
                <strong>Address:</strong> 1234 Fadi St, Anytown, Israel
              </Typography>
              <Typography variant="body1" className="contact__info-item">
                <strong>Phone:</strong> (052) 418-3083
              </Typography>
              <Typography variant="body1" className="contact__info-item">
                <strong>Email:</strong> fadibadarnii@gmail.com
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
                    label="Name"
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
                    label="Email"
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
                    label="Message"
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
                  >
                    Send Message
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
