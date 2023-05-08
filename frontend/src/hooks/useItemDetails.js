import { useState, useCallback } from "react";
import { getWarehouseItemById } from "../api/WarehouseService";
import { translateText } from "../api/TranslationService";
import { useTranslation } from "react-i18next";

const useItemDetails = () => {
  const [itemDetails, setItemDetails] = useState({
    itemInstances: [],
  });
  const { i18n } = useTranslation();

  const translateItemDetails = useCallback(async (itemDetails, language) => {
    if (language === "en") {
      return itemDetails;
    }

    const translatedName = await translateText(itemDetails.name, language);
    const translatedDescription = await translateText(
      itemDetails.description,
      language
    );
    const translatedTypeName = await translateText(
      itemDetails.itemType.name,
      language
    );

    return {
      ...itemDetails,
      name: translatedName,
      description: translatedDescription,
      itemType: {
        ...itemDetails.itemType,
        name: translatedTypeName,
        attributes: itemDetails.itemType.attributes,
      },
    };
  }, []);

  const fetchItemDetails = useCallback(
    async (itemId) => {
      try {
        const itemDetails = await getWarehouseItemById(itemId);
        const translatedItemDetails = await translateItemDetails(
          itemDetails,
          i18n.language
        );
        setItemDetails(translatedItemDetails);
        return translatedItemDetails;
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    },
    [i18n.language, translateItemDetails]
  );

  return { itemDetails, fetchItemDetails };
};

export default useItemDetails;
