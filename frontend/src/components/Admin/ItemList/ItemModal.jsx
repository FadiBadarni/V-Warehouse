import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  MenuItem,
  TextField,
} from "@mui/material";
import { updateEquipmentItem } from "../../../api/AdminService";

const ItemModal = ({
  modalOpen,
  toggleModal,
  selectedItem,
  setSelectedItem,
  itemTypes,
}) => {
  const handleSubmit = async () => {
    try {
      await updateEquipmentItem(
        selectedItem.id,
        selectedItem.state,
        selectedItem.itemType.name
      );
      toggleModal(); // close the modal after successful update
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <Dialog
      open={modalOpen}
      onClose={toggleModal}
      aria-labelledby="form-dialog-title"
      className="custom-dialog"
    >
      <DialogTitle id="form-dialog-title" className="custom-dialog-title">
        Item Details
      </DialogTitle>
      <DialogContent className="custom-dialog-content">
        {selectedItem && (
          <>
            <Typography variant="h6" className="custom-dialog-itemname">
              {selectedItem.itemName}
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              className="custom-dialog-itemid"
            >
              ID: {selectedItem.id}
            </Typography>
            <TextField
              select
              label="State"
              value={selectedItem.state}
              onChange={(event) =>
                setSelectedItem({
                  ...selectedItem,
                  state: event.target.value,
                })
              }
              variant="outlined"
              fullWidth
              margin="normal"
              className="custom-dialog-select"
            >
              {["TAKEN", "DAMAGED", "IN_MAINTENANCE", "AVAILABLE"].map(
                (option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    className="custom-dialog-menu-item"
                  >
                    {option}
                  </MenuItem>
                )
              )}
            </TextField>
            <TextField
              select
              label="Item Type"
              value={selectedItem.itemType.name}
              onChange={(event) =>
                setSelectedItem({
                  ...selectedItem,
                  itemType: {
                    ...selectedItem.itemType,
                    name: event.target.value,
                  },
                })
              }
              variant="outlined"
              fullWidth
              margin="normal"
              className="custom-dialog-select"
            >
              {itemTypes.map((type, index) => (
                <MenuItem
                  key={index}
                  value={type}
                  className="custom-dialog-menu-item"
                >
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <DialogContentText className="custom-dialog-text">
              Item Description: {selectedItem.itemDescription}
            </DialogContentText>
            <Typography
              variant="subtitle1"
              gutterBottom
              className="custom-dialog-itemid"
            >
              Attributes:
            </Typography>
            <ul className="item-modal__attributes">
              {selectedItem.itemType.attributes.map((attribute) => (
                <li key={attribute.id} className="custom-dialog-attribute-item">
                  {attribute.attributeName}: {attribute.attributeValue}
                </li>
              ))}
            </ul>
          </>
        )}
      </DialogContent>
      <DialogActions className="custom-dialog-actions">
        <Button
          variant="outlined"
          onClick={toggleModal}
          className="custom-dialog-close-button"
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          className="custom-dialog-update-button"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemModal;
