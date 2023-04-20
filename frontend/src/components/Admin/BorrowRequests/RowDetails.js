import React from "react";
import { Typography, Box } from "@mui/material";
import "./RowDetails.scss";
const RowDetails = ({ request, user, itemInstances }) => {
  return (
    <Box className="expanded-row">
      <Typography className="expanded-row__title" variant="h6">
        Request No. {request.requestId}
      </Typography>
      <Box className="expanded-row__content">
        {user && (
          <Box className="expanded-row__user">
            <Typography className="expanded-row__user__title">
              Request Sender Info
            </Typography>
            <Typography>Username: {user.username}</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Year: {user.year}</Typography>
            <Typography>Role: {user.role}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RowDetails;
