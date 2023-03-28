import React from "react";
import { Table, TableBody, TableContainer, Paper } from "@mui/material";
import RequestsTableHeaders from "./RequestsTableHeaders";
import RequestsTableRow from "./RequestsTableRow";

const RequestsTable = ({
  requests,
  expandedRow,
  itemDetails,
  user,
  handleRowClick,
  setExpandedRow,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <RequestsTableHeaders />
        <TableBody>
          {requests.map((request, index) => (
            <RequestsTableRow
              key={index}
              request={request}
              index={index}
              expandedRow={expandedRow}
              itemDetails={itemDetails}
              user={user}
              handleRowClick={handleRowClick}
              setExpandedRow={setExpandedRow}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestsTable;
