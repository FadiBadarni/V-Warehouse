import React from "react";
import { Modal } from "semantic-ui-react";
import { MenuItem, Select, Button } from "@mui/material";
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
      // You might want to refresh your list of items here or show a success message
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };
  return (
    <Modal open={modalOpen} onClose={toggleModal}>
      <div className="item-modal">
        <div className="item-modal__header">Item Details</div>
        <div className="item-modal__content">
          {selectedItem && (
            <div>
              <h2>{selectedItem.itemName}</h2>
              <p>ID: {selectedItem.id}</p>
              <div className="item-modal__fields">
                <div className="item-modal__field">
                  State:{" "}
                  <Select
                    value={selectedItem.state}
                    onChange={(event) =>
                      setSelectedItem({
                        ...selectedItem,
                        state: event.target.value,
                      })
                    }
                  >
                    {["TAKEN", "DAMAGED", "IN_MAINTENANCE", "AVAILABLE"].map(
                      (option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </div>
                <div className="item-modal__field">
                  Item Type:{" "}
                  <Select
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
                  >
                    {itemTypes.map((type, index) => (
                      <MenuItem key={index} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
              <p>Item Description: {selectedItem.itemDescription}</p>
              <h3>Attributes:</h3>
              <ul className="item-modal__attributes">
                {selectedItem.itemType.attributes.map((attribute) => (
                  <li key={attribute.id}>
                    {attribute.attributeName}: {attribute.attributeValue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="item-modal__actions">
          <Button
            variant="contained"
            color="secondary"
            onClick={toggleModal}
            className="item-modal__button"
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className="item-modal__button"
          >
            Update
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ItemModal;
