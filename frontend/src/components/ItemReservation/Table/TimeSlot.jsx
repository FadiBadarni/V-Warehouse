import React from "react";
import styles from "./TimeSlot.module.scss";

const TimeSlot = ({ time, available, selected, onClick, pending }) => {
  const slotClass = available ? styles.available : styles.unavailable;
  const selectedClass = selected ? styles.selected : "";
  const pendingClass = pending ? styles.pending : "";

  const tooltipText = available ? "Available" : pending ? "Queue" : "Taken";

  return (
    <div
      className={`${styles["time-slot"]} ${slotClass} ${selectedClass} ${pendingClass}`}
      onClick={() => {
        if (available) onClick(time);
      }}
      title={tooltipText}
    >
      {time.format("HH:mm")}
    </div>
  );
};

export default TimeSlot;
