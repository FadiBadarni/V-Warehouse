import React, { useState, useEffect, useCallback } from "react";
import { getWarehouseItems } from "../../api/WarehouseService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { translateText } from "../../api/TranslationService";
import { fetchedItemTypes } from "../../api/WarehouseService";
import Items from "./Items";
import Skeleton from "@mui/material/Skeleton";
import Fab from "@mui/material/Fab";
import RoomIcon from "@mui/icons-material/Room";
import { Link } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  TextField,
  Switch,
  Grid,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import NoMeetingRoomIcon from "@mui/icons-material/NoMeetingRoom";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/system";

import "./Warehouse.scss";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 64, // Switch width
  height: 28, // Switch height
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 1,
    margin: 1.5, // Adjusted margin to fit smaller thumb
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(36px)", // Ensure the thumb slides to the end
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#64dd17",
      },
    },
    "&.Mui-focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff", // Add focus border to the thumb
    },
  },
  "& .MuiSwitch-thumb": {
    width: 24, // Smaller thumb width
    height: 24, // Smaller thumb height
    boxShadow: "none", // Remove default shadow
  },
  "& .MuiSwitch-track": {
    borderRadius: 14, // Track rounded ends
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be", // Track color
    boxSizing: "border-box", // Ensures consistent dimensions
  },
}));

const Warehouse = () => {
  const { isAuthenticated, loading, handleTokenExpired } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedTag] = useState(null);
  const [tags, setTags] = useState(["All"]);
  const { t, i18n } = useTranslation("warehouse");

  const [filter, setFilter] = useState(""); // State for the filter
  const [nameFilter, setNameFilter] = useState("");

  const [checked, setChecked] = useState(false);

  const fetchItems = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const warehouseItems = await getWarehouseItems();
        const newTags = await fetchedItemTypes();
        setTags(["All", ...newTags]);

        const filteredItems = await Promise.all(
          warehouseItems
            .filter(
              (item) =>
                (filter === "" || item.itemType.name === filter) &&
                item.name.includes(nameFilter) &&
                (checked ? item.takeOut : !item.takeOut)
            )
            .map(async (item) => {
              if (i18n.language !== "en") {
                const translatedDescription = await translateText(
                  item.description,
                  i18n.language
                );

                return {
                  ...item,
                  name: item.name,
                  description: translatedDescription,
                };
              }
              return item;
            })
        );

        setItems(filteredItems);
      } catch (error) {
        if (error.message === "Unauthorized") {
          handleTokenExpired();
        } else {
          console.error("Error fetching warehouse items:", error);
        }
      }
    }
  }, [
    isAuthenticated,
    i18n.language,
    handleTokenExpired,
    filter,
    nameFilter,
    checked,
  ]);

  const toggleChecked = () => {
    setChecked((prev) => !prev);
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth/login");
    } else {
      fetchItems();
    }
  }, [isAuthenticated, navigate, loading, i18n.language, fetchItems]);

  if (loading) {
    return (
      <div className="warehouse-background">
        <div className="warehouse">
          <header className="warehouse__header">
            <Skeleton variant="text" width={210} height={40} />
            <Skeleton variant="text" width={300} height={40} />
          </header>
          <div className="warehouse__tag-container">
            {[...Array(5)].map((item, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={80}
                height={30}
                style={{ borderRadius: 4, marginRight: 10 }}
              />
            ))}
          </div>
          <div style={{ marginTop: "20px" }}>
            {[...Array(3)].map((item, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={"100%"}
                height={200}
                style={{ marginBottom: "20px", borderRadius: 4 }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="warehouse-background">
      <div className="warehouse">
        <header className="warehouse__header">
          <h1>{t("warehouse.title")}</h1>
          <h2>{t("warehouse.subtitle")}</h2>
        </header>
        <div className="warehouse__controls">
          <FormControl variant="outlined" className="warehouse__item-type">
            <InputLabel id="demo-simple-select-label">
              {t("warehouse.itemType")}
            </InputLabel>
            <Select
              labelId="item-type-label"
              label={t("warehouse.itemType")}
              id="demo-simple-select"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <CategoryIcon />
                </InputAdornment>
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "300px",
                  },
                },
              }}
            >
              {tags.map((tag, index) => (
                <MenuItem value={tag} key={index}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            label={t("warehouse.searchByName")}
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="warehouse__search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormGroup className="warehouse__toggle-switch">
            <FormControlLabel
              control={
                <Grid container alignItems="center">
                  <Grid item>
                    <Tooltip title="Items to be borrowed in the studio">
                      <NoMeetingRoomIcon />
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <CustomSwitch checked={checked} onChange={toggleChecked} />
                  </Grid>
                  <Grid item>
                    <Tooltip title="Items that can be taken out">
                      <MeetingRoomIcon />
                    </Tooltip>
                  </Grid>
                </Grid>
              }
              label={t("warehouse.takeoutItems")}
              labelPlacement="top"
            />
          </FormGroup>
        </div>

        <Items items={items} selectedTag={selectedTag} checked={checked} />

        <Fab
          component={Link}
          to="/warehouse/items/2852"
          aria-label="add"
          className="fab"
          variant="extended"
        >
          <RoomIcon />
          <span className="fab-text">{t("warehouse.reserveRoom")}</span>
        </Fab>
      </div>
    </div>
  );
};

export default Warehouse;
