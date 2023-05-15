import React from "react";
import { Typography, Box } from "@mui/material";
import "./RowDetails.scss";

const UserInfo = ({ request, user }) => {
  return (
    <Box className="expanded-row">
      {user && (
        <Box className="expanded-row__user">
          <div>Request Sender: {user.username}</div>
          <div>Sender's Email: {user.email}</div>
          <div>Sender's Role: {user.role}</div>
          <div>Sender's Borrwing Reason: {request.borrowingReason}</div>
        </Box>
      )}
    </Box>
  );
};

export default UserInfo;
