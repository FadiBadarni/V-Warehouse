import React from "react";
import { useTranslation } from "react-i18next";
const ItemInfo = ({ item }) => {
  const { t } = useTranslation();
  return (
    <div className="item-info">
      <h2 className="item-title">
        <span className="label">{t("borrowPage.itemInfoTitle")} </span>
        {item.name}
      </h2>
      <p className="item-description">{item.description}</p>
      <div className="item-details">
        <p>
          <span className="label">{t("borrowPage.type")} </span> {item.type}
        </p>
        <p>
          <span className="label">
            {t("borrowPage.accompanyingEquipment")}{" "}
          </span>{" "}
          {item.accompanyingEquipment}
        </p>
        <p>
          <span className="label">{t("borrowPage.safetyInstructions")} </span>{" "}
          {item.safetyInstructions}
        </p>
      </div>
    </div>
  );
};

export default ItemInfo;
