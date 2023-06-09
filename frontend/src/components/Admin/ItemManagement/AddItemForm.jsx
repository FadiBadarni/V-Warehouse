import React, { useState } from "react";
import {
  TextField,
  Switch,
  Grid,
  FormGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import {
  addEquipmentItem,
  fetchItemNames,
  getItemByName,
  searchForSeralNumber,
  getImg,
} from "../../../api/AdminService";
import CheckMark from "./CheckMark";
import Autocomplete from "@mui/material/Autocomplete";
import QRCode from "react-qr-code";
import QRCodePrint from "./QRCodePrint";
import { fetchedItemTypes } from "../../../api/WarehouseService";
import { styled } from "@mui/system";
import NoMeetingRoomIcon from "@mui/icons-material/NoMeetingRoom";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";

import "./ItemManagement.scss";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 64, // Switch width
  height: 28, // Switch height
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 1,
    margin: 1.5, // Adjusted margin to fit smaller thumb
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(36px)", // Ensure the thumb slides to the end
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#64dd17", // Change to desired track color when switched on
      },
    },
    "&.Mui-focusVisible $thumb": {
      color: "#52d869", // Change to desired thumb color on focus
      border: "6px solid #fff", // Add focus border to the thumb
    },
  },
  "& .MuiSwitch-thumb": {
    width: 24, // Smaller thumb width
    height: 24, // Smaller thumb height
    boxShadow: "none", // Remove default shadow
  },
  "& .MuiSwitch-track": {
    borderRadius: 14, // Track rounded ends
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be", // Track color
    boxSizing: "border-box", // Ensures consistent dimensions
  },
}));

