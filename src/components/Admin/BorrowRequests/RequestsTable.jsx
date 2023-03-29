import React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  Paper,
  TableCell,
  TableRow,
} from "@mui/material";
import RequestsTableHeaders from "./RequestsTableHeaders";
import RequestsTableRow from "./RequestsTableRow";

const RequestsTable = ({
  requests,
  expandedRow,
  handleAccept,
  handleReject,
  handlePickupCancel,
  handlePickupConfirm,
  handleReturn,
  handleOverDue,
  itemDetails,
  user,
  handleRowClick,
  setExpandedRow,
  actionsHeaderTitle,
  showState,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <RequestsTableHeaders actionsHeaderTitle={actionsHeaderTitle} />
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                No Requests
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request, index) => (
              <RequestsTableRow
                key={request.requestId}
                request={request}
                index={index}
                expandedRow={expandedRow}
                handleAccept={handleAccept}
                handleReject={handleReject}
                handlePickupConfirm={handlePickupConfirm}
                handlePickupCancel={handlePickupCancel}
                handleReturn={handleReturn}
                handleOverDue={handleOverDue}
                itemDetails={itemDetails}
                user={user}
                handleRowClick={handleRowClick}
                setExpandedRow={setExpandedRow}
                actionsHeaderTitle={actionsHeaderTitle}
                showState={showState}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestsTable;
