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
        <h3>
          {t("dashboard.requestDetails.reportIssueFor")} {request.item.name}
        </h3>
        <label htmlFor="issue-title">
          {t("dashboard.requestDetails.issueTitle")}:
        </label>
        <input type="text" id="issue-title" name="issue-title" />
        <label htmlFor="issue-description">
          {t("dashboard.requestDetails.issueDescription")}:
        </label>
        <textarea id="issue-description" name="issue-description"></textarea>
        <Button primary>{t("dashboard.requestDetails.submit")}</Button>
      </CustomModal>
      <CustomModal
        showModal={activeModal === "transferOwnership"}
        handleClose={closeActiveModal}
      >
        <h3>
          {t("dashboard.requestDetails.transferOwnershipOf")}{" "}
          {request.item.name}
        </h3>
        <p>
          {t("dashboard.requestDetails.currentOwner")}: {request.item.owner}
        </p>
        <label htmlFor="new-owner">
          {t("dashboard.requestDetails.newOwner")}:
        </label>
        <input type="text" id="new-owner" name="new-owner" />
        <Button primary>{t("dashboard.requestDetails.transfer")}</Button>
      </CustomModal>
      <CustomModal
        showModal={activeModal === "extendTime"}
        handleClose={closeActiveModal}
      >
        <h3>
          {t("dashboard.requestDetails.extendTimeFor")} {request.item.name}
        </h3>
        <p>
          {t("dashboard.requestDetails.currentEndTime")}: {request.item.endTime}
        </p>
        <label htmlFor="additional-time">
          {t("dashboard.requestDetails.additionalTime")}:
        </label>
        <input type="number" id="additional-time" name="additional-time" />
        <Button primary>{t("dashboard.requestDetails.extend")}</Button>
      </CustomModal>
    </motion.div>
  );
};

export default RequestDetails;
