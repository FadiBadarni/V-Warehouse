import React from "react";
import { useTranslation } from "react-i18next";
const BorrowForm = ({
  intendedStartDate,
  setIntendedStartDate,
  intendedReturnDate,
  setIntendedReturnDate,
  borrowReason,
  setBorrowReason,
  quantityNeeded,
  setQuantityNeeded,
  handleSendRequest,
  isFormValid,
  getFormattedDate,
}) => {
  const { t } = useTranslation();
  return (
    <div className="borrow-form">
      <h3>{t("borrowPage.request")}</h3>
      <label>
        {t("borrowPage.startDate")}
        <input
          type="datetime-local"
          min={getFormattedDate(new Date())}
          value={intendedStartDate}
          onChange={(e) => setIntendedStartDate(e.target.value)}
        />
      </label>
      <label>
        {t("borrowPage.returnDate")}
        <input
          type="datetime-local"
          min={intendedStartDate || getFormattedDate(new Date())}
          value={intendedReturnDate}
          onChange={(e) => setIntendedReturnDate(e.target.value)}
        />
      </label>
      <label>
        {t("borrowPage.reason")}
        <input
          type="text"
          value={borrowReason}
          onChange={(e) => setBorrowReason(e.target.value)}
        />
      </label>
      <label>
        {t("borrowPage.quantity")}
        <input
          type="text"
          value={quantityNeeded}
          onChange={(e) => setQuantityNeeded(e.target.value)}
        />
      </label>
      <button onClick={handleSendRequest} disabled={!isFormValid()}>
        {t("borrowPage.sendRequest")}
      </button>
    </div>
  );
};

export default BorrowForm;
