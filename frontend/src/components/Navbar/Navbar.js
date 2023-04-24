import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import "./Navbar.scss";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { useNotification } from "../../hooks/useNotification";
import NotificationDropdown from "./NotificationDropdown";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { markNotificationsAsRead } from "../../api/NotificationService";
import Badge from "@mui/material/Badge";

const getLanguageDirection = (language) => {
  const rtlLanguages = ["he"];
  return rtlLanguages.includes(language) ? "rtl" : "ltr";
};

const Navbar = ({ children }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const [notifications, setNotifications] = useNotification(user?.id);
  const { t } = useTranslation("navbar");
  const direction = getLanguageDirection(i18n.language);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
  };

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !notification.read),
    [notifications]
  );

  const handleNotificationClick = async () => {
    if (!notificationDropdownOpen) {
      await markNotificationsAsRead(user.id);
      setNotifications(
        notifications.map((notification) => ({ ...notification, read: true }))
      );
    }
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleHamburgerClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuItemClick = () => {
    setMobileMenuOpen(false);
  };
  const navItemVariant = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  useEffect(() => {
    if (user && user.role.includes("ADMIN")) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <div id="navigation-bar" className={direction}>
      <nav className="navbar">
        <button className="hamburger-menu" onClick={handleHamburgerClick}>
          &#9776;
        </button>
        <div className={`mobile-menu${mobileMenuOpen ? " open" : ""}`}>
          <ul>
            <motion.li
              onClick={handleMobileMenuItemClick}
              variants={navItemVariant}
            >
              <Link to="/">{t("navbar.home")}</Link>
            </motion.li>
            <motion.li
              onClick={handleMobileMenuItemClick}
              variants={navItemVariant}
            >
              <Link to="/warehouse">{t("navbar.warehouse")}</Link>
            </motion.li>
            <motion.li
              onClick={handleMobileMenuItemClick}
              variants={navItemVariant}
            >
              <Link to="/dashboard">{t("navbar.dashboard")}</Link>
            </motion.li>
            {!isAuthenticated && (
              <motion.li
                onClick={handleMobileMenuItemClick}
                variants={navItemVariant}
              >
                <Link to="/auth/login">{t("navbar.login")}</Link>
              </motion.li>
            )}
            {isAuthenticated && (
              <>
                {isAdmin && (
                  <motion.li
                    onClick={handleMobileMenuItemClick}
                    variants={navItemVariant}
                  >
                    <Link to="/admin">{t("navbar.admin")}</Link>
                  </motion.li>
                )}
                <motion.li
                  onClick={handleMobileMenuItemClick}
                  variants={navItemVariant}
                >
                  <NotificationDropdown
                    notifications={notifications}
                    onClearNotifications={handleClearNotifications}
                  />
                </motion.li>
                <motion.li
                  onClick={handleMobileMenuItemClick}
                  variants={navItemVariant}
                >
                  <LanguageSelector />
                </motion.li>
                <motion.li
                  onClick={handleMobileMenuItemClick}
                  variants={navItemVariant}
                >
                  <Link to="/auth/logout" onClick={handleLogout}>
                    {t("navbar.logout")}
                  </Link>
                </motion.li>
              </>
            )}
          </ul>
        </div>
        <ul className="navbar-menu">
          <motion.li variants={navItemVariant}>
            <Link to="/">{t("navbar.home")}</Link>
          </motion.li>
          <motion.li variants={navItemVariant}>
            <Link to="/warehouse">{t("navbar.warehouse")}</Link>
          </motion.li>
          <motion.li variants={navItemVariant}>
            <Link to="/dashboard">{t("navbar.dashboard")}</Link>
          </motion.li>
          {!isAuthenticated && (
            <>
              <motion.li variants={navItemVariant}>
                <Link to="/auth/login">{t("navbar.login")}</Link>
              </motion.li>
            </>
          )}
          {isAuthenticated && (
            <>
              {isAdmin && (
                <motion.li
                  onClick={handleMobileMenuItemClick}
                  variants={navItemVariant}
                >
                  <Link to="/admin">{t("navbar.admin")}</Link>
                </motion.li>
              )}
              <motion.li
                className="notification-icon"
                variants={navItemVariant}
              >
                <Badge
                  color="error"
                  badgeContent={unreadNotifications.length}
                  max={99}
                  onClick={handleNotificationClick}
                >
                  <NotificationsIcon
                    className={`bell-icon${
                      unreadNotifications.length ? " active" : ""
                    }`}
                  />
                </Badge>
                <NotificationDropdown
                  isOpen={notificationDropdownOpen}
                  notifications={notifications}
                  onClearNotifications={handleClearNotifications}
                />
              </motion.li>
              <motion.li variants={navItemVariant}>
                <LanguageSelector />
              </motion.li>
              <motion.li variants={navItemVariant}>
                <Link to="/auth/logout" onClick={handleLogout}>
                  {t("navbar.logout")}
                </Link>
              </motion.li>
            </>
          )}
        </ul>
      </nav>

      <div className="content">{children}</div>
    </div>
  );
};

export default Navbar;
