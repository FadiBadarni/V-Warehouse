import React, { useState, useEffect } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Button,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import RowDetailsQR from "./RowDetailsQR";
import RowDetails from "./RowDetails";
import { useTranslation } from "react-i18next";
import customStatus from "./Utils/CustomStatus";
import { getItemInstancesByRequestId } from "../../../api/BorrowService";
import { getAvaildabelQuantity } from "../../../api/AdminService";

const RequestsTableRow = ({
  request,
  index,
  handleAccept,
  handleReject,
  handlePickupConfirm,
  handlePickupCancel,
  handleReturn,
  handleOverDue,
  expandedRow,
  user,
  handleRowClick,
  setExpandedRow,
  showState,
  activeTab,
  // setitemsId,
  // items
}) => {
  const customized = customStatus(request.status);
  const [itemInstances, setItemInstances] = useState([]);
  const [items, setItems] = useState([]);
  const { i18n, t } = useTranslation("borrowRequests");
  const [acceptButtonIsDisabled, setAcceptButtonIsDisabled] = useState(true);
  const [returnButtonIsDisable, setReturnButtonIsDisable] = useState(true);

  const [availdabelQuantity, setAvaildabelQuantity] = useState();
  const [scheduleItemIstanceIDs, setScheduleItemIstanceIDs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const availableQuantity = await getAvaildabelQuantity(
        request.itemId,
        request.intendedStartDate,
        request.intendedReturnDate
      );
      setAvaildabelQuantity(availableQuantity);
    };
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat(i18n.language, options).format(date);
  };

  useEffect(() => {
    if (activeTab === 2)
      if (expandedRow === index) {
        getItemInstancesByRequestId(request.requestId)
          .then((instances) => setItemInstances(instances))
          .catch((error) =>
            console.error("Error fetching item instances:", error)
          );
      }
  }, [expandedRow, index, request.requestId, activeTab]);

  return (
    <React.Fragment>
      <TableRow
        onClick={() => handleRowClick(index, request.itemId, request)}
        sx={{ cursor: "pointer" }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              setExpandedRow(expandedRow === index ? -1 : index);
            }}>
            {expandedRow === index ? (
              <KeyboardArrowUp />
            ) : (
              <KeyboardArrowDown />
            )}
          </IconButton>
        </TableCell>
        {}
        <TableCell>{request.userId}</TableCell>
        <TableCell>{formatDate(request.intendedStartDate)}</TableCell>
        <TableCell>{formatDate(request.intendedReturnDate)}</TableCell>
        <TableCell>{request.itemId}</TableCell>
        {availdabelQuantity && activeTab === 0 ? (
          <>
            {availdabelQuantity.availableQuantity < request.quantity ? (
              <TableCell style={{ borderBottom: "3px solid red" }}>
                {availdabelQuantity.availableQuantity} / {request.quantity}
              </TableCell>
            ) : availdabelQuantity.pendingQuantity - request.quantity >
              request.quantity ? (
              <TableCell style={{ borderBottom: "3px solid yellow" }}>
                {availdabelQuantity.availableQuantity + "/" + request.quantity}
              </TableCell>
            ) : (
              <TableCell style={{ borderBottom: "3px solid green" }}>
                {availdabelQuantity.availableQuantity + "/" + request.quantity}
              </TableCell>
            )}
          </>
        ) : (
          <TableCell>{request.quantity}</TableCell>
        )}
        <TableCell>{formatDate(request.requestTime)}</TableCell>

        {handleAccept && handleReject && (
          <TableCell>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
              onClick={(event) => {
                event.stopPropagation();
                handleAccept(request);
              }}>
              {t("borrowRequests.pendingRequests.approve")}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                handleReject(request);
              }}>
              {t("borrowRequests.pendingRequests.reject")}
            </Button>
          </TableCell>
        )}

        {handlePickupConfirm && (
          <TableCell>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
              onClick={(event) => {
                event.stopPropagation();
                handlePickupConfirm(request, items);
              }}
              disabled={acceptButtonIsDisabled}>
              Confirm
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ mr: 1 }}
              onClick={(event) => {
                event.stopPropagation();
                handlePickupCancel(request);
              }}>
              Cancel
            </Button>
          </TableCell>
        )}
        {handleReturn && handleOverDue && (
          <TableCell>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
              onClick={(event) => {
                event.stopPropagation();
                handleReturn(request);
              }}
              disabled={returnButtonIsDisable}>
              confirm
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                handleOverDue(request);
              }}>
              OverDue
            </Button>
          </TableCell>
        )}
        {showState && (
          <TableCell style={customized.style}>{customized.text}</TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
            {activeTab === 1 || activeTab === 2 ? (
              <Box sx={{ margin: 2 }}>
                <RowDetailsQR
                  availdabelQuantity={availdabelQuantity}
                  request={request}
                  user={user}
                  setItems={setItems}
                  items={items}
                  setAcceptButtonIsDisable={setAcceptButtonIsDisabled}
                  activeTab={activeTab}
                  setReturnButtonIsDisable={setReturnButtonIsDisable}
                />
              </Box>
            ) : (
              <Box sx={{ margin: 2 }}>
                <RowDetails
                  request={request}
                  user={user}
                  availdabelQuantity={availdabelQuantity}
                />
              </Box>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default RequestsTableRow;
