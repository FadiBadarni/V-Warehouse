import React from "react";
import { Typography, Box } from "@mui/material";
import "./UsersManagement.scss";
const RowDetails = ({user }) => {
  console.log(user);
  return (
    <Box className="Users__expanded-row">
      <Typography className="more-details-title" variant="h6">
        More Details
      </Typography>
      <Typography>ID: {user.id}</Typography>
      <Typography>Email: {user.email}</Typography>
      <Typography>User Name: {user.Username}</Typography>
      <Typography>Year: {user.year}</Typography>
      <Typography>role: {user.role}</Typography>
    </Box>
  );
};

export default RowDetails;
