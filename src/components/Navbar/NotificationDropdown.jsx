import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import {
  clearUserNotifications,
  markNotificationsAsRead,
} from "../../api/NotificationService";

const NotificationDropdown = ({ notifications, onClearNotifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();

  const toggleDropdown = async () => {
    if (!isOpen) {
      await markNotificationsAsRead(user.id);
    }
    setIsOpen(!isOpen);
  };

  const handleClearNotifications = async () => {
    await clearUserNotifications(user.id);
    onClearNotifications();
  };

  return (
    <motion.div
      className={`notification-dropdown ${isOpen ? "open" : ""}`}
      onClick={toggleDropdown}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <span id="notification-span">{t("navbar.notifications")}</span>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="notification-list"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {notifications.map((notification) => (
              <motion.li
                key={notification.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <span>{notification.message}</span>
                <span>{notification.date}</span>
              </motion.li>
            ))}
            <motion.li
              className="clear-notifications"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <button onClick={handleClearNotifications}>
                Clear Notifications
              </button>
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NotificationDropdown;
