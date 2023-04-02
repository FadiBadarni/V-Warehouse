import { useState, useCallback } from "react";
import { getWarehouseItemById } from "../api/WarehouseService";
import { translateText } from "../api/TranslationService";
import { useTranslation } from "react-i18next";

const useItemDetails = () => {
  const [itemDetails, setItemDetails] = useState({});
  const { i18n } = useTranslation();

  const fetchItemDetails = useCallback(
    async (itemId) => {
      try {
        const itemDetails = await getWarehouseItemById(itemId);
        if (i18n.language !== "en") {
          const translatedName = await translateText(
            itemDetails.name,
            i18n.language
          );
          const translatedDescription = await translateText(
            itemDetails.description,
            i18n.language
          );
          const translatedTypeName = await translateText(
            itemDetails.itemType.name,
            i18n.language
          );
          const translatedAttributes = await Promise.all(
            itemDetails.itemType.attributes.map(async (attr) => ({
              ...attr,
              attributeName: await translateText(
                attr.attributeName,
                i18n.language
              ),
              attributeValue: await translateText(
                attr.attributeValue,
                i18n.language
              ),
            }))
          );

          setItemDetails({
            ...itemDetails,
            name: translatedName,
            description: translatedDescription,
            itemType: {
              ...itemDetails.itemType,
              name: translatedTypeName,
              attributes: translatedAttributes,
            },
          });
        } else {
          setItemDetails(itemDetails);
        }
        console.log(itemDetails);
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    },
    [i18n.language]
  );

  return { itemDetails, fetchItemDetails };
};

export default useItemDetails;
