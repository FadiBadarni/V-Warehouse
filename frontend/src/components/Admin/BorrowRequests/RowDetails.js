import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import "./RowDetails.scss";
import { getWarehouseItemsByIds } from "../../../api/WarehouseService";

const RowDetails = ({ request, user }) => {
  const [ItemIfo, setItemInfo] = useState();

  useEffect(() => {
    const fetchItemInfo = async () => {
      const x = request.itemIds;
      const ItemIfo = await getWarehouseItemsByIds(x);
      setItemInfo(ItemIfo);
    };
    fetchItemInfo();
  }, []);

  return (
    <Box className="expanded-row">
      <Typography className="expanded-row__title" variant="h6">
        Request No. {request.requestId}
      </Typography>
      <Box className="expanded-row__content">
        <Box className="expanded-row__info">
          {ItemIfo &&
            ItemIfo.map((item) => (
              <Box className="expanded-row__user">
                <Typography className="expanded-row__title" variant="h6">
                  {" "}
                  {item.name}
                </Typography>
                <Typography className="expanded-row__title" variant="h6">
                  {" "}
                  {item.description}
                </Typography>
              </Box>
            ))}
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
