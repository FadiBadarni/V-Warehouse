import React, { useEffect, useState } from "react";
import useAdminRole from "../../../hooks/useAdminRole";
import AdminLayout from "../AdminLayout";
import { getWarehouseRequests } from "../../../api/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Paper,
  Box,
  TableSortLabel,
} from "@mui/material";

import "./EquipmentOrders.scss";

const EquipmentOrders = () => {
  useAdminRole();

  const [requests, setRequests] = useState([]);
  const [orderBy, setOrderBy] = useState("sentRequestTime");
  const [order, setOrder] = useState("desc");

  const handleSortRequestDate = () => {
    if (orderBy === "sentRequestTime" && order === "desc") {
      setOrder("asc");
    } else {
      setOrderBy("sentRequestTime");
      setOrder("desc");
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await getWarehouseRequests();
        setRequests(requests);
      } catch (error) {
        console.error("Error fetching warehouse items:", error);
      }
    };

    fetchRequests();
  }, []);

  const sortedRequests = requests.sort((a, b) => {
    const dateA = new Date(a.sentRequestTime);
    const dateB = new Date(b.sentRequestTime);

    if (order === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  return (
    <Box className="equipment-orders">
      <AdminLayout />
      <Box className="equipment-orders__content">
        <Typography
          className="equipment-orders__title"
          variant="h4"
          gutterBottom
        >
          Equipment Orders
        </Typography>
        <Typography
          className="equipment-orders__pending-title"
          variant="h5"
          gutterBottom
        >
          Pending Orders:
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Item ID</TableCell>
                <TableCell>Borrowing Start Period</TableCell>
                <TableCell>Borrowing End Period</TableCell>
                <TableCell>Reason For Borrowing</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "sentRequestTime"}
                    direction={order}
                    onClick={handleSortRequestDate}
                  >
                    Request Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRequests.map((request, index) => (
                <TableRow key={index}>
                  <TableCell>{request.userId}</TableCell>
                  <TableCell>{request.itemId}</TableCell>
                  <TableCell>
                    {request.intendedStartDate.replace("T", " ").slice(0, 16)}
                  </TableCell>
                  <TableCell>
                    {request.intendedReturnDate.replace("T", " ").slice(0, 16)}
                  </TableCell>
                  <TableCell>{request.borrowingReason}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>
                    {request.sentRequestTime.replace("T", " ").slice(0, 19)}
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                      Approve
                    </Button>
                    <Button variant="contained" color="error">
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default EquipmentOrders;
