import React, { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import TimeSlot from "./TimeSlot";
import styles from "./TimeTable.module.scss";
import { itemInstancesCountById } from "../../../api/WarehouseService";

const TimeTable = ({
  selectedDate,
  onTimeSelected,
  minTime,
  maxTime,
  itemIds,
  starttime,
}) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [itemInstancesCount, setItemInstancesCount] = useState(new Map());

  useEffect(() => {
    const fetchInstancesCount = async () => {
      const instancesCountMap = new Map();
      for (const itemId of itemIds) {
        const response = await itemInstancesCountById(itemId);
        instancesCountMap.set(itemId, response);
      }
      setItemInstancesCount(instancesCountMap);
    };

    fetchInstancesCount();
  }, [itemIds]);

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

      // Check if the starttime object exists and has the required properties
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

      const bookedSlots =
        starttime &&
        starttime.redStartDate &&
        starttime.redStartDate.hasOwnProperty(time.format("YYYY-MM-DDTHH:mm"));

      slots.push(
        <TimeSlot
          key={time.format("HH:mm")}
          time={time}
          selected={selectedTime && selectedTime.isSame(time)}
          pendingSlots={pendingSlots}
          bookedSlots={bookedSlots}
          partialPendingSlots={partialPendingSlots}
          partialPendingSlotsItemIds={partialPendingSlotsItemIds}
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
  ]);

  return <div className={styles["time-table"]}>{createTimeSlots()}</div>;
};

export default TimeTable;
