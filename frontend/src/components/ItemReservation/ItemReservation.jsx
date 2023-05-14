import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ItemInfo from "./ItemInfo";
import LatePolicy from "./LatePolicy";
import BorrowForm from "./BorrowForm/BorrowForm";
import SignatureModal from "./SignatureModal";
import SignatureBackdrop from "./SignatureBackdrop";
import { useTranslation } from "react-i18next";
import { getUserIdFromLocalStorage } from "../../api/UserService";
import { createBorrowRequest } from "../../api/BorrowService";
import { getWarehouseItemsByIds } from "../../api/WarehouseService";
import { useLocation } from "react-router-dom";
import useBorrowRequests from "../../hooks/useBorrowRequests";
import { translateText } from "../../api/TranslationService";
import { CircularProgress } from "@material-ui/core";

import dayjs from "dayjs";
import "./ItemReservation.scss";

const BorrowedItemDetails = () => {
  const { t, i18n } = useTranslation("itemReservation");
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [signaturePad, setSignaturePad] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [intendedStartDate, setIntendedStartDate] = useState("");
  const [intendedReturnDate, setIntendedReturnDate] = useState("");
  const [borrowReason, setBorrowReason] = useState("");
  const { awaitingPickupRequests } = useBorrowRequests();
  const navigate = useNavigate();
  const [fetchedItems, setFetchedItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSelectedItems = useCallback(
    async (ids) => {
      try {
        const items = await getWarehouseItemsByIds(ids);
        if (i18n.language !== "en") {
          const translatedItems = await Promise.all(
            items.map(async (item) => {
              const translatedDescription = await translateText(
                item.description,
                i18n.language
              );
              return {
                ...item,
                name: item.name,
                description: translatedDescription,
              };
            })
          );
          setFetchedItems(translatedItems);
        } else {
          setFetchedItems(items);
        }
      } catch (error) {
        console.error("Error fetching selected items:", error);
      }
    },
    [i18n.language]
  );

  useEffect(() => {
    const selectedIds = location.pathname.split("/").pop();
    fetchSelectedItems(selectedIds);
  }, [location.pathname, fetchSelectedItems]);

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
      setIsSubmitting(true);
      const base64Signature = signaturePad.toDataURL();

      const userId = getUserIdFromLocalStorage();
      const borrowRequestData = {
        userId,
        itemIds: location.pathname.split("/").pop().split(","),
        intendedStartDate,
        intendedReturnDate,
        borrowingReason: borrowReason,
        signatureData: base64Signature,
      };
      const result = await createBorrowRequest(borrowRequestData);
      if (result) {
        alert("Borrow request sent successfully.");
        navigate("/warehouse");
        setIsSubmitting(false);
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

  if (!fetchedItems || Object.keys(fetchedItems).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="item-details">
      <div className="item-details-container">
        <h1 className="page-title">{t("itemReservation.title")}</h1>
        <ItemInfo fetchedItems={fetchedItems}></ItemInfo>

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
          itemIds={location.pathname.split("/").pop().split(",")}
          awaitingPickupRequests={awaitingPickupRequests}
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
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>
        {showModal && <SignatureBackdrop handleClose={handleClose} />}
      </div>
    </div>
  );
};

export default BorrowedItemDetails;
