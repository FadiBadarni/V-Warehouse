import React from "react";
import { useTranslation } from "react-i18next";

const LatePolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="late-policy">
      <h3>{t("borrowPage.policyTitle")} </h3>
      <p>{t("borrowPage.policy")} </p>
    </div>
  );
};

export default LatePolicy;
