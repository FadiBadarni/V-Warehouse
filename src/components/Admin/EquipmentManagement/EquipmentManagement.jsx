import React, { useState } from "react";
import AdminLayout from "../AdminLayout";
import { TextField, Button, Grid, Box, Typography } from "@mui/material";
import { addEquipmentItem } from "../../../api/admin";
import "./EquipmentManagement.scss";
import useAdminRole from "../../../hooks/useAdminRole";
import { useTranslation } from "react-i18next";
import CheckMark from "./CheckMark";
const EquipmentManagement = () => {
  useAdminRole();
  const { i18n } = useTranslation();
  const direction = i18n.language === "he" ? "rtl" : "ltr";

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
    <div className="equipment-management">
      <AdminLayout direction={direction} />
      <Box className="equipment-management__section">
        <Typography variant="h4" component="h2" gutterBottom>
          Add New Equipment Item
        </Typography>
        <form onSubmit={handleSubmit} className="equipment-management__form">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="name"
                label="Equipment Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="description"
                label="Equipment Description"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="quantity"
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="type"
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="safety-instructions"
                label="Safety Instructions"
                multiline
                rows={3}
                value={safetyInstructions}
                onChange={(e) => setSafetyInstructions(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="accompanying-equipment"
                label="Accompanying Equipment"
                multiline
                rows={3}
                value={accompanyingEquipment}
                onChange={(e) => setAccompanyingEquipment(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="h3" gutterBottom>
                QR Code
              </Typography>
              {/* <QRCode value={name} /> */}
            </Grid>
            <Grid item xs={12} className="equipment-management__checkmark">
              <CheckMark show={showCheckMark} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                type="submit"
                className="equipment-management__submit-button"
                variant="contained"
                color="primary"
                fullWidth
              >
                Add Item
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
};

export default EquipmentManagement;
