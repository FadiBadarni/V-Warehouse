import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import LoginFailed from "./components/LoginFailed/LoginFailed";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Admin from "./components/Admin/Admin";
import Warehouse from "./components/Warehouse/Warehouse";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import ItemReservation from "./components/ItemReservation/ItemReservation";
import Unauthorized from "./components/ErrorPages/Unauthorized";
import NotFound from "./components/ErrorPages/NotFound";
import ItemList from "./components/Admin/ItemList/ItemList";
import ItemManagement from "./components/Admin/ItemManagement/ItemManagement";
import BorrowRequests from "./components/Admin/BorrowRequests/BorrowRequests";
import Statistics from "./components/Admin/Statistics/Statistics";
import UsersManagement from "./components/Admin/UsersManagement/UsersManagement";
import { useAuth } from "./contexts/AuthContext";
import { Modal, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { useTranslation } from "react-i18next";
import Faqs from "./components/Faqs/Faqs";
import Terms from "./components/Terms/Terms";
import Contact from "./components/Contact/Contact";
import Select from "./components/Warehouse/Select";
import Room from "./components/Warehouse/Room/Room";

function App() {
  const { i18n } = useTranslation();
  const [, setDirection] = useState("ltr");

  useEffect(() => {
    setDirection(i18n.language === "hr" ? "rtl" : "ltr");
  }, [i18n.language]);

  const { showTokenExpiredModal, setShowTokenExpiredModal } = useAuth();
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setShowTokenExpiredModal(false);
    navigate("/auth/login");
  };
  return (
    <>
      <Navbar>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/faqs" element={<Faqs />} />
          <Route exact path="/terms" element={<Terms />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/login-failed" element={<LoginFailed />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/warehouse/item/:id" element={<ItemReservation />} />
          <Route path="/warehouse/items/:ids" element={<ItemReservation />} />
          <Route path="/select" element={<Select />} />
          <Route path="/room" element={<Room />} />

          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/item-list" element={<ItemList />} />
          <Route path="/admin/borrow-requests" element={<BorrowRequests />} />
          <Route path="/admin/item-management" element={<ItemManagement />} />

          <Route path="/admin/users-management" element={<UsersManagement />} />
          <Route path="/admin/statistics" element={<Statistics />} />

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Navbar>
      <Modal
        open={showTokenExpiredModal}
        onClose={handleCloseModal}
        size="tiny">
        <Modal.Header>Session Expired</Modal.Header>
        <Modal.Content>
          <p>Your session has expired. Please log in again.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleCloseModal} primary>
            Log In
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default App;
