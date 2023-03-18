import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import LoginFailed from "./components/LoginFailed/LoginFailed";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Admin from "./components/Admin/Admin";
import Warehouse from "./components/Warehouse/Warehouse";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import BorrowedItemDetails from "./components/BorrowedItemDetails/BorrowedItemDetails";
import Unauthorized from "./components/ErrorPages/Unauthorized";

import EquipmentList from "./components/Admin/EquipmentList/EquipmentList";
import EquipmentManagement from "./components/Admin/EquipmentManagement/EquipmentManagement";
import LoanManagement from "./components/Admin/LoanManagement/LoanManagement";
import EquipmentOrders from "./components/Admin/EquipmentOrders/EquipmentOrders";
import Statistics from "./components/Admin/Statistics/Statistics";

import { AuthProvider } from "./contexts/AuthContext";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <Router>
    <AuthProvider>
      <Navbar>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/login-failed" element={<LoginFailed />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/warehouse/item/:id" element={<BorrowedItemDetails />} />

          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/equipment-list" element={<EquipmentList />} />
          <Route path="/admin/equipment-orders" element={<EquipmentOrders />} />
          <Route
            path="/admin/equipment-management"
            element={<EquipmentManagement />}
          />

          <Route path="/admin/loan-management" element={<LoanManagement />} />
          <Route path="/admin/statistics" element={<Statistics />} />

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Navbar>
    </AuthProvider>
  </Router>
);
