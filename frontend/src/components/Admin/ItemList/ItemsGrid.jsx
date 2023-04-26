import React from "react";
import { Grid, Card, CardContent, CardActions, Button } from "@mui/material";

const ItemsGrid = ({ filteredItems, handleMoreInfoClick }) => {
  return (
    <div className="items-grid">
      <Grid container spacing={2}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card className="item-card" elevation={3}>
              <CardContent className="item-card__details">
                <div className="item-card__header">
                  <p className="item-card__title">{item.itemName}</p>
                  <p
                    className={`item-card__state item-card__state--${item.state.toLowerCase()}`}
                  >
                    {item.state === "AVAILABLE"
                      ? "Available"
                      : item.state === "TAKEN"
                      ? "Taken"
                      : item.state === "DAMAGED"
                      ? "Damaged"
                      : "In Maintenance"}
                  </p>
                </div>
              </CardContent>
              <CardActions className="item-card__actions">
                <Button
                  className="item-card__button"
                  size="small"
                  onClick={() => handleMoreInfoClick(item)}
                >
                  More info
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ItemsGrid;
