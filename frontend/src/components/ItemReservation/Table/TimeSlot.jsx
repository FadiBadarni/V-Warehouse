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
  onClick,
}) => {
  const [partialPendingItemNames, setPartialPendingItemNames] = useState([]);
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

  const selectedClass = selected ? styles.selected : "";
  const pendingClass = pendingSlots ? styles.pending : "";
  const bookedClass = bookedSlots ? styles.booked : "";
  const partialPendingClass = partialPendingSlots ? styles.partialPending : "";

  const slotClasses = [
    styles["time-slot"],
    selectedClass,
    pendingClass,
    bookedClass,
    partialPendingClass,
  ].join(" ");
  const handleClick = () => {
    if (!bookedSlots) {
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
      return `Items ${items} have a pending request for this slot`;
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
