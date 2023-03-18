import React from "react";
import AdminLayout from "../AdminLayout";
import "./EquipmentManagement.scss";

const EquipmentManagement = () => {
  return (
    <div className="admin-equipment-management">
      <AdminLayout></AdminLayout>
      <div className="management-section">
        <h2>Item Management</h2>
        <ul>
          <li>
            Camera
            <button>Edit</button>
            <button>Delete</button>
          </li>
          <li>
            Microphone
            <button>Edit</button>
            <button>Delete</button>
          </li>
          <li>
            Laptop
            <button>Edit</button>
            <button>Delete</button>
          </li>
          <li>
            Projector
            <button>Edit</button>
            <button>Delete</button>
          </li>
          <li>
            Headphones
            <button>Edit</button>
            <button>Delete</button>
          </li>
        </ul>
        <button>Add New Item</button>
      </div>
    </div>
  );
};

export default EquipmentManagement;
