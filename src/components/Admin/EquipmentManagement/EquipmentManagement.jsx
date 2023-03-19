import React, { useState } from "react";
import AdminLayout from "../AdminLayout";
import TextField from "@mui/material/TextField";
import { addEquipmentItem } from "../../../api/admin";
import "./EquipmentManagement.scss";
import useAdminRole from "../../../hooks/useAdminRole";
import CheckMark from "./CheckMark";
const EquipmentManagement = () => {
  useAdminRole();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("");
  const [safetyInstructions, setSafetyInstructions] = useState("");
  const [accompanyingEquipment, setAccompanyingEquipment] = useState("");
  const [showCheckMark, setShowCheckMark] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const item = {
      name,
      description,
      quantity,
      type,
      safetyInstructions,
      accompanyingEquipment,
    };
    const result = await addEquipmentItem(item);
    if (result) {
      console.log("Item added successfully:", result);
      setName("");
      setDescription("");
      setQuantity("");
      setType("");
      setSafetyInstructions("");
      setAccompanyingEquipment("");

      setShowCheckMark(true);
      setTimeout(() => setShowCheckMark(false), 3000);
    } else {
      console.error("Failed to add the item.");
      // Show an error message to the user
    }
  };

  return (
    <div className="admin-equipment-management">
      <AdminLayout></AdminLayout>
      <div className="management-section">
        <h2>Add New Equipment Item</h2>
        <form onSubmit={handleSubmit} className="equipment-form">
          <div className="form-group">
            <TextField
              id="name"
              label="Equipment Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="name"
            />
          </div>
          <div className="form-group">
            <TextField
              id="description"
              label="Equipment Description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="description"
            />
          </div>
          <div className="form-group">
            <TextField
              id="quantity"
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="quantity"
            />
          </div>
          <div className="form-group">
            <TextField
              id="type"
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="type"
            />
          </div>
          <div className="form-group">
            <TextField
              id="safety-instructions"
              label="Safety Instructions"
              multiline
              rows={3}
              value={safetyInstructions}
              onChange={(e) => setSafetyInstructions(e.target.value)}
              className="safety-instructions"
            />
          </div>
          <div className="form-group">
            <TextField
              id="accompanying-equipment"
              label="Accompanying Equipment"
              multiline
              rows={3}
              value={accompanyingEquipment}
              onChange={(e) => setAccompanyingEquipment(e.target.value)}
              className="accompanying-equipment"
            />
          </div>
          <CheckMark show={showCheckMark} />

          <button
            type="submit"
            className="submit-button"
            variant="contained"
            color="primary"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default EquipmentManagement;
