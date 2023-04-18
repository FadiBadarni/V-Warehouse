import React from "react";
import { TableBody, TableCell, TableRow } from "@mui/material";
import UsersTableRow from "./UsersTableRow";
import RowDetails from "./RowDetails";

const UsersTableBody = ({
  users,
  handleRowClick,
  expandedRow,
  handleUpdate,
  handleDelete,
  updateUser,
}) => {
  return (
    <TableBody className="users-table__body">
      {users.length === 0 ? (
        <TableRow>
          <TableCell colSpan={6} align="center">
            No Users
          </TableCell>
        </TableRow>
      ) : (
        users.map((user, index) => (
          <React.Fragment key={user.id}>
            <UsersTableRow
              user={user}
              index={index}
              handleRowClick={handleRowClick}
              updateUser={updateUser}
              expandedRow={expandedRow}
            />
            {expandedRow === index && (
              <TableRow className="users-table__expanded-row">
                <TableCell colSpan={6}>
                  <RowDetails
                    user={user}
                    handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
                    updateUser={handleUpdate}
                  />
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))
      )}
    </TableBody>
  );
};

export default UsersTableBody;
