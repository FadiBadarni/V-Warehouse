import React, { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextArea } from "semantic-ui-react";
import dayjs from "dayjs";
import InstanceSelector from "./InstanceSelector";
import DateSelector from "./DateSelector";
import TimeTableWrapper from "./TimeTableWrapper";
import {
  getllTheTimethatCanStart,
  getAllTheTimeToReturn,
} from "../../../api/BorrowService";

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
  const [selectedInstanceIds, setSelectedInstanceIdsLocal] = useState("");
  const [pendingReturnDates, setPendingRetrunDates] = useState([]);
  const [pendingStartDates, setPendingStartDates] = useState([]);
  const itemIdValue = itemId;
  const [startTime, setstartTime] = useState();
  const [startDateTime, setstartDateTime] = useState();
  const [disabledReturnTime, setDisabledReturnTime] = useState(true);
  const [disabledStartTime, setDisabledStartTime] = useState(true);

  const handleInstanceIdChange = (e) => {
    setDisabledStartTime(false);
    setSelectedInstanceIdsLocal(e.target.value);
    setQuantity(e.target.value);

    if (selectedStartDate) {
      handleStartDateChange(selectedStartDate);
    }
  };

  const buildAvailableTimeList = (date, timeList) => {
    const dateTimestr = date.toISOString();

    const originalDate = new Date(dateTimestr);
    originalDate.setHours(originalDate.getHours() + 3);
    const datestr = originalDate.toISOString().substring(0, 10);

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
    return timeSlots.filter((time) => !timeList.includes(time));
  };

  const buildOccupiedDateList = (timeList) => {
    const dayjs = require("dayjs");
    const occupiedDates = [];

    timeList.forEach((dateStr) => {
      const date = dayjs(dateStr);
      const occupiedDate = {
        intendedStartDate: date.toISOString(),
        intendedReturnDate: date.add(30, "minute").toISOString(),
      };
      occupiedDates.push(occupiedDate);
    });
    return occupiedDates;
  };

  const handleStartDateChange = async (date) => {
    const result = await getllTheTimethatCanStart(
      selectedInstanceIds,
      date.toISOString(),
      itemIdValue
    );
    const listForAllstartDate = result.startDates;
    const listOfKeys = Object.keys(listForAllstartDate);
    setstartTime(listForAllstartDate);
    const timeList = buildAvailableTimeList(date, listOfKeys);
    setOccupiedDates(buildOccupiedDateList(timeList));
    setSelectedStartDate(date);
    setPendingStartDates(buildOccupiedDateList(result.bendingStartDates));
  };

  const handleReturnDateChange = async (date) => {
    setSelectedReturnDate(date);
    const dateTimeString = startDateTime.toISOString().slice(0, 16);
    if (startTime.hasOwnProperty(dateTimeString)) {
      const result = await getAllTheTimeToReturn(
        selectedInstanceIds,
        startDateTime.toISOString(),
        date.toISOString(),
        itemIdValue,
        startTime[dateTimeString]
      );
      const listforAllReturnData = result.returnDates;
      const formattedDates = listforAllReturnData.map((dateString) =>
        dateString.substring(0, 16)
      );
      const timeList = buildAvailableTimeList(date, formattedDates);
      setOccupiedReturnDates(buildOccupiedDateList(timeList));
      setPendingRetrunDates(buildOccupiedDateList(result.bendingReturnDates));
    }
  };

  const handleStartTimeChange = (date) => {
    setIntendedStartDate(date.toISOString());
    setstartDateTime(date);
    setDisabledReturnTime(false);

    if (selectedReturnDate) {
      handleReturnDateChange(selectedReturnDate);
    }
  };

  const handleReturnTimeChange = (date) => {
    setIntendedReturnDate(dayjs(date).toISOString());
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
                <p className="borrow-form__label">
                  {t("itemReservation.quantity")}
                </p>
              </div>
              <InstanceSelector
                quantity={quantity}
                selectedInstanceIds={selectedInstanceIds}
                handleInstanceIdChange={handleInstanceIdChange}
              />
            </div>
            <div className="borrow-form__inputName">
              <p className="borrow-form__label">
                {t("itemReservation.startDate")}
              </p>
            </div>
            <DateSelector
              disabled={disabledStartTime}
              selectedDate={selectedStartDate}
              handleDateChange={handleStartDateChange}
              minDate={minDate}
              maxDate={lastDayOfCurrentYear}
            />
          </div>
          {selectedStartDate && (
            <TimeTableWrapper
              selectedDate={selectedStartDate}
              occupiedDates={occupiedDates}
              onTimeSelected={handleStartTimeChange}
              minTime={getTimeBoundaries(selectedStartDate).minTime}
              maxTime={getTimeBoundaries(selectedStartDate).maxTime}
              disableOccupied={true}
              pendingDates={pendingStartDates}
            />
          )}
          <div className="borrow-form__field">
            <div className="borrow-form__inputName">
              <p className="borrow-form__label">
                {t("itemReservation.returnDate")}
              </p>
            </div>
            <DateSelector
              disabled={disabledReturnTime}
              selectedDate={selectedReturnDate}
              handleDateChange={handleReturnDateChange}
              minDate={selectedStartDate || minDate}
              maxDate={lastDayOfCurrentYear}
              shouldDisableDate={isDisabledDate}
            />
            {selectedReturnDate && (
              <TimeTableWrapper
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
                pendingDates={pendingReturnDates}
              />
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
