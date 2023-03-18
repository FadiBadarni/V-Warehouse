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
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Navbar>
    </AuthProvider>
  </Router>
);
