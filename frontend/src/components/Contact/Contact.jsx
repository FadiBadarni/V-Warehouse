import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import "./Contact.scss";

const Contact = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <motion.Box
      className="contact"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Typography variant="h4" className="contact__title">
        Get in Touch
      </Typography>
      <Box className="contact__content">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box className="contact__info">
              <Typography variant="h6" className="contact__info-title">
                Contact Information
              </Typography>
              <Typography variant="body1" className="contact__info-item">
                <strong>Address:</strong> 1234 Example St, Anytown, USA
              </Typography>
              <Typography variant="body1" className="contact__info-item">
                <strong>Phone:</strong> (555) 123-4567
              </Typography>
              <Typography variant="body1" className="contact__info-item">
                <strong>Email:</strong> info@example.com
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="contact__form-paper">
              <form className="contact__form">
                <Box className="contact__form-group">
                  <TextField
                    id="name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    className="contact__form-field"
                  />
                </Box>
                <Box className="contact__form-group">
                  <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    className="contact__form-field"
                  />
                </Box>
                <Box className="contact__form-group">
                  <TextField
                    id="message"
                    label="Message"
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    className="contact__form-field"
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
    </motion.Box>
  );
};

export default Contact;
