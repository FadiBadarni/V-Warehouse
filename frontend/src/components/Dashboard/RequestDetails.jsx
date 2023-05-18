import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import { motion } from "framer-motion";
import CustomModal from "./CustomModal";
import { useTranslation } from "react-i18next";

const RequestDetails = ({ showModal, request, handleClose }) => {
  const [activeModal, setActiveModal] = useState(null);
  const { t } = useTranslation("dashboard");

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

  return (
    <motion.div
      className="request-details-modal"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="request-details-modal-content">
        <h3>{t("dashboard.requestDetails.title")}</h3>
        <p>
          <strong>{t("dashboard.requestDetails.requestId")}:</strong>{" "}
          {request.requestId}
        </p>
        <p>
          <strong>{t("dashboard.requestDetails.itemName")}:</strong>{" "}
          {request.item.name}
        </p>
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
          <Button onClick={handleReportIssue}>
            {t("dashboard.requestDetails.reportIssue")}
          </Button>
          <Button onClick={handleTransferOwnership}>
            {t("dashboard.requestDetails.transferOwnership")}
          </Button>
          <Button onClick={handleExtendTime}>
            {t("dashboard.requestDetails.extendTime")}
          </Button>
        </div>
        <div className="buttons-container">
          <button onClick={handleClose}>
            {t("dashboard.requestDetails.close")}
          </button>
        </div>
      </div>
      <CustomModal
        showModal={activeModal === "reportIssue"}
        handleClose={closeActiveModal}
      >
        <div className="issue-form">
          <h3 className="issue-form__title">
            {t("dashboard.requestDetails.reportIssueFor")} {request.item.name}
          </h3>
          <label htmlFor="issue-title" className="issue-form__label">
            {t("dashboard.requestDetails.issueTitle")}:
          </label>
          <input
            type="text"
            id="issue-title"
            name="issue-title"
            className="issue-form__input"
          />
          <label htmlFor="issue-description" className="issue-form__label">
            {t("dashboard.requestDetails.issueDescription")}:
          </label>
          <textarea
            id="issue-description"
            name="issue-description"
            className="issue-form__textarea"
          ></textarea>
          <Button className="issue-form__submit">
            {t("dashboard.requestDetails.submit")}
          </Button>
        </div>
      </CustomModal>
      <CustomModal
        showModal={activeModal === "transferOwnership"}
        handleClose={closeActiveModal}
      >
        <div className="transfer-ownership-section">
          <h3 className="transfer-ownership-section__title">
            {t("dashboard.requestDetails.transferOwnershipOf")}{" "}
            {request.item.name}
          </h3>
          <p className="transfer-ownership-section__current-owner">
            {t("dashboard.requestDetails.currentOwner")}: {request.item.owner}
          </p>
          <div className="transfer-ownership-section__input-group">
            <label
              htmlFor="new-owner"
              className="transfer-ownership-section__label"
            >
              {t("dashboard.requestDetails.newOwner")}:
            </label>
            <input
              type="text"
              id="new-owner"
              name="new-owner"
              className="transfer-ownership-section__input"
            />
          </div>
          <Button primary className="transfer-ownership-section__button">
            {t("dashboard.requestDetails.transfer")}
          </Button>
        </div>
      </CustomModal>
      <CustomModal
        showModal={activeModal === "extendTime"}
        handleClose={closeActiveModal}
      >
        <div className="extend-time-section">
          <h3 className="extend-time-section__title">
            {t("dashboard.requestDetails.extendTimeFor")} {request.item.name}
          </h3>
          <p className="extend-time-section__current-end-time">
            {t("dashboard.requestDetails.currentEndTime")}:{" "}
            {request.item.endTime}
          </p>
          <div className="extend-time-section__input-group">
            <label
              htmlFor="additional-time"
              className="extend-time-section__label"
            >
              {t("dashboard.requestDetails.additionalTime")}:
            </label>
            <input
              type="number"
              id="additional-time"
              name="additional-time"
              className="extend-time-section__input"
            />
          </div>
          <Button primary className="extend-time-section__button">
            {t("dashboard.requestDetails.extend")}
          </Button>
        </div>
      </CustomModal>
    </motion.div>
  );
};

export default RequestDetails;
