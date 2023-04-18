import React from "react";
import { TableBody, TableRow, TableCell } from "@mui/material";
import InstancesTableRow from "./InstancesTableRow";
import RowDetails from "./RowDetails";

const InstancesTableBody = ({ itemInstances, handleRowClick, expandedRow }) => {
  return (
    <TableBody>
      {itemInstances.length === 0 ? (
        <TableRow>
          <TableCell colSpan={3} align="center">
            No Item Instances
          </TableCell>
        </TableRow>
      ) : (
        itemInstances.map((instance, index) => (
          <React.Fragment key={instance.id}>
            <InstancesTableRow
              instance={instance}
              index={index}
              handleRowClick={handleRowClick}
            />
            {expandedRow === index && (
              <TableRow>
                <TableCell colSpan={3}>
                  <RowDetails instance={instance} />
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))
      )}
    </TableBody>
  );
};

export default InstancesTableBody;
