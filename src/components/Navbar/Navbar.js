import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import { useAuth } from "../../contexts/AuthContext";
import { getUserNotifications, clearUserNotifications } from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";

const NotificationDropdown = ({ notifications, onClearNotifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const toggleDropdown = () => {
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
      <span>Notifications</span>
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
    <div id="navigation-bar">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/warehouse">Warehouse</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>

          {!isAuthenticated && (
            <>
              <li>
                <Link to="/auth/login">Login</Link>
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
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="content">{children}</div>
    </div>
  );
};

export default Navbar;
