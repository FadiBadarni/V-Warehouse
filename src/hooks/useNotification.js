import { useState, useEffect } from "react";
import { getUserNotifications } from "../api/NotificationService";

export const useNotification = (userId) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userId) {
        const fetchedNotifications = await getUserNotifications(userId);
        setNotifications(fetchedNotifications);
      }
    };

    fetchNotifications();
  }, [userId]);

  return [notifications, setNotifications];
};
