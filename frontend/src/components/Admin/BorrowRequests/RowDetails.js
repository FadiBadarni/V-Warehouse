import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import "./RowDetails.scss";
import { getWarehouseItemById } from "../../../api/WarehouseService";

const RowDetails = ({ request, user, availdabelQuantity }) => {
  const [ItemIfo, setItemInfo] = useState();

  useEffect(() => {
    const fetchItemInfo = async () => {
      const ItemIfo = await getWarehouseItemById(request.itemId);
      setItemInfo(ItemIfo);
    };
    fetchItemInfo();
  }, []);

  return (
    <Box className="expanded-row">
      <Typography className="expanded-row__title" variant="h6">
     
        {ItemIfo && (
          <Box className="expanded-row__user">
            <Typography className="expanded-row__title" variant="h6">
              {" "}
              {ItemIfo.name}
            </Typography>
            <Typography className="expanded-row__title" variant="h6">
              {" "}
              {ItemIfo.description}
            </Typography>
          </Box>
        )}
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
                pending Quantity:{" "}
                {availdabelQuantity.pendingQuantity - request.quantity}
              </Typography>
              <Typography>
                Available Items Ids:
                {availdabelQuantity.availableQuantity !== 0 ? (
                  availdabelQuantity.availableItemsIds.map((id) => (
                    <li key={id}>{id}</li>
                  ))
                ) : (
                  <h4>None</h4>
                )}
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
