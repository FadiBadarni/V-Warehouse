import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";

const attributeIcons = {
  default: <Settings />,
};

const ItemInfo = ({ item }) => {
  const { t } = useTranslation("itemReservation");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!item || !item.id) {
    return <div>Loading...</div>;
  }

  const validAttributes = item.itemType.attributes.filter(
    (attr) =>
      attr.attributeName.trim() !== "" && attr.attributeValue.trim() !== ""
  );

  return (
    <div className="item-info">
      <h2 className="item-info__title">
        {t("itemReservation.itemInfoTitle")}
        {item.name}
      </h2>
      {item.description && (
        <p className="item-info__description">
          {t("itemReservation.itemDescription")}
          {item.description}
        </p>
      )}
      <div className="item-info__details">
        {validAttributes.length > 0 ? (
          <Grid container spacing={2}>
            {validAttributes.map((attr) => (
              <Grid item xs={4} sm={3} md={2} key={attr.id}>
                <Card className="item-info__attribute-card">
                  <CardContent>
                    <div className="item-info__attribute-icon">
                      {attributeIcons[attr.attributeName] ||
                        attributeIcons.default}
                    </div>
                    <Typography
                      variant="subtitle1"
                      component="div"
                      className="item-info__attribute-text"
                    >
                      {attr.attributeName} {attr.attributeValue}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : null}
      </div>
    </div>
  );
};

export default ItemInfo;
