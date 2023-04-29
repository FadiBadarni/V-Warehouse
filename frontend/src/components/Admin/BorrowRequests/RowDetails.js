import React from "react";
import { Typography, Box } from "@mui/material";
import "./RowDetails.scss";

const RowDetails = ({ request, user, availdabelQuantity }) => {
  return (
    <Box className="expanded-row">
      <Typography className="expanded-row__title" variant="h6">
        Request No. {request.requestId}
      </Typography>
      <Box className="expanded-row__content">
        <Box className="expanded-row__info">
          {availdabelQuantity && (
            <Box className="expanded-row__user">
              <Typography className="expanded-row__user__title">
                Request Sender Info
              </Typography>
              <Typography>
                available Quantity: {availdabelQuantity.availableQuantity}
              </Typography>
              <Typography>
                pending Quantity: {availdabelQuantity.pendingQuantity}
              </Typography>
              <Typography>
                Available Items Ids:
                {availdabelQuantity.availableItemsIds.map((id) => (
                  <li key={id}>{id}</li>
                ))}
              </Typography>
            </Box>
          )}
        </Box>
        {user && (
          <Box className="expanded-row__user">
            <Typography className="expanded-row__user__title">
              Request Sender Info
            </Typography>
            <Typography>Username: {user.username}</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Year: {user.year}</Typography>
            <Typography>User: {user.role}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RowDetails;
