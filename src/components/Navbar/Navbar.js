import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LanguageSelector from "../LanguageSelector";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import "./Navbar.scss";
import { useAuth } from "../../contexts/AuthContext";
import {
  getUserNotifications,
  clearUserNotifications,
  markNotificationsAsRead,
} from "../../api/NotificationService";
import { motion, AnimatePresence } from "framer-motion";

const getLanguageDirection = (language) => {
  const rtlLanguages = ["he"];
  return rtlLanguages.includes(language) ? "rtl" : "ltr";
};

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
      <span>{t("navbar.notifications")}</span>
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

const Navbar = ({ children }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const { t } = useTranslation();
  const direction = getLanguageDirection(i18n.language);
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user && user.id) {
        const fetchedNotifications = await getUserNotifications(user.id);
        setNotifications(fetchedNotifications);
      }
    };

    fetchNotifications();
  }, [user]);
  const handleLogout = (event) => {
    event.preventDefault();
    logout();
  };
  const handleClearNotifications = () => {
    setNotifications([]);
  };
  return (
    <div id="navigation-bar" className={direction}>
      <nav className="navbar">
        <ul className="navbar-menu">
          <li>
            <Link to="/">{t("navbar.home")}</Link>
          </li>
          <li>
            <Link to="/warehouse">{t("navbar.warehouse")}</Link>
          </li>
          <li>
            <Link to="/dashboard">{t("navbar.dashboard")}</Link>
          </li>

          {!isAuthenticated && (
            <>
              <li>
                <Link to="/auth/login">{t("navbar.login")}</Link>
              </li>
            </>
          )}
          {isAuthenticated && (
            <>
              <li>
                <NotificationDropdown
                  notifications={notifications}
                  onClearNotifications={handleClearNotifications}
                />
              </li>
              <li>
                <Link to="/auth/logout" onClick={handleLogout}>
                  {t("navbar.logout")}
                </Link>
              </li>
            </>
          )}
          <li>
            <LanguageSelector />
          </li>
        </ul>
      </nav>

      <div className="content">{children}</div>
    </div>
  );
};

export default Navbar;
