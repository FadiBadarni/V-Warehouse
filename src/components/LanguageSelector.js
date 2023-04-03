import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";
import "./LanguageSelector.scss";

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [direction, setDirection] = useState("ltr");
  const [showDropdown, setShowDropdown] = useState(false);

  const changeLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    setDirection(newLanguage === "he" ? "rtl" : "ltr");
    setShowDropdown(false);
  };

  useEffect(() => {
    setDirection(i18n.language === "he" ? "rtl" : "ltr");
  }, [i18n.language]);

  return (
    <div className={`language-selector ${direction}`}>
      <LanguageIcon
        className="language-selector__globe-icon"
        onClick={() => setShowDropdown(!showDropdown)}
      />
      {showDropdown && (
        <div className="language-selector__dropdown">
          <div
            className={`language-selector__option ${
              i18n.language === "en"
                ? "language-selector__option--selected"
                : ""
            }`}
            onClick={() => changeLanguage("en")}
          >
            {t("navbar.languageSelector.english")}
          </div>
          <div
            className={`language-selector__option ${
              i18n.language === "he"
                ? "language-selector__option--selected"
                : ""
            }`}
            onClick={() => changeLanguage("he")}
          >
            {t("navbar.languageSelector.hebrew")}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
