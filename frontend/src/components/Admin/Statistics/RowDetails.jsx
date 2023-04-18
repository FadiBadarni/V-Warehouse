import React from "react";
import { Typography, Box } from "@mui/material";
import "./Statistics.scss";
const RowDetails = ({ instance }) => {
  console.log(instance);
  return (
    <Box className="statistics__expanded-row">
      <Typography className="more-details-title" variant="h6">
        More Details
      </Typography>
      <Typography>Instance ID: {instance.instanceId}</Typography>
      <Typography>Item Name: {instance.itemName}</Typography>
      <Typography>State: {instance.state}</Typography>
    </Box>
  );
};

export default RowDetails;
