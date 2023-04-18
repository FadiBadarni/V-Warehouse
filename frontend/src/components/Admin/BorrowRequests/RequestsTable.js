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
  user,
  handleRowClick,
  setExpandedRow,
  actionsHeaderTitle,
  showState,
  setitemsId,
  items,
  activeTab
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
                user={user}
                handleRowClick={handleRowClick}
                setExpandedRow={setExpandedRow}
                actionsHeaderTitle={actionsHeaderTitle}
                showState={showState}
                setitemsId={setitemsId}
                items={items}
                activeTab={activeTab}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestsTable;
