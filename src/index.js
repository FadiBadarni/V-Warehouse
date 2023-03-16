import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Dashboard from "./components/Dashboard/Dashboard";
import LoginFailed from "./components/LoginFailed/LoginFailed";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Admin from "./components/Admin/Admin";
import { AuthProvider } from "./contexts/AuthContext";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <Router>
    <AuthProvider>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/login-failed" element={<LoginFailed />} />
        <Route path="/auth/error" element={<ErrorPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AuthProvider>
  </Router>
);
