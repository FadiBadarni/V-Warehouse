import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { clearUserNotifications } from "../../api/NotificationService";

const NotificationDropdown = ({
  notifications,
  onClearNotifications,
  isOpen,
}) => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat(i18n.language, options).format(date);
  };
  const handleClearNotifications = async () => {
    await clearUserNotifications(user.id);
    onClearNotifications();
  };

  return (
    <motion.div
      className={`notification-dropdown ${isOpen ? "open" : ""}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
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
                <span className="notification-msg">{notification.message}</span>
                <span className="notification-date">
                  {formatDate(notification.date)}
                </span>
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
