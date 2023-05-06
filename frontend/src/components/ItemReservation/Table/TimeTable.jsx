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
  awaitingPickupRequests,
  itemIds,
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

  const isTimeSlotInPendingRequests = (time) => {
    return awaitingPickupRequests.some((request) => {
      const startDate = dayjs(request.intendedStartDate);
      const endDate = dayjs(request.intendedReturnDate);
      const dayjsTime = dayjs(time); // Convert time to dayjs object
      return (
        (dayjsTime.isSame(startDate) || dayjsTime.isAfter(startDate)) &&
        (dayjsTime.isSame(endDate) || dayjsTime.isBefore(endDate))
      );
    });
  };

  const createTimeSlots = useCallback(() => {
    const slots = [];
    let currentTime = minTime;
    while (currentTime.isBefore(maxTime)) {
      const time = dayjs(selectedDate)
        .hour(currentTime.hour())
        .minute(currentTime.minute());
      slots.push(
        <TimeSlot
          key={time.format("HH:mm")}
          time={time}
          selected={selectedTime && selectedTime.isSame(time)}
          isPending={isTimeSlotInPendingRequests(time)}
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
    awaitingPickupRequests,
  ]);

  return <div className={styles["time-table"]}>{createTimeSlots()}</div>;
};

export default TimeTable;
