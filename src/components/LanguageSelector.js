import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSelector.scss";

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [direction, setDirection] = useState("ltr");

  const changeLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    setDirection(newLanguage === "he" ? "rtl" : "ltr");
  };

  useEffect(() => {
    setDirection(i18n.language === "he" ? "rtl" : "ltr");
  }, [i18n.language]);

  return (
    <div className={`language-selector ${direction}`}>
      <div
        className="language-selector__flags"
        onClick={() => changeLanguage(i18n.language === "en" ? "he" : "en")}
      >
        <div
          className={`language-selector__flag language-selector__flag--en ${
            i18n.language === "en" ? "active" : ""
          }`}
        ></div>
        <div
          className={`language-selector__flag language-selector__flag--he ${
            i18n.language === "he" ? "active" : ""
          }`}
        ></div>
      </div>
      <div className="language-selector__label">
        {t(
          `navbar.languageSelector.${
            i18n.language === "en" ? "english" : "hebrew"
          }`
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
