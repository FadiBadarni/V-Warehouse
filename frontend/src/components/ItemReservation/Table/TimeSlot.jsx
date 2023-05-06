import React from "react";
import styles from "./TimeSlot.module.scss";

const TimeSlot = ({ time, selected, isPending, onClick }) => {
  const selectedClass = selected ? styles.selected : "";
  const pendingClass = isPending ? styles.pending : "";

  return (
    <div
      className={`${styles["time-slot"]} ${selectedClass} ${pendingClass}`}
      onClick={() => {
        onClick(time);
      }}
      title="Click to select time"
    >
      {time.format("HH:mm")}
    </div>
  );
};

export default TimeSlot;
