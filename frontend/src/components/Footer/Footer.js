import React from "react";
import { useTranslation } from "react-i18next";
import "./Footer.scss";
const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer>
      <p>&copy; {t("footer.hero")}</p>
    </footer>
  );
};

export default Footer;
