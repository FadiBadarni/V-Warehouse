import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { translateText } from "../api/TranslationService";
import { getUserNotifications } from "../api/NotificationService";

export const useNotification = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const { i18n } = useTranslation();

  const translateNotifications = useCallback(
    async (notifications, language) => {
      if (language === "en") {
        return notifications;
      }

      const translatedNotifications = await Promise.all(
        notifications.map(async (notification) => {
          const translatedMessage = await translateText(
            notification.message,
            language
          );
          return {
            ...notification,
            message: translatedMessage,
          };
        })
      );

      return translatedNotifications;
    },
    []
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userId) {
        const fetchedNotifications = await getUserNotifications(userId);
        const translatedNotifications = await translateNotifications(
          fetchedNotifications,
          i18n.language
        );
        setNotifications(translatedNotifications);
      }
    };

    fetchNotifications();
  }, [userId, i18n.language, translateNotifications]);

  return [notifications, setNotifications];
};
