import { useState } from "react";
import { getWarehouseItemById, translateText } from "../api/api";
import { useTranslation } from "react-i18next";

const useItemDetails = () => {
  const [itemDetails, setItemDetails] = useState({});
  const { i18n } = useTranslation();
  const fetchItemDetails = async (itemId, userId) => {
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
        const translatedType = await translateText(
          itemDetails.type,
          i18n.language
        );
        const translatedAccompanyingEquipment = await translateText(
          itemDetails.accompanyingEquipment,
          i18n.language
        );
        const translatedSafetyInstructions = await translateText(
          itemDetails.safetyInstructions,
          i18n.language
        );
        setItemDetails({
          ...itemDetails,
          name: translatedName,
          description: translatedDescription,
          type: translatedType,
          accompanyingEquipment: translatedAccompanyingEquipment,
          safetyInstructions: translatedSafetyInstructions,
        });
      } else {
        setItemDetails(itemDetails);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  return { itemDetails, fetchItemDetails };
};

export default useItemDetails;
