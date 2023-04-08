import React from "react";
import { TableBody, TableRow, TableCell } from "@mui/material";
import UsersTableRow from "./UsersTableRow";
import RowDetails from "./UsersRowDetails";

const UsersTableBody = ({ users, handleRowClick, expandedRow,handleAccept,handleDelete ,   handleRoleChange}) => {
  return (
    <TableBody>
      {users.length === 0 ? (
        <TableRow>
          <TableCell colSpan={3} align="center">
            No Item Instances
          </TableCell>
        </TableRow>
      ) : (
        users.map((user, index) => (
          <React.Fragment key={user.id}>
            <UsersTableRow
             user={user}
              index={index}
              handleRowClick={handleRowClick}
              handleAccept ={handleAccept}
              handleDelete ={handleDelete}
              handleRoleChange={handleRoleChange}
               
            />
            {expandedRow === index && (
              <TableRow>
                <TableCell colSpan={3}>
                  <RowDetails user={user} />
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
