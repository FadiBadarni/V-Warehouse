import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import "./RowDetails.scss";
import { getWarehouseItemsByIds } from "../../../api/WarehouseService";
import UserInfo from "./UserInfo";
import { useTranslation } from "react-i18next";

const RowDetails = ({ request, user }) => {
  const [itemInfo, setItemInfo] = useState([]);
  const { t, i18n } = useTranslation("borrowRequests");

  useEffect(() => {
    const fetchItemInfo = async () => {
      const items = await getWarehouseItemsByIds(request.itemIds);
      setItemInfo(items);
    };
    fetchItemInfo();
  }, [request.itemIds]);

  const itemNames = itemInfo.map((item) => item.name).join(", ");

  return (
    <Box className="expanded-row">
      <Box className="expanded-row__details">
        <div className="expanded-row__details__title">
          {t("rowDetails.requestId")} {request.requestId}
        </div>
        <div className="expanded-row__details__information">
          <div>
            {t("rowDetails.requestedItems")} {itemNames}
          </div>
          <div>
            {t("rowDetails.startingDate")}
            {new Date(request.intendedStartDate).toLocaleDateString()}{" "}
            {new Date(request.intendedStartDate).toLocaleTimeString(
              i18n.language,
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }
            )}
          </div>
          <div>
            {t("rowDetails.returningDate")}
            {new Date(request.intendedReturnDate).toLocaleDateString()}{" "}
            {new Date(request.intendedReturnDate).toLocaleTimeString(
              i18n.language,
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }
            )}
          </div>
          <div>
            {t("rowDetails.borrowingReason")} {request.borrowingReason}
          </div>
          <div>
            {t("rowDetails.requestStatus")} {request.status}
          </div>
        </div>
      </Box>
      <UserInfo request={request} user={user} />
    </Box>
  );
};

export default RowDetails;
