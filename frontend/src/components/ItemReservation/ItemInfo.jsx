import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Chip,
  CardActionArea,
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import images from "../../constants/images";
import Magnifier from "react-magnifier";

const attributeIcons = {
  default: <Settings />,
};

const ItemInfo = ({ fetchedItems }) => {
  const { t } = useTranslation("itemReservation");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!fetchedItems || fetchedItems.length === 0) {
    return <div>{t("itemReservation.loading")}</div>;
  }

  return (
    <Grid container spacing={4}>
      {fetchedItems.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <Card className="item-info">
            <CardActionArea>
              <Magnifier
                src={
                  images[item.name.toLowerCase().replace(/ /g, "_")] ||
                  images.notFound
                }
                width="100%"
                mgWidth={150}
                mgHeight={150}
                className="item-info__image"
              />
            </CardActionArea>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                {t("itemReservation.itemInfoTitle")}
                {item.name}
              </Typography>
              <Typography
                variant="body2"
                className="item-info__description"
                color="textSecondary"
                component="p"
                gutterBottom
              >
                {t("itemReservation.itemDescription")}
                {item.description}
              </Typography>
              <Box>
                {item.itemType &&
                item.itemType.attributes &&
                item.itemType.attributes.length > 0
                  ? item.itemType.attributes
                      .filter(
                        (attr) =>
                          attr.attributeName.trim() !== "" &&
                          attr.attributeValue.trim() !== ""
                      )
                      .map((attr) => (
                        <Chip
                          key={attr.id}
                          icon={
                            attributeIcons[attr.attributeName] ||
                            attributeIcons.default
                          }
                          label={`${attr.attributeName} ${attr.attributeValue}`}
                          className="item-info__attribute-chip"
                          variant="outlined"
                        />
                      ))
                  : null}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ItemInfo;
