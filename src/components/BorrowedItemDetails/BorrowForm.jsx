import React from "react";

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
}) => (
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
);

export default BorrowForm;
