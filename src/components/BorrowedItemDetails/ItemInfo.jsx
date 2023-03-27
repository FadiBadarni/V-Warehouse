import React from "react";
import { useTranslation } from "react-i18next";
const ItemInfo = ({ item }) => {
  const { t } = useTranslation();
  return (
    <div className="item-info">
      <h2 className="item-info__title">{t("borrowPage.itemInfoTitle")}</h2>
      <p className="item-info__description">{item.description}</p>
      <div className="item-info__details">
        <p>
          <span className="item-info__label">{t("borrowPage.type")}:</span>{" "}
          <span className="item-info__value">{item.type}</span>
        </p>
        <p>
          <span className="item-info__label">
            {t("borrowPage.accompanyingEquipment")}:
          </span>{" "}
          <span className="item-info__value">{item.accompanyingEquipment}</span>
        </p>
        <p>
          <span className="item-info__label">
            {t("borrowPage.safetyInstructions")}:{" "}
          </span>
          <span className="item-info__value">{item.safetyInstructions}</span>
        </p>
      </div>
    </div>
  );
};

export default ItemInfo;
