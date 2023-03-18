import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getWarehouseItemById,
  sendBorrowRequest,
  getUserIdFromLocalStorage,
} from "../../api/api";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import "./BorrowedItemDetails.scss";
import ItemInfo from "./ItemInfo";
import LatePolicy from "./LatePolicy";
import BorrowForm from "./BorrowForm";
import SignatureModal from "./SignatureModal";
import SignatureBackdrop from "./SignatureBackdrop";

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
        navigate("/warehouse");
        window.location.reload();
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
      <ItemInfo item={item}></ItemInfo>
      <LatePolicy></LatePolicy>
      <BorrowForm
        intendedStartDate={intendedStartDate}
        setIntendedStartDate={setIntendedStartDate}
        intendedReturnDate={intendedReturnDate}
        setIntendedReturnDate={setIntendedReturnDate}
        borrowReason={borrowReason}
        setBorrowReason={setBorrowReason}
        quantityNeeded={quantityNeeded}
        setQuantityNeeded={setQuantityNeeded}
        handleSendRequest={handleSendRequest}
        isFormValid={isFormValid}
        getFormattedDate={getFormattedDate}
      />
      <AnimatePresence>
        {showModal && (
          <SignatureModal
            showModal={showModal}
            signaturePad={signaturePad}
            setSignaturePad={setSignaturePad}
            canSubmit={canSubmit}
            setCanSubmit={setCanSubmit}
            handleClear={handleClear}
            handleSubmit={handleSubmit}
            handleClose={handleClose}
          />
        )}
      </AnimatePresence>
      {showModal && <SignatureBackdrop handleClose={handleClose} />}
    </div>
  );
};

export default BorrowedItemDetails;
