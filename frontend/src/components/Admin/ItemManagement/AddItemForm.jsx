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
import { fetchedItemTypes } from "../../../api/WarehouseService";

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

  const [itemTypes, setItemTypes] = useState([]);
  const handleTypeInputClick = async () => {
    const fetchedItemType = await fetchedItemTypes();
    if (fetchedItemType) {
      setItemTypes(fetchedItemType);
    }
  };

  const handleSelectNameItem = async (selectedItemName) => {
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

      // Reset fields
      setName("");
      setDescription("");
      setQuantity("");
      setItemType("");
      setAttributes([{ attributeName: "", attributeValue: "" }]);
      setIsExistingItem(false);
      setIsPrintButtonDisabled(false); // Enable the print button

      // Clear item names and item types to reload them on next focus
      setItemNames([]);
      setItemTypes([]);

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

      setShowCheckMark(true);
      setTimeout(() => setShowCheckMark(false), 3000);
    } else {
      console.error("Failed to add the item.");
      // Show an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="item-management__form">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            autoFocus
            fullWidth
            id="name"
            options={itemNames}
            getOptionLabel={(option) => option}
            freeSolo
            inputValue={name}
            onInputChange={(event, newInputValue) => {
              setName(newInputValue);
            }}
            onChange={async (event, selectedItemName) => {
              handleSelectNameItem(selectedItemName);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Item Name"
                onFocus={handleNameInputClick}
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            fullWidth
            id="item-type"
            options={itemTypes}
            getOptionLabel={(option) => option}
            freeSolo
            disabled={isExistingItem}
            value={itemType}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Item Type"
                onFocus={handleTypeInputClick}
                onChange={(event) => setItemType(event.target.value)}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="description"
            label="Item Description"
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
            inputProps={{ min: 1 }}
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

        <CheckMark show={showCheckMark} />

        <Grid item xs={12} md={6}>
          <Button
            type="submit"
            className="item-management__submit-button"
            variant="contained"
            color="primary"
            fullWidth
          >
            Add Item
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
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
