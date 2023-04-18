import React from "react";

const NotificationsCount = ({ count }) => {
  if (count === 0) {
    return null;
  }

  return (
    <span className="notifications-count">{count > 99 ? "99+" : count}</span>
  );
};
export default NotificationsCount;
