import React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";

const ItemsGrid = ({ loading, filteredItems, handleMoreInfoClick }) => {
  console.log(filteredItems);
  return (
    <div className="items-grid">
      <Grid container spacing={2}>
        {loading
          ? Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card className="item-card" elevation={3}>
                  <CardContent className="item-card__details">
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </CardContent>
                  <CardActions className="item-card__actions">
                    <Skeleton variant="rectangular" height={36} width="80%" />
                  </CardActions>
                </Card>
              </Grid>
            ))
          : filteredItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <Card className="item-card" elevation={3}>
                  <CardHeader
                    avatar={
                      <Tooltip title={`State: ${item.state}`}>
                        <Avatar
                          aria-label="status"
                          className={`item-card__state item-card__state--${item.state.toLowerCase()}`}
                        >
                          {item.state[0]}
                        </Avatar>
                      </Tooltip>
                    }
                    action={
                      <Tooltip title="View More Details">
                        <IconButton
                          onClick={() => handleMoreInfoClick(item)}
                          aria-label="more info"
                        >
                          <InfoOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    }
                    title={
                      <Typography variant="h8">{item.itemName}</Typography>
                    }
                    subheader={`S.N: ${item.id}`}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {`Item Type: ${item.itemType.name}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>
    </div>
  );
};

export default ItemsGrid;
