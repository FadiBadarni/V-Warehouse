import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextArea } from "semantic-ui-react";
import { Box, Typography, Grid } from "@material-ui/core";
import { motion } from "framer-motion";
import { DatePicker } from "@mui/x-date-pickers";
import {
  getPendingBorrowRequestsByItemInstance,
  getEveryTimeSchedule,
  getEveryTimeToReturnInSchedule,
} from "../../api/BorrowService";
import TimeTable from "./Table/TimeTable";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import dayjs from "dayjs";

const BorrowForm = ({
  setIntendedStartDate,
  setIntendedReturnDate,
  borrowReason,
  setBorrowReason,
  handleSendRequest,
  isFormValid,
  quantity,
  setQuantity,
  itemId,
}) => {
  const { t } = useTranslation("itemReservation");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedReturnDate, setSelectedReturnDate] = useState(null);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [occupiedReturnDates, setOccupiedReturnDates] = useState([]);
  const availableInstances = [];
  const [selectedInstanceIds, setSelectedInstanceIdsLocal] = useState([]);
  const [pendingDates, setPendingDates] = useState([]);
  const itemIdValue = itemId;
  const [startTime, setstartTime] = useState();
  const [startDate, setstartDate] = useState();
  const [startDateTime, setstartDateTime] = useState();

  for (let i = 1; i <= quantity; i++) {
    availableInstances.push({
      value: i,
      label: i.toString(),
    });
  }

  const handleInstanceIdChange = (e) => {
    setSelectedInstanceIdsLocal(e.target.value);
    setQuantity(e.target.value);
  };

  const handleStartDateChange = async (date) => {
    const result = await getEveryTimeSchedule(
      selectedInstanceIds,
      date,
      itemIdValue
    );
    const listForAllstartDate = result.startDates;
    setstartDate(date);
    const dateTimestr = date.toISOString();
    const originalDate = new Date(dateTimestr);
    originalDate.setDate(originalDate.getDate() + 1);
    const datestr = originalDate.toISOString().substring(0, 10);
    setstartTime(listForAllstartDate);
    const listOfKeys = Object.keys(listForAllstartDate);
    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        timeSlots.push(
          datestr +
            "T" +
            hour.toString().padStart(2, "0") +
            ":" +
            minute.toString().padStart(2, "0")
        );
      }
    }
    const newList = timeSlots.filter((time) => !listOfKeys.includes(time));
    console.log(newList);
    const dayjs = require("dayjs");
    const occupiedDates = [];

    newList.forEach((dateStr) => {
      const date = dayjs(dateStr);
      const occupiedDate = {
        intendedStartDate: date.toISOString(),
        intendedReturnDate: date.add(30, "minute").toISOString(),
      };
      occupiedDates.push(occupiedDate);
    });

    setOccupiedDates(occupiedDates);
    setSelectedStartDate(date);

    const bendingStartDates = [];
    const x = result.bendingStartDates;
    x.forEach((dateStr) => {
      const date = dayjs(dateStr);
      const occupiedDate = {
        intendedStartDate: date.toISOString(),
        intendedReturnDate: date.add(30, "minute").toISOString(),
      };
      bendingStartDates.push(occupiedDate);
    });

    setPendingDates(bendingStartDates);
  };

  const handleStartTimeChange = (date) => {
    setIntendedStartDate(dayjs(date).format("YYYY-MM-DDTHH:mm:ss"));
    setstartDateTime(date);
  };

  const handleReturnTimeChange = (date) => {
    setIntendedReturnDate(dayjs(date).format("YYYY-MM-DDTHH:mm:ss"));
  };

  const handleReturnDateChange = async (date) => {
    setSelectedReturnDate(date);
    const dateTimeString = startDateTime.toISOString().slice(0, 16);
    if (startTime.hasOwnProperty(dateTimeString)) {
      const x = startTime[dateTimeString];
      const result = await getEveryTimeToReturnInSchedule(
        selectedInstanceIds,
        startDate,
        date,
        itemIdValue,
        x
      );
      const listforAllReturnData = result.returnDates;
      const dateTimestr = date.toISOString();
      const originalDate = new Date(dateTimestr);
      originalDate.setDate(originalDate.getDate() + 1);
      const datestr = originalDate.toISOString().substring(0, 10);

      const timeSlots = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          timeSlots.push(
            datestr +
              "T" +
              hour.toString().padStart(2, "0") +
              ":" +
              minute.toString().padStart(2, "0") +
              ":00"
          );
        }
      }

      const newList = timeSlots.filter(
        (time) => !listforAllReturnData.includes(time)
      );
      console.log(newList);

      const dayjs = require("dayjs");
      const occupiedDates = [];

      newList.forEach((dateStr) => {
        const date = dayjs(dateStr);
        const occupiedDate = {
          intendedStartDate: date.toISOString(),
          intendedReturnDate: date.add(30, "minute").toISOString(),
        };
        occupiedDates.push(occupiedDate);
      });

      setOccupiedReturnDates(occupiedDates);

      const bendingStartDates = [];
      const y = result.bendingStartDates;
      y.forEach((dateStr) => {
        const date = dayjs(dateStr);
        const occupiedDate = {
          intendedStartDate: date.toISOString(),
          intendedReturnDate: date.add(30, "minute").toISOString(),
        };
        bendingStartDates.push(occupiedDate);
      });

      setPendingDates(bendingStartDates);
    }
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

  const isDisabledDate = useCallback(
    (date) => {
      if (selectedStartDate) {
        const diff = dayjs(date).diff(selectedStartDate, "day");
        return diff < 0 || diff > 7;
      } else {
        return false;
      }
    },
    [selectedStartDate]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="borrow-form">
        <h3 className="borrow-form__title">{t("itemReservation.request")}</h3>
        <div className="borrow-form__request">
          <div className="borrow-form__field">
            <div className="borrow-form__field">
              <div className="borrow-form__inputName">
                <p className="borrow-form__label">Instance</p>
              </div>
              <FormControl fullWidth>
                <Select
                  labelId="instance-select-label"
                  id="instance-select"
                  value={selectedInstanceIds}
                  onChange={handleInstanceIdChange}
                  label="Instances"
                >
                  {availableInstances.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
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
                      occupiedDates={occupiedDates}
                      onTimeSelected={handleStartTimeChange}
                      minTime={getTimeBoundaries(selectedStartDate).minTime}
                      maxTime={getTimeBoundaries(selectedStartDate).maxTime}
                      disableOccupied={true}
                      pendingDates={pendingDates}
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
              shouldDisableDate={isDisabledDate}
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
                  occupiedDates={occupiedReturnDates}
                  onTimeSelected={handleReturnTimeChange}
                  minTime={
                    selectedReturnDate.isSame(selectedStartDate, "day")
                      ? dayjs(selectedStartDate).add(30, "minute")
                      : getTimeBoundaries(selectedReturnDate).minTime
                  }
                  maxTime={getTimeBoundaries(selectedReturnDate).maxTime}
                  disableOccupied={true}
                  pendingDates={pendingDates}
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
