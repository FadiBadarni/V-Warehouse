import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextArea } from "semantic-ui-react";
import { TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const BorrowForm = ({
  setIntendedStartDate,
  setIntendedReturnDate,
  borrowReason,
  setBorrowReason,
  quantityNeeded,
  setQuantityNeeded,
  handleSendRequest,
  isFormValid,
}) => {
  const { t } = useTranslation();
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedReturnDate, setSelectedReturnDate] = useState(null);

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    setIntendedStartDate(dayjs(date).format("YYYY-MM-DDTHH:mm:ss"));
  };

  const handleReturnDateChange = (date) => {
    setSelectedReturnDate(date);
    setIntendedReturnDate(dayjs(date).format("YYYY-MM-DDTHH:mm:ss"));
  };

  const minDate = new dayjs();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="borrow-form">
        <h3 className="borrow-form__title">{t("borrowPage.request")}</h3>
        <div className="borrow-form__request">
          <div className="borrow-form__field">
            <div className="borrow-form__inputName">
              <p className="borrow-form__label">{t("borrowPage.startDate")}</p>
            </div>
            <DateTimePicker
              className="borrow-form__datetime-picker"
              label="Start date"
              value={selectedStartDate}
              onChange={handleStartDateChange}
              minDate={minDate}
            />
          </div>
          <div className="borrow-form__field">
            <div className="borrow-form__inputName">
              <p className="borrow-form__label">{t("borrowPage.returnDate")}</p>
            </div>
            <DateTimePicker
              className="borrow-form__datetime-picker"
              label="Return date"
              value={selectedReturnDate}
              onChange={handleReturnDateChange}
              minDate={selectedStartDate || minDate}
            />
          </div>
          <div className="borrow-form__field">
            <div className="borrow-form__inputName">
              <p className="borrow-form__label">{t("borrowPage.quantity")}</p>
            </div>
            <TextField
              className="borrow-form__input"
              id="outlined-controlled"
              label="Controlled"
              value={quantityNeeded}
              onChange={(e) => setQuantityNeeded(e.target.value)}
            />
          </div>
          <div className="borrow-form__field">
            <div className="borrow-form__inputName">
              <p className="borrow-form__label">{t("borrowPage.reason")}</p>
            </div>
            <TextArea
              className="borrow-form__textarea"
              type="text"
              value={borrowReason}
              onChange={(e) => setBorrowReason(e.target.value)}
            />
          </div>

          <button
            className="borrow-form__button"
            onClick={handleSendRequest}
            disabled={!isFormValid()}
          >
            {t("borrowPage.sendRequest")}
          </button>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default BorrowForm;
