import React, { useState, useCallback } from "react";
import dayjs from "dayjs";
import TimeSlot from "./TimeSlot";
import styles from "./TimeTable.module.scss";

const TimeTable = ({
  selectedDate,
  onTimeSelected,
  minTime,
  maxTime,
  starttime,
  returnTime,
}) => {
  const [selectedTime, setSelectedTime] = useState(null);

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

      const pendingSlots =
        starttime &&
        starttime.bendingStartDates &&
        starttime.bendingStartDates.hasOwnProperty(
          time.format("YYYY-MM-DDTHH:mm")
        );

      const partialPendingSlots =
        starttime &&
        starttime.incompleteBendingStartDates &&
        starttime.incompleteBendingStartDates.hasOwnProperty(
          time.format("YYYY-MM-DDTHH:mm")
        );

      const partialPendingSlotsItemIds =
        starttime &&
        starttime.incompleteBendingStartDates &&
        starttime.incompleteBendingStartDates[time.format("YYYY-MM-DDTHH:mm")];

      const partialBookedSlots =
        starttime &&
        starttime.incompleteStartDates &&
        starttime.incompleteStartDates[time.format("YYYY-MM-DDTHH:mm")];

      const bookedSlots =
        starttime &&
        starttime.redStartDate &&
        starttime.redStartDate.hasOwnProperty(time.format("YYYY-MM-DDTHH:mm"));

      const pendingReturnSlots =
        returnTime &&
        returnTime.bendingReturnDates &&
        returnTime.bendingReturnDates.hasOwnProperty(
          time.format("YYYY-MM-DDTHH:mm")
        );

      const bookedReturnSlots =
        returnTime &&
        returnTime.redReturnDate &&
        returnTime.redReturnDate.hasOwnProperty(
          time.format("YYYY-MM-DDTHH:mm")
        );

      const partialPendingReturnSlots =
        returnTime &&
        returnTime.incompleteBendingReturnDates &&
        returnTime.incompleteBendingReturnDates.hasOwnProperty(
          time.format("YYYY-MM-DDTHH:mm")
        );

      const partialBookedReturnSlots =
        returnTime &&
        returnTime.incompleteReturnDates &&
        returnTime.incompleteReturnDates.hasOwnProperty(
          time.format("YYYY-MM-DDTHH:mm")
        );

      slots.push(
        <TimeSlot
          key={time.format("HH:mm")}
          time={time}
          selected={selectedTime && selectedTime.isSame(time)}
          pendingSlots={pendingSlots}
          bookedSlots={bookedSlots}
          partialPendingSlots={partialPendingSlots}
          partialPendingSlotsItemIds={partialPendingSlotsItemIds}
          partialBookedSlots={partialBookedSlots}
          bookedReturnSlots={bookedReturnSlots}
          pendingReturnSlots={pendingReturnSlots}
          partialPendingReturnSlots={partialPendingReturnSlots}
          partialBookedReturnSlots={partialBookedReturnSlots}
          onClick={handleTimeSelected}
        />
      );
      currentTime = currentTime.add(30, "minute");
    }

    return slots;
  }, [
    selectedDate,
    minTime,
    maxTime,
    selectedTime,
    handleTimeSelected,
    starttime,
    returnTime,
  ]);

  return <div className={styles["time-table"]}>{createTimeSlots()}</div>;
};

export default TimeTable;
