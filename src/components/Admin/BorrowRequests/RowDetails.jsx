import React from "react";
import { Typography, Box } from "@mui/material";

const RowDetails = ({ request, user, itemDetails }) => {
  return (
    <Box className="borrow-requests__expanded-row">
      <Typography className="more-details-title" variant="h6">
        More Details
      </Typography>
      <Typography>Request ID: {request.id}</Typography>
      <Typography>Item Name: {itemDetails.name}</Typography>
      <Typography>Item Description: {itemDetails.description}</Typography>
      <Typography>Item Type: {itemDetails.type}</Typography>
      <Typography>
        Accompanying Equipment: {itemDetails.accompanyingEquipment}
      </Typography>
      <Typography>
        Safety Instructions: {itemDetails.safetyInstructions}
      </Typography>
      {user && (
        <Box>
          <Typography>User Info:</Typography>
          <Typography>Username: {user.username}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Year: {user.year}</Typography>
          <Typography>Role: {user.role}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default RowDetails;