const EquipmentForm = () => {
  const { t } = useTranslation("itemManagement");

  const [showCheckMark, setShowCheckMark] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [itemType, setItemType] = useState("");
  const [takeOut, setTakeOut] = useState(false);

  const [isExistingItem, setIsExistingItem] = useState(false);
  const [generatedQRCodes, setGeneratedQRCodes] = useState([]);

  const [isPrintButtonDisabled, setIsPrintButtonDisabled] = useState(true);
  const [isValidSerialNumber, setIsValidSerialNumber] = useState(false);

  const [setSelectedFile] = useState(null);
  const [setPreviewUrl] = useState(null);
  const [dataUrl, setDataUrl] = useState(null);
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Create a URL for the selected file to preview it
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Resize the image to 512x512 using canvas
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 512;
      canvas.height = 512;
      ctx.drawImage(img, 0, 0, 512, 512);
      const dataUrl = canvas.toDataURL();
      setDataUrl(dataUrl);
    };
    img.src = URL.createObjectURL(file);
  };

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
      const str = selectedItemName.toLowerCase().replace(/\s+/g, "_");
      const dataUlr = await getImg(str);
      setDataUrl(dataUlr);
      const selectedItem = await getItemByName(selectedItemName);
      if (selectedItem) {
        setName(selectedItem.name);
        setDescription(selectedItem.description);
        setItemType(selectedItem.itemType.name);
        setTakeOut(selectedItem.takeOut);
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
      setTakeOut(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const filterSerialNumber = serialNumber.replace(/[^0-9]/g, "");
    const item = {
      serialNumber: filterSerialNumber,
      name,
      description,
      itemType: { name: itemType, attributes },
      img: dataUrl,
      takeOut,
    };
    await addEquipmentItem(item);

    setName("");
    setDescription("");
    setSerialNumber("");
    setItemType("");
    setAttributes([{ attributeName: "", attributeValue: "" }]);
    setIsExistingItem(false);
    setIsPrintButtonDisabled(false); // Enable the print button
    setTakeOut(false);

    // Clear item names and item types to reload them on next focus
    setItemNames([]);
    setItemTypes([]);

    // Generate QR codes for each created item instance
    const qrCodes = (itemInstance) => {
      const qrCodeData = {
        instanceId: filterSerialNumber,
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
    };
    setGeneratedQRCodes(qrCodes);

    setShowCheckMark(true);
    setTimeout(() => setShowCheckMark(false), 3000);
  };

  const handleSerialChange = async (e) => {
    const unformattedValue = e.target.value.replace(/-/g, "");
    const formattedValue = unformattedValue
      .replace(/\D/g, "")
      .replace(/(\d{4})/g, "$1-")
      .slice(0, 19);
    // Check if the pressed key is backspace and remove the hyphen accordingly
    if (e.nativeEvent.inputType === "deleteContentBackward") {
      const lastChar = formattedValue[formattedValue.length - 1];
      if (lastChar === "-") {
        const strippedValue = formattedValue.slice(0, -1);
        setSerialNumber(strippedValue);
        return;
      }
    }
    setSerialNumber(formattedValue);
    const isValidSeralNumber = await searchForSeralNumber(
      formattedValue.replace(/[^0-9]/g, "")
    );
    setIsValidSerialNumber(isValidSeralNumber);
  };

  const [dragging, setDragging] = useState(false);
  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Resize the image to 512x512 using canvas
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 512;
      canvas.height = 512;
      ctx.drawImage(img, 0, 0, 512, 512);
      const dataUrl = canvas.toDataURL();
      setDataUrl(dataUrl);
    };
    img.src = URL.createObjectURL(file);
    setDragging(false);
  };
  const fileInputRef = React.createRef();

  return (
    <form onSubmit={handleSubmit} className="item-management__form">
      <div
        className={`item-management__form__file-uploader ${
          dragging ? "item-management__form__file-uploader--dragging" : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        {dataUrl ? (
          <img
            src={dataUrl}
            alt="Selected"
            className="item-management__form__image"
          />
        ) : (
          <img
            src="https://fomantic-ui.com/images/wireframe/image.png"
            alt="Default"
            className="item-management__form__image"
          />
        )}
        <input
          type="file"
          onChange={handleFileSelect}
          ref={fileInputRef}
          hidden
        />
      </div>
      <Grid container spacing={2} className="item-management__form__grid">
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
                label={t("itemManagement.itemName")}
                onFocus={handleNameInputClick}
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormGroup>
            <Grid container alignItems="center" justify="center">
              <FormControlLabel
                control={
                  <Grid container alignItems="center" justify="center">
                    <Grid item>
                      <Tooltip title="Item to be borrowed in the studio">
                        <NoMeetingRoomIcon />
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <CustomSwitch
                        checked={takeOut}
                        onChange={(event) => setTakeOut(event.target.checked)}
                        disabled={isExistingItem}
                        className="item-management__toggle-switch"
                      />
                    </Grid>
                    <Grid item>
                      <Tooltip title="Item that can be taken out">
                        <MeetingRoomIcon />
                      </Tooltip>
                    </Grid>
                  </Grid>
                }
                label={t("itemManagement.takeoutItem")}
                labelPlacement="top"
                className="item-management__form__toggle-label"
              />
            </Grid>
          </FormGroup>
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
                label={t("itemManagement.itemType")}
                onFocus={handleTypeInputClick}
                onChange={(event) => setItemType(event.target.value)}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="serialNumber"
            label={t("itemManagement.serialNumber")}
            type="text"
            value={serialNumber}
            onChange={handleSerialChange}
            inputProps={{ maxLength: 19 }}
            style={{ color: "#009688", fontSize: "16px", fontWeight: "bold" }}
            placeholder="xxxx-xxxx-xxxx-xxxx"
          />
          {serialNumber.length >= 4 &&
            (isValidSerialNumber ? (
              <p style={{ color: "green", fontWeight: "bold" }}>OK</p>
            ) : (
              <p style={{ color: "red", fontWeight: "bold" }}>
                Invalid serial number
              </p>
            ))}
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            id="description"
            label={t("itemManagement.itemDescription")}
            multiline
            rows={1}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isExistingItem}
          />
        </Grid>
        {attributes.map((attribute, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`${t("itemManagement.attributeName")} ${index + 1}`}
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
                label={`${t("itemManagement.attributeValue")} ${index + 1}`}
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
            fullWidth
            disabled={isExistingItem}
          >
            {t("itemManagement.addAttribute")}
          </Button>
        </Grid>

        <CheckMark show={showCheckMark} />

        <Grid item xs={12} md={6}>
          <Button
            type="submit"
            className="item-management__submit-button"
            variant="contained"
            fullWidth
          >
            {t("itemManagement.addItem")}
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
