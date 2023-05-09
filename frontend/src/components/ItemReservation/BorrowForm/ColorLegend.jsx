import { useTranslation } from "react-i18next";

const ColorLegend = () => {
  const { t } = useTranslation("itemReservation");

  return (
    <div className="color-legend">
      <h4>{t("itemReservation.legendTitle")}</h4>
      <div>
        <span></span> {t("itemReservation.unavailable")}
      </div>
      <div>
        <span></span> {t("itemReservation.pending")}
      </div>
      <div>
        <span></span> {t("itemReservation.available")}
      </div>
      <div>
        <span></span> {t("itemReservation.partiallyPending")}
      </div>
      <div>
        <span></span> {t("itemReservation.partiallyBooked")}
      </div>
    </div>
  );
};

export default ColorLegend;
