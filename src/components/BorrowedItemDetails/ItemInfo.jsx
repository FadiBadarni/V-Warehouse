import React from "react";
import { useTranslation } from "react-i18next";
const ItemInfo = ({ item }) => {
  const { t } = useTranslation();
  return (
    <div className="item-info">
      <h2 className="item-info__title">
        {t("borrowPage.itemInfoTitle")}
        {item.name}
      </h2>
      <p className="item-info__description">
        {t("borrowPage.itemDescription")}
        {item.description}
      </p>
      <div className="item-info__details">
        <p>
          <span className="item-info__label">{t("borrowPage.Itemtype")}:</span>{" "}
          <span className="item-info__value">{item.itemType.name}</span>
        </p>
        <p>
          <span className="item-info__label">
            {t("borrowPage.accompanyingEquipment")}:
          </span>{" "}
        </p>
        <span className="item-info__value">
          <ul>
            {item.itemType.attributes.map((attr) => (
              <li key={attr.id}>
                {`${attr.attributeName}: ${attr.attributeValue}`}
              </li>
            ))}
          </ul>
        </span>
      </div>
    </div>
  );
};

export default ItemInfo;
