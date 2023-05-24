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
import {
  getItemsIdsByRequestId,
  getItemInstancesByItemId,
} from "../../../api/BorrowService";
import { getCountInstancesTime } from "../../../api/WarehouseService";

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
}) => {
  const customized = customStatus(request.status);
  const [items, setItems] = useState([]);
  const { i18n, t } = useTranslation("borrowRequests");
  const [returnButtonIsDisable, setReturnButtonIsDisable] = useState(true);
  const [acceptButtonIsDisable, setAcceptButtonIsDisable] = useState(true);
  const [allInstances, setAllInstances] = useState([]);
  const [allItemIds, setAllItemIds] = useState([]);
  const [instancesCount, setInstancesCount] = useState();

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
    if (expandedRow === index) {
      getItemsIdsByRequestId(request.requestId)
        .then((itemsIds) => {
          setAllItemIds(itemsIds);
          const itemInstancesPromises = itemsIds.map((itemId) =>
            getItemInstancesByItemId(itemId)
          );
          return Promise.all(itemInstancesPromises);
        })
        .then((allItemInstances) => {
          setAllInstances(allItemInstances);
        })
        .catch((error) => console.error("Error fetching item ids:", error));
    }
  }, [expandedRow, index, request.requestId]);

  useEffect(() => {
    const fetchItemInfo = async () => {
      const InstancesCount = await getCountInstancesTime(request.requestId);
      setInstancesCount(InstancesCount);
    };
    fetchItemInfo();
  }, [request.requestId]);

  // const availabilityCheck = () => {
  //   for (let i = 0; i < request.itemIds.length; i++) {
  //     const itemId = request.itemIds[i];
  //     if (instancesCount && instancesCount.available[itemId] === 0) {
  //       return 0;
  //     }
  //     if (instancesCount && instancesCount.required[itemId] > request.itemIds) {
  //       return 1;
  //     }
  //   }
  //   return 2;
  // };

  return (
    <React.Fragment>
      <TableRow
        onClick={() => handleRowClick(index, request.itemId, request)}
        sx={{ cursor: "pointer" }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              setExpandedRow(expandedRow === index ? -1 : index);
            }}
          >
            {expandedRow === index ? (
              <KeyboardArrowUp />
            ) : (
              <KeyboardArrowDown />
            )}
          </IconButton>
        </TableCell>
        <TableCell>{request.userId}</TableCell>
        <TableCell>{formatDate(request.intendedStartDate)}</TableCell>
        <TableCell>{formatDate(request.intendedReturnDate)}</TableCell>
        <TableCell>{request.itemIds.join(", ")}</TableCell>

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
              }}
            >
              {t("borrowRequests.pendingRequests.approve")}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                handleReject(request);
              }}
            >
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
              disabled={acceptButtonIsDisable}
            >
              Confirm
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ mr: 1 }}
              onClick={(event) => {
                event.stopPropagation();
                handlePickupCancel(request);
              }}
            >
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
              disabled={returnButtonIsDisable}
            >
              confirm
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                handleOverDue(request);
              }}
            >
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
                  request={request}
                  user={user}
                  setItems={setItems}
                  items={items}
                  activeTab={activeTab}
                  allInstances={allInstances}
                  allItemIds={allItemIds}
                  setReturnButtonIsDisable={setReturnButtonIsDisable}
                  setAcceptButtonIsDisable={setAcceptButtonIsDisable}
                />
              </Box>
            ) : (
              <Box sx={{ margin: 2 }}>
                <RowDetails
                  request={request}
                  user={user}
                  instancesCount={instancesCount}
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
