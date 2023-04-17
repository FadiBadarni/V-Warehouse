import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ItemInfo from "./ItemInfo";
import LatePolicy from "./LatePolicy";
import BorrowForm from "./BorrowForm";
import SignatureModal from "./SignatureModal";
import SignatureBackdrop from "./SignatureBackdrop";
import { useTranslation } from "react-i18next";
import { getUserIdFromLocalStorage } from "../../api/UserService";
import { sendBorrowRequest } from "../../api/BorrowService";
import useItemDetails from "../../hooks/useItemDetails";

import dayjs from "dayjs";
import "./ItemReservation.scss";

const BorrowedItemDetails = () => {
  const { t } = useTranslation();

  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [signaturePad, setSignaturePad] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [intendedStartDate, setIntendedStartDate] = useState("");
  const [intendedReturnDate, setIntendedReturnDate] = useState("");
  const [borrowReason, setBorrowReason] = useState("");
  const [quantity, setQuantity] = useState([]);

  const navigate = useNavigate();

  const { itemDetails, fetchItemDetails } = useItemDetails();
  useEffect(() => {
    fetchItemDetails(id);
  }, [id, fetchItemDetails]);

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
        quantity: quantity,
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
    // Check if all fields have values
    if (!intendedStartDate || !intendedReturnDate || !borrowReason) {
      return false;
    }

    // Check if start date is before return date
    if (dayjs(intendedStartDate).isAfter(intendedReturnDate)) {
      return false;
    }

    // Check if the interval between start date and return date is at most 7 days
    if (dayjs(intendedReturnDate).diff(intendedStartDate, "day") > 7) {
      return false;
    }

    // Check if the interval between start date and return date is at least half an hour (30 minutes)
    if (dayjs(intendedReturnDate).diff(intendedStartDate, "minute") < 30) {
      return false;
    }
    // All validations passed
    return true;
  };

  if (!itemDetails || Object.keys(itemDetails).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="item-details-container">
      <h1 className="page-title">{t("borrowPage.title")}</h1>
      <ItemInfo item={itemDetails}></ItemInfo>

      <LatePolicy></LatePolicy>
      <BorrowForm
        intendedStartDate={intendedStartDate}
        setIntendedStartDate={setIntendedStartDate}
        intendedReturnDate={intendedReturnDate}
        setIntendedReturnDate={setIntendedReturnDate}
        borrowReason={borrowReason}
        setBorrowReason={setBorrowReason}
        handleSendRequest={handleSendRequest}
        isFormValid={isFormValid}
        quantity={itemDetails.quantity}
        setQuantity={setQuantity}
        itemId={itemDetails.id}
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
