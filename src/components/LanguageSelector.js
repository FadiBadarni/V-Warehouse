import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSelector.scss";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState("ltr");

  const changeLanguage = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    setDirection(newLanguage === "he" ? "rtl" : "ltr");
  };

  useEffect(() => {
    setDirection(i18n.language === "he" ? "rtl" : "ltr");
  }, [i18n.language]);

  return (
    <div className={`language-selector ${direction}`}>
      <select value={i18n.language} onChange={changeLanguage}>
        <option value="en">English</option>
        <option value="he">עברית</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
