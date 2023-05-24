import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextArea } from "semantic-ui-react";
import { Grid } from "@material-ui/core";
import { motion } from "framer-motion";
import { DatePicker } from "@mui/x-date-pickers";
import TimeTable from "../Table/TimeTable";
import dayjs from "dayjs";
import { getAllStartTime, getAllRetrunTime } from "../../../api/BorrowService";
import ColorLegend from "./ColorLegend";

const BorrowForm = ({
  setIntendedStartDate,
  setIntendedReturnDate,
  borrowReason,
  setBorrowReason,
  handleSendRequest,
  isFormValid,
  itemIds,
  startDate,
  isRoom,
}) => {
  const { t } = useTranslation("itemReservation");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedReturnDate, setSelectedReturnDate] = useState(null);
  const [starttime, setStarttime] = useState(new dayjs(startDate));
  const [returnTime, setReturnTime] = useState(null);

  useEffect(() => {
    if (startDate) {
      const date = new dayjs(startDate);
      getAllStartTime(date.toISOString(), itemIds).then((starttime) => {
        setStarttime(starttime);
        setSelectedStartDate(date);
        setIntendedStartDate(dayjs(date).format("YYYY-MM-DDTHH:mm:ss"));
        if (selectedReturnDate) {
          const y = date.toISOString();
          const formattedDate = `${y.slice(0, 16)}`;
          const x = starttime.startDates[formattedDate];
          getAllRetrunTime(y, selectedReturnDate.toISOString(), itemIds, x)
            .then((returnTime) => {
              setReturnTime(returnTime);
              setSelectedReturnDate(selectedReturnDate);
              setIntendedReturnDate(dayjs(date).format("YYYY-MM-DDTHH:mm:ss"));
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      });
    }
  }, []);

  const handleStartDateChange = async (date) => {
    if (isRoom)
     itemIds = "402";

    getAllStartTime(date.toISOString(), itemIds).then((starttime) => {
      setStarttime(starttime);
      setSelectedStartDate(date);
      setIntendedStartDate(dayjs(date).format("YYYY-MM-DDTHH:mm:ss"));
      if (selectedReturnDate) {
        const y = date.toISOString();
        const formattedDate = `${y.slice(0, 16)}`;
        const x = starttime.startDates[formattedDate];
        getAllRetrunTime(y, selectedReturnDate.toISOString(), itemIds, x)
          .then((returnTime) => {
            setReturnTime(returnTime);
            setSelectedReturnDate(selectedReturnDate);
            setIntendedReturnDate(dayjs(date).format("YYYY-MM-DDTHH:mm:ss"));
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  };

  const handleReturnDateChange = async (date) => {
    const y = selectedStartDate.toISOString();
    const formattedDate = `${y.slice(0, 16)}`;
    const x = starttime.startDates[formattedDate];

    getAllRetrunTime(
      selectedStartDate.toISOString(),
      date.toISOString(),
      itemIds,
      x
    )
      .then((returnTime) => {
        setReturnTime(returnTime);
        setSelectedReturnDate(date);
        setIntendedReturnDate(dayjs(date).format("YYYY-MM-DDTHH:mm:ss"));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
        <ColorLegend />

        <div className="borrow-form__request">
          {!startDate ? (
            <div className="borrow-form__field">
              <div className="borrow-form__inputName">
                <p className="borrow-form__label">
                  {t("itemReservation.startDate")}
                </p>
              </div>
              {/* DatePicker component */}
              <DatePicker
                className="borrow-form__date-picker"
                value={selectedStartDate}
                onChange={handleStartDateChange}
                minDate={minDate}
                maxDate={lastDayOfCurrentYear}
              />
            </div>
          ) : (
            <div className="borrow-form__inputName">
              <p className="borrow-form__label">
                {t("itemReservation.startDate")}
              </p>
              <p>{startDate}</p>
            </div>
          )}
          {selectedStartDate && !startDate && (
            <div className="borrow-form__field">
              <div className="borrow-form__inputName"></div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}>
                <p className="borrow-form__label">
                  {t("itemReservation.startTimeSlots")}
                </p>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} md={12}>
                    {/* TimeTable component */}
                    <TimeTable
                      selectedDate={selectedStartDate}
                      onTimeSelected={handleStartDateChange}
                      minTime={getTimeBoundaries(selectedStartDate).minTime}
                      maxTime={getTimeBoundaries(selectedStartDate).maxTime}
                      itemIds={itemIds}
                      starttime={starttime}
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
              value={selectedReturnDate}
              onChange={handleReturnDateChange}
              minDate={selectedStartDate || minDate}
              maxDate={lastDayOfCurrentYear}
              disabled={!selectedStartDate}
            />
            {selectedReturnDate && (
              <div className="borrow-form__field">
                <div className="borrow-form__inputName">
                  <p className="borrow-form__label">
                    {t("itemReservation.returnTimeSlots")}
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
                  returnTime={returnTime}
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
            disabled={!isFormValid()}>
            {t("itemReservation.sendRequest")}
          </button>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default BorrowForm;
