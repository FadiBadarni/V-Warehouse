import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getWarehouseItemById,
  sendBorrowRequest,
  getUserIdFromLocalStorage,
} from "../../api/api";
import SignaturePad from "react-signature-canvas";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import "./BorrowedItemDetails.scss";

const BorrowedItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [signaturePad, setSignaturePad] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [intendedStartDate, setIntendedStartDate] = useState("");
  const [intendedReturnDate, setIntendedReturnDate] = useState("");
  const [borrowReason, setBorrowReason] = useState("");
  const [quantityNeeded, setQuantityNeeded] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemDetails = async (itemId) => {
      try {
        const itemDetails = await getWarehouseItemById(itemId);
        setItem(itemDetails);
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    fetchItemDetails(id);
  }, [id]);

  const handleSendRequest = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleClear = () => {
    signaturePad.clear();
    setCanSubmit(false);
  };

  const handleSubmit = async () => {
    if (signaturePad.isEmpty()) {
      alert("Please provide a signature.");
    } else {
      const base64Signature = signaturePad.toDataURL();

      const userId = getUserIdFromLocalStorage();
      const borrowRequestData = {
        userId,
        itemId: id,
        intendedStartDate,
        intendedReturnDate,
        borrowingReason: borrowReason,
        quantity: quantityNeeded,
        signatureData: base64Signature,
      };
      const result = await sendBorrowRequest(borrowRequestData);
      if (result) {
        alert("Borrow request sent successfully.");
        navigate(-1);
      } else {
        alert("Failed to send borrow request.");
      }
      setShowModal(false);
    }
  };

  const isFormValid = () => {
    return (
      intendedStartDate && intendedReturnDate && borrowReason && quantityNeeded
    );
  };
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const timezoneOffset = ("0" + -date.getTimezoneOffset() / 60).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+${timezoneOffset}:00`;
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="item-details-container">
      <h1 className="page-title">Gear Up for Your Journey</h1>
      <div className="item-info">
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <p>Type: {item.type}</p>
        <p>{item.accompanyingEquipment}</p>
        <p>{item.safetyInstructions}</p>
      </div>
      <div className="late-policy">
        <h3>Late Return Policy</h3>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi
          dignissimos, eos expedita voluptas amet laborum error veritatis
          deserunt autem saepe id beatae perspiciatis pariatur esse! Tempora vel
          facilis totam non.
        </p>
      </div>
      <div className="borrow-form">
        <h3>Request to Borrow</h3>
        <label>
          Intended Start Date:
          <input
            type="datetime-local"
            min={getFormattedDate(new Date())}
            value={intendedStartDate}
            onChange={(e) => setIntendedStartDate(e.target.value)}
          />
        </label>
        <label>
          Intended Return Date:
          <input
            type="datetime-local"
            min={intendedStartDate || getFormattedDate(new Date())}
            value={intendedReturnDate}
            onChange={(e) => setIntendedReturnDate(e.target.value)}
          />
        </label>
        <label>
          Reason for borrowing:
          <input
            type="text"
            value={borrowReason}
            onChange={(e) => setBorrowReason(e.target.value)}
          />
        </label>
        <label>
          Quantity Needed:
          <input
            type="text"
            value={quantityNeeded}
            onChange={(e) => setQuantityNeeded(e.target.value)}
          />
        </label>
        <button onClick={handleSendRequest} disabled={!isFormValid()}>
          Send request to borrow
        </button>
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="signature-modal"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Terms of Borrowing</h3>
            <p>
              By signing below, you agree to the terms and conditions of
              borrowing the item.
            </p>
            <SignaturePad
              ref={(ref) => setSignaturePad(ref)}
              canvasProps={{ className: "signature-canvas" }}
              onEnd={() => setCanSubmit(!signaturePad.isEmpty())}
            />
            <div className="buttons-container">
              <button onClick={handleClear}>Clear</button>
              <button onClick={handleSubmit} disabled={!canSubmit}>
                Submit
              </button>
              <button onClick={handleClose}>Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showModal && (
        <motion.div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        ></motion.div>
      )}
    </div>
  );
};

export default BorrowedItemDetails;
