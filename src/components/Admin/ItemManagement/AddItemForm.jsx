import React, { useState } from "react";
import { TextField, Button, Grid } from "@mui/material";
import {
  addEquipmentItem,
  fetchItemNames,
  getItemByName,
} from "../../../api/AdminService";
import CheckMark from "./CheckMark";
import Autocomplete from "@mui/material/Autocomplete";
import QRCode from "react-qr-code";
import QRCodePrint from "./QRCodePrint";

import "./ItemManagement.scss";

const EquipmentForm = () => {
  const [showCheckMark, setShowCheckMark] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [itemType, setItemType] = useState("");
  const [isExistingItem, setIsExistingItem] = useState(false);
  const [generatedQRCodes, setGeneratedQRCodes] = useState([]);

  const [isPrintButtonDisabled, setIsPrintButtonDisabled] = useState(true);

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

  const [itemNames, setItemNames] = useState([]);
  const handleNameInputClick = async () => {
    const fetchedItemNames = await fetchItemNames();
    if (fetchedItemNames) {
      setItemNames(fetchedItemNames);
    }
  };

  const handleSelectItem = async (selectedItemName) => {
    if (selectedItemName) {
      const selectedItem = await getItemByName(selectedItemName);
      if (selectedItem) {
        setName(selectedItem.name);
        setDescription(selectedItem.description);
        setItemType(selectedItem.itemType.name);
        if (
          selectedItem.itemType.attributes &&
          selectedItem.itemType.attributes.length > 0
        ) {
          setAttributes(
            selectedItem.itemType.attributes.map((attr) => ({
              attributeName: attr.attributeName,
              attributeValue: attr.attributeValue,
            }))
          );
        } else {
          setAttributes([{ attributeName: "", attributeValue: "" }]);
        }
        setIsExistingItem(true);
      }
    } else {
      setName("");
      setDescription("");
      setItemType("");
      setAttributes([{ attributeName: "", attributeValue: "" }]);
      setIsExistingItem(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const item = {
      name,
      description,
      quantity,
      itemType: { name: itemType, attributes },
    };
    const itemInstances = await addEquipmentItem(item);
    console.log(itemInstances);
    if (itemInstances) {
      console.log("Item added successfully:", itemInstances);

      setName("");
      setDescription("");
      setQuantity("");
      setItemType("");
      setAttributes([{ attributeName: "", attributeValue: "" }]);

      // Generate QR codes for each created item instance
      const qrCodes = itemInstances.map((itemInstance) => {
        const qrCodeData = {
          instanceId: itemInstance.id,
          itemId: itemInstance.itemId,
        };

        return (
          <Grid item xs={6} sm={4} md={3} lg={2} key={itemInstance.id}>
            <div className="qr-code-container">
              <QRCode value={JSON.stringify(qrCodeData)} size={128} />
              <div className="qr-code-details">
                <div>{itemInstance.itemId}</div>
                <div>{name}</div>
              </div>
            </div>
          </Grid>
        );
      });

      setGeneratedQRCodes(qrCodes);
      setIsPrintButtonDisabled(false); // Enable the print button

      setShowCheckMark(true);
      setIsExistingItem(false);
      setTimeout(() => setShowCheckMark(false), 3000);
    } else {
      console.error("Failed to add the item.");
      // Show an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="equipment-management__form">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            fullWidth
            id="name"
            options={itemNames}
            getOptionLabel={(option) => option}
            freeSolo
            onChange={async (event, selectedItemName) => {
              handleSelectItem(selectedItemName);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Equipment Name"
                onFocus={handleNameInputClick}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            )}
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
            disabled={isExistingItem}
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
            disabled={isExistingItem}
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
                  handleAttributeChange(index, "attributeName", e.target.value)
                }
                disabled={isExistingItem}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`Attribute Value ${index + 1}`}
                value={attribute.attributeValue}
                onChange={(e) =>
                  handleAttributeChange(index, "attributeValue", e.target.value)
                }
                disabled={isExistingItem}
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
            disabled={isExistingItem}
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
        <Grid item xs={12}>
          <QRCodePrint
            generatedQRCodes={generatedQRCodes}
            isPrintButtonDisabled={isPrintButtonDisabled}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default EquipmentForm;
