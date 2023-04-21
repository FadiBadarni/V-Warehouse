import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import { motion } from "framer-motion";
import CustomModal from "./CustomModal";

const RequestDetails = ({ showModal, request, handleClose }) => {
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

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
        <h3>Request Details</h3>
        <p>
          <strong>Request ID:</strong> {request.requestId}
        </p>
        <p>
          <strong>Item Name:</strong> {request.item.name}
        </p>
        <p>
          <strong>Status:</strong> {request.status}
        </p>
        <p>
          <strong>Request Made at:</strong>{" "}
          {new Date(request.requestTime).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <div className="buttons-container">
          <Button onClick={handleReportIssue}>Report an issue</Button>
          <Button onClick={handleTransferOwnership}>Transfer Ownership</Button>
          <Button onClick={handleExtendTime}>Extend Time</Button>
        </div>
        <div className="buttons-container">
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
      <CustomModal
        showModal={activeModal === "reportIssue"}
        handleClose={closeActiveModal}
      >
        <h3>Report an issue for {request.item.name}</h3>
        <label htmlFor="issue-title">Issue Title:</label>
        <input type="text" id="issue-title" name="issue-title" />
        <label htmlFor="issue-description">Issue Description:</label>
        <textarea id="issue-description" name="issue-description"></textarea>
        <Button primary>Submit</Button>
      </CustomModal>
      <CustomModal
        showModal={activeModal === "transferOwnership"}
        handleClose={closeActiveModal}
      >
        <h3>Transfer ownership of {request.item.name}</h3>
        <p>Current Owner: {request.item.owner}</p>
        <label htmlFor="new-owner">New Owner:</label>
        <input type="text" id="new-owner" name="new-owner" />
        <Button primary>Transfer</Button>
      </CustomModal>
      <CustomModal
        showModal={activeModal === "extendTime"}
        handleClose={closeActiveModal}
      >
        <h3>Extend time for {request.item.name}</h3>
        <p>Current End Time: {request.item.endTime}</p>
        <label htmlFor="additional-time">Additional Time (in hours):</label>
        <input type="number" id="additional-time" name="additional-time" />
        <Button primary>Extend</Button>
      </CustomModal>
    </motion.div>
  );
};

export default RequestDetails;
