import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextArea } from "semantic-ui-react";
import { Box, Typography, Grid } from "@material-ui/core";
import { motion } from "framer-motion";
import { DatePicker } from "@mui/x-date-pickers";
import TimeTable from "../Table/TimeTable";
import dayjs from "dayjs";

const BorrowForm = ({
  setIntendedStartDate,
  setIntendedReturnDate,
  borrowReason,
  setBorrowReason,
  handleSendRequest,
  isFormValid,
  itemIds,
  awaitingPickupRequests,
}) => {
  const { t } = useTranslation("itemReservation");
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

  const minDate = useMemo(() => dayjs().startOf("day"), []);
  const lastDayOfCurrentYear = dayjs().endOf("year");

  const getTimeBoundaries = (date) => {
    const minTime = date.isSame(dayjs(), "day")
      ? dayjs()
          .minute(Math.ceil(dayjs().minute() / 30) * 30)
          .second(0)
      : date.hour(8).minute(0).second(0);
    const maxTime = date.hour(22).minute(0).second(0);
    return { minTime, maxTime };
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="borrow-form">
        <h3 className="borrow-form__title">{t("itemReservation.request")}</h3>
        <div className="borrow-form__request">
          <div className="borrow-form__field">
            <div className="borrow-form__inputName">
              <p className="borrow-form__label">
                {t("itemReservation.startDate")}
              </p>
            </div>
            <DatePicker
              className="borrow-form__date-picker"
              label="Start date"
              value={selectedStartDate}
              onChange={handleStartDateChange}
              minDate={minDate}
              maxDate={lastDayOfCurrentYear}
            />
          </div>
          {selectedStartDate && (
            <div className="borrow-form__field">
              <div className="borrow-form__inputName"></div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box mb={4}>
                  <Typography variant="h5">
                    {t("itemReservation.timeSlots")}
                  </Typography>
                </Box>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} md={12}>
                    <TimeTable
                      selectedDate={selectedStartDate}
                      onTimeSelected={handleStartDateChange}
                      minTime={getTimeBoundaries(selectedStartDate).minTime}
                      maxTime={getTimeBoundaries(selectedStartDate).maxTime}
                      itemIds={itemIds}
                      awaitingPickupRequests={awaitingPickupRequests}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}></Grid>
                </Grid>
              </motion.div>
            </div>
          )}
          <div className="borrow-form__field">
            <div className="borrow-form__inputName">
              <p className="borrow-form__label">
                {t("itemReservation.returnDate")}
              </p>
            </div>
            <DatePicker
              className="borrow-form__datetime-picker"
              label="Return date"
              value={selectedReturnDate}
              onChange={handleReturnDateChange}
              minDate={selectedStartDate || minDate}
              maxDate={lastDayOfCurrentYear}
            />
            {selectedReturnDate && (
              <div className="borrow-form__field">
                <div className="borrow-form__inputName">
                  <p className="borrow-form__label">
                    {t("itemReservation.timeSlots")}
                  </p>
                </div>
                <TimeTable
                  selectedDate={selectedReturnDate}
                  onTimeSelected={handleReturnDateChange}
                  minTime={
                    selectedReturnDate.isSame(selectedStartDate, "day")
                      ? dayjs(selectedStartDate).add(30, "minute")
                      : getTimeBoundaries(selectedReturnDate).minTime
                  }
                  maxTime={getTimeBoundaries(selectedReturnDate).maxTime}
                  awaitingPickupRequests={awaitingPickupRequests}
                />
              </div>
            )}
          </div>
          <div className="borrow-form__field">
            <div className="borrow-form__inputName">
              <p className="borrow-form__label">
                {t("itemReservation.reason")}
              </p>
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
            {t("itemReservation.sendRequest")}
          </button>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default BorrowForm;
