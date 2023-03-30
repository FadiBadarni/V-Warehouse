import React, { useState } from "react";
import AdminLayout from "../AdminLayout";
import { TextField, Button, Grid, Box, Typography } from "@mui/material";
import { addEquipmentItem } from "../../../api/AdminService";
import "./EquipmentManagement.scss";
import useAdminRole from "../../../hooks/useAdminRole";
import { useTranslation } from "react-i18next";
import CheckMark from "./CheckMark";

const EquipmentManagement = () => {
  useAdminRole();
  const { i18n } = useTranslation();
  const direction = i18n.language === "he" ? "rtl" : "ltr";
  const [showCheckMark, setShowCheckMark] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [itemType, setItemType] = useState("");
  const [attributes, setAttributes] = useState([
    { attributeName: "", attributeValue: "" },
  ]);

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const addAttributeField = () => {
    setAttributes([...attributes, { attributeName: "", attributeValue: "" }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const item = {
      name,
      description,
      quantity,
      itemType: { name: itemType, attributes },
    };
    const result = await addEquipmentItem(item);
    if (result) {
      console.log("Item added successfully:", result);
      setName("");
      setDescription("");
      setQuantity("");
      setItemType("");
      setAttributes([{ attributeName: "", attributeValue: "" }]);

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
                id="item-type"
                label="Item Type"
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
              />
            </Grid>
            {attributes.map((attribute, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={`Attribute Name ${index + 1}`}
                    value={attribute.attributeName}
                    onChange={(e) =>
                      handleAttributeChange(
                        index,
                        "attributeName",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={`Attribute Value ${index + 1}`}
                    value={attribute.attributeValue}
                    onChange={(e) =>
                      handleAttributeChange(
                        index,
                        "attributeValue",
                        e.target.value
                      )
                    }
                  />
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button
                onClick={addAttributeField}
                variant="outlined"
                color="primary"
                fullWidth
              >
                Add Attribute
              </Button>
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
