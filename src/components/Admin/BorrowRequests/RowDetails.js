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
        <Box className="expanded-row__info">
          {/* {itemInstances.map((instance, index) => ( */}
            {/* <Box key={index} className="expanded-row__instance"> */}
              <Typography className="expanded-row__instance__title">
                Requested Item Info
              </Typography>
              {/* <Typography>Instance ID: {instance.id}</Typography> */}
              {/* <Typography>Instance State: {instance.state}</Typography>
              <Typography>Instance Item ID: {instance.itemId}</Typography> */}
            {/* </Box> */}
          {/* ))} */}
        </Box>
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
