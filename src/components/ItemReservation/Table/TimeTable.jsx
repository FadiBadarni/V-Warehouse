import React, { useState, useCallback } from "react";
import dayjs from "dayjs";
import TimeSlot from "./TimeSlot";
import styles from "./TimeTable.module.scss";

const TimeTable = ({
  selectedDate,
  occupiedDates,
  onTimeSelected,
  minTime,
  maxTime,
  disableOccupied,
  pendingDates,
}) => {
  const [selectedTime, setSelectedTime] = useState(null);

  const isTimeOccupied = useCallback(
    (time) => {
      const occupied = occupiedDates.some(
        ({ intendedStartDate, intendedReturnDate }) => {
          const occupiedStart = dayjs(intendedStartDate);
          const occupiedEnd = dayjs(intendedReturnDate);
          return time.isBetween(occupiedStart, occupiedEnd, "minute", "[]");
        }
      );

      const pending = pendingDates.some(
        ({ intendedStartDate, intendedReturnDate }) => {
          const pendingStart = dayjs(intendedStartDate);
          const pendingEnd = dayjs(intendedReturnDate);
          return time.isBetween(pendingStart, pendingEnd, "minute", "[]");
        }
      );

      return disableOccupied ? { occupied, pending } : { occupied };
    },
    [occupiedDates, disableOccupied, pendingDates]
  );

  const handleTimeSelected = useCallback(
    (time) => {
      setSelectedTime(time);
      onTimeSelected(time);
    },
    [onTimeSelected]
  );

  const createTimeSlots = useCallback(() => {
    const slots = [];
    let currentTime = minTime;
    while (currentTime.isBefore(maxTime)) {
      const time = dayjs(selectedDate)
        .hour(currentTime.hour())
        .minute(currentTime.minute());
      const { occupied, pending } = isTimeOccupied(time);
      slots.push(
        <TimeSlot
          key={time.format("HH:mm")}
          time={time}
          available={!occupied}
          selected={selectedTime && selectedTime.isSame(time)}
          onClick={handleTimeSelected}
          pending={pending}
        />
      );
      currentTime = currentTime.add(30, "minute");
    }

    return slots;
  }, [
    selectedDate,
    minTime,
    maxTime,
    isTimeOccupied,
    selectedTime,
    handleTimeSelected,
  ]);

  return <div className={styles["time-table"]}>{createTimeSlots()}</div>;
};

export default TimeTable;
