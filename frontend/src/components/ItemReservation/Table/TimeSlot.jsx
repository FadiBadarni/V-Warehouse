import React, { useState, useEffect, useCallback } from "react";
import styles from "./TimeSlot.module.scss";
import useItemDetails from "../../../hooks/useItemDetails";

const TimeSlot = ({
  time,
  selected,
  pendingSlots,
  bookedSlots,
  partialPendingSlots,
  partialPendingSlotsItemIds,
  partialBookedSlots,
  bookedReturnSlots,
  pendingReturnSlots,
  partialPendingReturnSlots,
  partialBookedReturnSlots,
  onClick,
}) => {
  const [partialPendingItemNames, setPartialPendingItemNames] = useState([]);
  const [partialBookedItemNames, setPartialBookedItemNames] = useState([]);

  const { fetchItemDetails } = useItemDetails();
  const fetchPartialPendingItemNames = useCallback(async () => {
    try {
      const fetchedItemNames = await Promise.all(
        partialPendingSlotsItemIds.map(async (id) => {
          const item = await fetchItemDetails(id);
          return item.name;
        })
      );
      setPartialPendingItemNames(fetchedItemNames);
    } catch (error) {
      console.error("Error fetching item names:", error);
    }
  }, [partialPendingSlotsItemIds, fetchItemDetails]);

  useEffect(() => {
    if (partialPendingSlots) {
      fetchPartialPendingItemNames();
    }
  }, [
    partialPendingSlots,
    partialPendingSlotsItemIds,
    fetchPartialPendingItemNames,
  ]);

  const fetchPartialBookedItemNames = useCallback(async () => {
    try {
      const fetchedItemNames = await Promise.all(
        partialBookedSlots.map(async (id) => {
          const item = await fetchItemDetails(id);
          return item.name;
        })
      );
      setPartialBookedItemNames(fetchedItemNames);
    } catch (error) {
      console.error("Error fetching item names:", error);
    }
  }, [partialBookedSlots, fetchItemDetails]);

  useEffect(() => {
    if (partialBookedSlots) {
      fetchPartialBookedItemNames();
    }
  }, [partialBookedSlots, fetchPartialBookedItemNames]);

  const selectedClass = selected ? styles.selected : "";
  const pendingClass = pendingSlots ? styles.pending : "";
  const bookedClass = bookedSlots ? styles.booked : "";
  const partialPendingClass = partialPendingSlots ? styles.partialPending : "";
  const partialBookedClass = partialBookedSlots ? styles.partialBooked : "";
  const bookedReturnClass = bookedReturnSlots ? styles.bookedReturn : "";
  const pendingReturnSlotsClass = pendingReturnSlots
    ? styles.pendingReturn
    : "";
  const partialPendingReturnSlotsClass = partialPendingReturnSlots
    ? styles.partialPendingReturn
    : "";

  const partialBookedReturnSlotsClass = partialBookedReturnSlots
    ? styles.partialBookedReturn
    : "";

  const slotClasses = [
    styles["time-slot"],
    selectedClass,
    pendingClass,
    bookedClass,
    partialPendingClass,
    partialBookedClass,
    bookedReturnClass,
    pendingReturnSlotsClass,
    partialPendingReturnSlotsClass,
    partialBookedReturnSlotsClass,
  ].join(" ");

  const handleClick = () => {
    if (!bookedSlots && !bookedReturnSlots) {
      onClick(time);
    }
  };

  const getTitle = () => {
    if (bookedSlots) {
      return "This slot is already booked";
    } else if (pendingSlots) {
      return "There is a pending request for this slot";
    } else if (partialPendingSlots) {
      const items = partialPendingItemNames.join(", ");
      return `Item ${items} have a pending request for this slot`;
    } else if (partialBookedSlots) {
      const items = partialBookedItemNames.join(", ");
      return `The item ${items} is booked for this slot`;
    } else if (bookedReturnClass) {
      return "MUST RETURN BY THIS TIME";
    } else if (pendingReturnSlotsClass) {
      return "There is a pending request for this slot";
    } else if (partialPendingReturnSlotsClass) {
      return "There is a partial pending request for this slot";
    } else if (partialBookedReturnSlotsClass) {
      return "This slot is partially booked";
    } else {
      return "Click to select time";
    }
  };

  return (
    <div className={slotClasses} onClick={handleClick} title={getTitle()}>
      {time.format("HH:mm")}
    </div>
  );
};

export default TimeSlot;
