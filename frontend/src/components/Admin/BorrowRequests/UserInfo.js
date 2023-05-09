import React from "react";
import { Typography, Box } from "@mui/material";
import "./RowDetails.scss";

const UserInfo = ({ request, user }) => {
  return (
    <Box className="expanded-row">
      {user && (
        <Box className="expanded-row__user">
          <Typography className="expanded-row__user__title">
            Request Sender Info
          </Typography>
          <Typography>Username: {user.username}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Year: {user.year}</Typography>
          <Typography>User: {user.role}</Typography>
          <Typography>borrowing Reason: {request.borrowingReason}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default UserInfo;
