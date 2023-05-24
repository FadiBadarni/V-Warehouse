import React, { useState } from "react";
import { Button, Popup } from "semantic-ui-react";
import { motion } from "framer-motion";
import CustomModal from "./CustomModal";

import { useTranslation } from "react-i18next";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import { transferOwnership } from "../../api/BorrowService";
import { sendToAdminsNotifications } from "../../api/NotificationService";

const RequestDetails = ({ showModal, request, handleClose, users, owner }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [issueDescription, setIssueDescription] = useState("");

  const { t } = useTranslation("dashboard");

  const [newOwner, setNewOwner] = useState();

  if (!showModal || !request) return null;

  const handleReportIssue = () => {
    setActiveModal("reportIssue");
  };

  const handleTransferOwnership = () => {
    setActiveModal("transferOwnership");
  };

  const handleExtendTime = () => {
    setActiveModal("extendTime");
  };

  const closeActiveModal = () => {
    setActiveModal(null);
  };

  const isDisabled = request.status !== "AWAITING_RETURN";

  const tooltipMessage = () => {
    if (isDisabled) return "The items are not with you";
    return "";
  };

  const itemNames = request.items.map((item) => item.name);
  const namesString = itemNames.join(", ");
  console.log(request);

  const handleSelectNewOwner = async (selectedNewOwner) => {
    if (selectedNewOwner) {
      setNewOwner(selectedNewOwner);
    }
  };

  const handleNewOwnerClick = async () => {
    // const fetchedItemType = await fetchedItemTypes();
    // if (fetchedItemType) {
    //   setItemTypes(fetchedItemType);
    // }
  };

  const handleTransferOwnershipClick = async () => {
    if (newOwner) {
      const userid = users.find((user) => user.username === newOwner);
      await transferOwnership(request.requestId, userid.id);
      setActiveModal(null);
    }
  };

  const handleItemSelect = (itemId) => {
    const isSelected = selectedItems.includes(itemId);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleIssueDescriptionChange = (event) => {
    setIssueDescription(event.target.value);
  };

  const handleReportIssueClick = async () => {
    const x = request.items
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => item.name)
      .join(",");
    const y = request.itemInstanceIds.map((item) => item).join(",");

    const message = `Report Details:
    :-:Request ID: ${request.requestId}
    :-:User ID: ${owner}
    :-:Item Name(s): ${x}
    :-:Serial  Number :${y}
    :-:Issue Description: ${issueDescription}`;
    await sendToAdminsNotifications(message);
    setActiveModal(null);
  };

  return (
    <motion.div
      className="request-details-modal"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3 }}>
      <div className="request-details-modal-content">
        <h3>{t("dashboard.requestDetails.title")}</h3>
        <p>
          <strong>{t("dashboard.requestDetails.requestId")}:</strong>{" "}
          {request.requestId}
        </p>
        <strong>Items Associated With The Request:</strong>{" "}
        {request.items.map((item, index) => (
          <div key={index}>
            <p>{item.name}</p>
          </div>
        ))}
        <p>
          <strong>{t("dashboard.requestDetails.status")}:</strong>{" "}
          {request.status}
        </p>
        <p>
          <strong>{t("dashboard.requestDetails.requestMadeAt")}:</strong>{" "}
          {new Date(request.requestTime).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <div className="buttons-container">
          <Popup
            content={tooltipMessage()}
            disabled={!isDisabled}
            trigger={
              <div>
                <Button onClick={handleReportIssue} disabled={isDisabled}>
                  {t("dashboard.requestDetails.reportIssue")}
                </Button>
              </div>
            }
          />
          <Popup
            content={tooltipMessage()}
            disabled={!isDisabled}
            trigger={
              <div>
                <Button onClick={handleTransferOwnership} disabled={isDisabled}>
                  {t("dashboard.requestDetails.transferOwnership")}
                </Button>
              </div>
            }
          />
          <Popup
            content={tooltipMessage()}
            disabled={!isDisabled}
            trigger={
              <div>
                <Button onClick={handleExtendTime} disabled={isDisabled}>
                  {t("dashboard.requestDetails.extendTime")}
                </Button>
              </div>
            }
          />
        </div>
        <div className="buttons-container">
          <button onClick={handleClose}>
            {t("dashboard.requestDetails.close")}
          </button>
        </div>
      </div>
      <CustomModal
        showModal={activeModal === "reportIssue"}
        handleClose={closeActiveModal}>
        <div className="issue-form">
          <h4 className="issue-form__title">
            {t("dashboard.requestDetails.reportIssue")}
          </h4>
          {/* <label htmlFor="issue-title" className="issue-form__label">
            {t("dashboard.requestDetails.issueTitle")}:
          </label> */}
          {/* <input
            type="text"
            id="issue-title"
            name="issue-title"
            className="issue-form__input"
          /> */}
          <div
            htmlFor="issue-title"
            className="issue-form__label"
            style={{ display: "flex" }}>
            {request.items.map((item) => (
              <div key={item.id} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleItemSelect(item.id)}
                />
                <label>{item.name}</label>
              </div>
            ))}
          </div>
          <label htmlFor="issue-description" className="issue-form__label">
            {t("dashboard.requestDetails.issueDescription")}:
          </label>
          <textarea
            id="issue-description"
            name="issue-description"
            className="issue-form__textarea"
            value={issueDescription}
            onChange={handleIssueDescriptionChange}></textarea>
          <Button
            className="issue-form__submit"
            onClick={handleReportIssueClick}>
            {t("dashboard.requestDetails.submit")}
          </Button>
        </div>
      </CustomModal>
      <CustomModal
        showModal={activeModal === "transferOwnership"}
        handleClose={closeActiveModal}>
        <div className="transfer-ownership-section">
          <h3 className="transfer-ownership-section__title">
            {t("dashboard.requestDetails.transferOwnershipOf")} <br />
            {namesString}
          </h3>
          <p className="transfer-ownership-section__current-owner">
            {t("dashboard.requestDetails.currentOwner")} :{owner}
          </p>
          <div className="transfer-ownership-section__input-group">
            <label
              htmlFor="new-owner"
              className="transfer-ownership-section__label">
              {t("dashboard.requestDetails.newOwner")}:
            </label>
            <Autocomplete
              autoFocus
              fullWidth
              id="new-owner"
              options={
                users && users.length > 0
                  ? users.map((user) => user.username)
                  : []
              }
              getOptionLabel={(option) => option}
              freeSolo
              inputValue={newOwner}
              onInputChange={(event, newInputValue) => {
                setNewOwner(newInputValue);
              }}
              onChange={async (event, selectedNewOwner) => {
                handleSelectNewOwner(selectedNewOwner);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="new owner"
                  onFocus={handleNewOwnerClick}
                  required
                />
              )}
            />
          </div>
          <Button
            className="transfer-ownership-section__button"
            disabled={!newOwner}
            onClick={handleTransferOwnershipClick}>
            {t("dashboard.requestDetails.transfer")}
          </Button>
        </div>
      </CustomModal>
      <CustomModal
        showModal={activeModal === "extendTime"}
        handleClose={closeActiveModal}>
        <div className="extend-time-section">
          <h3 className="extend-time-section__title">
            {t("dashboard.requestDetails.extendTimeFor")}
          </h3>
          <p className="extend-time-section__current-end-time">
            {t("dashboard.requestDetails.currentEndTime")}:{" "}
            {request.intendedReturnDate}
          </p>
          <div
            htmlFor="issue-title"
            className="issue-form__label"
            style={{ display: "flex" }}>
            {request.items.map((item) => (
              <div key={item.id} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleItemSelect(item.id)}
                />
                <label>{item.name}</label>
              </div>
            ))}
          </div>

          <Button
            className="extend-time-section__button"
            onClick={() => {
              const itemIds = request.items.map((item) => item.id).join(",");
              const intendedStartDate = request.intendedStartDate;
              window.location.href = `/warehouse/items/${itemIds}?startDate=${intendedStartDate}`;
            }}>
            {t("dashboard.requestDetails.extend")}
          </Button>
        </div>
      </CustomModal>
    </motion.div>
  );
};

export default RequestDetails;
