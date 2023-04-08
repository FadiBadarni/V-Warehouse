import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextArea } from "semantic-ui-react";
import { Box, Typography, Grid } from "@material-ui/core";
import { motion } from "framer-motion";
import { DatePicker } from "@mui/x-date-pickers";
import {
  getAllOccupiedDates,
  getPendingBorrowRequestsByItemInstance,
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
  itemInstances,
  setSelectedInstanceIds,
}) => {
  const { t } = useTranslation();
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedReturnDate, setSelectedReturnDate] = useState(null);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const availableInstances = itemInstances;
  const [selectedInstanceIds, setSelectedInstanceIdsLocal] = useState([]);
  const [pendingDates, setPendingDates] = useState([]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (selectedInstanceIds.length > 0) {
        try {
          const pendingRequests = await Promise.all(
            selectedInstanceIds.map((instanceId) =>
              getPendingBorrowRequestsByItemInstance(instanceId)
            )
          );
          setPendingDates(pendingRequests.flat());
        } catch (error) {
          console.error("Error fetching pending borrow requests:", error);
        }
      }
    };

    fetchPendingRequests();
  }, [selectedInstanceIds]);

  const handleInstanceIdChange = (e) => {
    setSelectedInstanceIdsLocal(e.target.value);
    setSelectedInstanceIds(e.target.value);
  };

  useEffect(() => {
    const fetchOccupiedDates = async () => {
      let allOccupiedDates = [];
      for (const instanceId of selectedInstanceIds) {
        try {
          const result = await getAllOccupiedDates(instanceId);
          allOccupiedDates = allOccupiedDates.concat(result);
        } catch (error) {
          console.error("Error fetching occupied dates:", error);
        }
      }
      setOccupiedDates(allOccupiedDates);
    };

    fetchOccupiedDates();
  }, [selectedInstanceIds]);

  const isDateColliding = useCallback(
    (date) => {
      return occupiedDates.some(({ intendedStartDate, intendedReturnDate }) => {
        const occupiedStart = dayjs(intendedStartDate);
        const occupiedEnd = dayjs(intendedReturnDate);
        return date.isBetween(occupiedStart, occupiedEnd, null, "[]");
      });
    },
    [occupiedDates]
  );

  const handleStartDateChange = async (date) => {
    setSelectedStartDate(date);
    setIntendedStartDate(dayjs(date).format("YYYY-MM-DDTHH:mm:ss"));

    if (selectedInstanceIds.length > 0) {
      try {
        const result = await getAllOccupiedDates(selectedInstanceIds);
        setOccupiedDates(result);
      } catch (error) {
        console.error("Error fetching occupied dates:", error);
      }
    }
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
        <h3 className="borrow-form__title">{t("borrowPage.request")}</h3>
        <div className="borrow-form__request">
          <div className="borrow-form__field">
            <div className="borrow-form__field">
              <div className="borrow-form__inputName">
                <p className="borrow-form__label">Instance</p>
              </div>
              <FormControl fullWidth>
                <InputLabel id="instance-select-label">Instances</InputLabel>
                <Select
                  labelId="instance-select-label"
                  id="instance-select"
                  multiple
                  value={selectedInstanceIds}
                  onChange={handleInstanceIdChange}
                  label="Instances"
                >
                  <MenuItem value="">
                    <em>Select instances</em>
                  </MenuItem>
                  {availableInstances.map((instance) => (
                    <MenuItem key={instance.id} value={instance.id}>
                      {`ID: ${instance.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="borrow-form__inputName">
              <p className="borrow-form__label">{t("borrowPage.startDate")}</p>
            </div>
            <DatePicker
              className="borrow-form__date-picker"
              label="Start date"
              value={selectedStartDate}
              onChange={handleStartDateChange}
              minDate={minDate}
              maxDate={lastDayOfCurrentYear}
              shouldDisableDate={(date) => {
                return isDateColliding(dayjs(date));
              }}
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
                    {t("borrowPage.timeSlots")}
                  </Typography>
                </Box>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} md={12}>
                    <TimeTable
                      selectedDate={selectedStartDate}
                      occupiedDates={occupiedDates}
                      onTimeSelected={handleStartDateChange}
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
              <p className="borrow-form__label">{t("borrowPage.returnDate")}</p>
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
                    {t("borrowPage.timeSlots")}
                  </p>
                </div>
                <TimeTable
                  selectedDate={selectedReturnDate}
                  occupiedDates={[]}
                  onTimeSelected={handleReturnDateChange}
                  minTime={
                    selectedReturnDate.isSame(selectedStartDate, "day")
                      ? dayjs(selectedStartDate).add(30, "minute")
                      : getTimeBoundaries(selectedReturnDate).minTime
                  }
                  maxTime={getTimeBoundaries(selectedReturnDate).maxTime}
                  disableOccupied={false}
                  pendingDates={pendingDates}
                />
              </div>
            )}
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
