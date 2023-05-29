import React from "react";
import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
const RequestsTableHeaders = ({
  orderBy,
  order,
  handleSortRequestDate,
  actionsHeaderTitle,
}) => {
  const { t } = useTranslation("borrowRequests");
  return (
    <TableHead>
      <TableRow>
        <TableCell />
        <TableCell>{t("borrowRequests.tableHeaders.id")}</TableCell>
        <TableCell>{t("borrowRequests.tableHeaders.startDate")}</TableCell>
        <TableCell>{t("borrowRequests.tableHeaders.returnDate")}</TableCell>
        <TableCell>{t("borrowRequests.tableHeaders.itemName")}</TableCell>
        <TableCell>
          <TableSortLabel
            active={orderBy === "sentRequestTime"}
            direction={order}
            onClick={handleSortRequestDate}
          >
            {t("borrowRequests.tableHeaders.requestDate")}
          </TableSortLabel>
        </TableCell>
        <TableCell>
          {actionsHeaderTitle || `${t("borrowRequests.tableHeaders.actions")}`}
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default RequestsTableHeaders;
