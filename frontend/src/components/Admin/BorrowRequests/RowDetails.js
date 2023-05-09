import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import "./RowDetails.scss";
import {
  getWarehouseItemsByIds,
  getCountInstancesTime,
} from "../../../api/WarehouseService";

const RowDetails = ({ request, user }) => {
  const [ItemIfo, setItemInfo] = useState();
  const [InstancesCount, setInstancesCount] = useState();
  useEffect(() => {
    const fetchItemInfo = async () => {
      const x = request.itemIds;
      const ItemIfo = await getWarehouseItemsByIds(x);
      setItemInfo(ItemIfo);
    };
    fetchItemInfo();
  }, []);

  useEffect(() => {
    const fetchItemInfo = async () => {
      const InstancesCount = await getCountInstancesTime(request.requestId);
      setInstancesCount(InstancesCount);
      // setItemInfo(ItemIfo);
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
            InstancesCount &&
            ItemIfo.map((item) => (
              <Box className="expanded-row__user">
                <Typography className="expanded-row__title" variant="subtitle1">
                  {"{" + item.id + "}  " + item.name}
                </Typography>
                <Box className="expanded-row__details">
                  <Typography
                    className="expanded-row__title"
                    variant="subtitle2">
                    {"Available: "}
                    <Typography
                      component="span"
                      style={{
                        color:
                          InstancesCount.available[item.id] === 0
                            ? "red"
                            : "green",
                      }}>
                      {InstancesCount.available[item.id]}
                    </Typography>
                    {" From " + item.quantity}
                  </Typography>
                  <Typography
                    className="expanded-row__title"
                    variant="subtitle2">
                    {"Required: "}
                    <span
                      style={{
                        color:
                          item.quantity < InstancesCount.required[item.id]
                            ? "red"
                            : "green",
                      }}>
                      {InstancesCount.required[item.id]}
                    </span>
                  </Typography>
                </Box>
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
