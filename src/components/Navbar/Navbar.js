import React from "react";
import { Link } from "react-router-dom";
import LanguageSelector from "../LanguageSelector";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import "./Navbar.scss";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { useNotification } from "../../hooks/useNotification";
import NotificationDropdown from "./NotificationDropdown";

const getLanguageDirection = (language) => {
  const rtlLanguages = ["he"];
  return rtlLanguages.includes(language) ? "rtl" : "ltr";
};

const Navbar = ({ children }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const [notifications, setNotifications] = useNotification(user?.id);
  const { t } = useTranslation();
  const direction = getLanguageDirection(i18n.language);

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const navItemVariant = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div id="navigation-bar" className={direction}>
      <nav className="navbar">
        <ul className="navbar-menu">
          <motion.li variants={navItemVariant}>
            <LanguageSelector />
          </motion.li>
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
              <motion.li variants={navItemVariant}>
                <NotificationDropdown
                  notifications={notifications}
                  onClearNotifications={handleClearNotifications}
                />
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
