import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import "./RowDetails.scss";
import { getWarehouseItemsByIds } from "../../../api/WarehouseService";
import UserInfo from "./UserInfo";

const RowDetails = ({ request, user, instancesCount }) => {
  const [ItemIfo, setItemInfo] = useState();
  useEffect(() => {
    const fetchItemInfo = async () => {
      const ItemIfo = await getWarehouseItemsByIds(request.itemIds);
      setItemInfo(ItemIfo);
    };
    fetchItemInfo();
  }, [request.itemIds]);

  return (
    <Box className="expanded-row">
      <Box className="expanded-row__content">
        <Box className="expanded-row__info">
          {ItemIfo &&
            instancesCount &&
            ItemIfo.map((item) => (
              <Box className="expanded-row__user">
                <Typography className="expanded-row__title" variant="h6">
                  {"{" + item.id + "}  " + item.name}
                </Typography>
                <Box className="expanded-row__details">
                  <Typography
                    className="expanded-row__title"
                    variant="subtitle2"
                  >
                    {"Available: "}
                    <Typography
                      component="span"
                      style={{
                        color:
                          instancesCount.available[item.id] === 0
                            ? "red"
                            : "green",
                        fontSize: "1.2rem",
                      }}
                    >
                      {instancesCount.available[item.id]}
                    </Typography>
                    {" From " + item.quantity}
                  </Typography>
                  <Typography className="expanded-row__title">
                    {"Required: "}
                    <span
                      style={{
                        color:
                          item.quantity <= instancesCount.required[item.id]
                            ? "red"
                            : "green",
                        fontSize: "1.2rem",
                      }}
                    >
                      {instancesCount.required[item.id]}
                    </span>
                  </Typography>
                </Box>
              </Box>
            ))}
        </Box>
        <UserInfo request={request} user={user} />
      </Box>
      <Typography className="expanded-row__title" variant="h12">
        Request No. {request.requestId}
      </Typography>
    </Box>
  );
};

export default RowDetails;
