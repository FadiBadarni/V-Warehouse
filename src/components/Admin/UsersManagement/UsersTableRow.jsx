import React from "react";
import { TableRow, TableCell  ,Button,NativeSelect} from "@mui/material";

import "./UsersManagement.scss";
const UsersTableRow = ({ user, index, handleRowClick, handleAccept,
  handleDelete,handleRoleChange }) => {

  return (
    <TableRow
      key={user.id}
      onClick={() => handleRowClick(index, user.id)}
    >
      <TableCell>{user.id}</TableCell>
      <TableCell> {user.email}</TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell> {user.year}</TableCell>
      <TableCell>
        <NativeSelect
          defaultValue={user.role}
          inputProps={{
            name: 'role',
            id: 'uncontrolled-native',
          }}
          onChange={(e)=> handleRoleChange(e, user)}
        >
          <option value={"ADMIN"}>ADMIN</option>
          <option value={"USER"}>USER</option>
          <option value={"TEACHER"}>TEACHER</option>
        </NativeSelect>
      </TableCell>

      {handleAccept &&  handleDelete && (
          <TableCell>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
              // onClick={(event) => {
              //   event.stopPropagation();
              //   handleAccept(user);
              // }}
            >
              UPDATE
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ mr: 1 }}
              onClick={(event) => {
                event.stopPropagation();
                handleDelete(user);
              }}
            >
              Delete
            </Button>
          </TableCell>
        )}
    </TableRow>
  );
};

export default UsersTableRow;
