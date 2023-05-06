import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";

const attributeIcons = {
  default: <Settings />,
};

const ItemInfo = ({ fetchedItems }) => {
  const { t } = useTranslation("itemReservation");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!fetchedItems || fetchedItems.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="item-info">
      {fetchedItems.map((item) => (
        <React.Fragment key={item.id}>
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
            {item.itemType &&
            item.itemType.attributes &&
            item.itemType.attributes.length > 0 ? (
              <Grid container spacing={2}>
                {item.itemType.attributes
                  .filter(
                    (attr) =>
                      attr.attributeName.trim() !== "" &&
                      attr.attributeValue.trim() !== ""
                  )
                  .map((attr) => (
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
        </React.Fragment>
      ))}
    </div>
  );
};

export default ItemInfo;
