import React, { useState, useEffect } from "react";
import { getAllItemInstances, fetchItemNames } from "../../../api/AdminService";
import { fetchedItemTypes } from "../../../api/WarehouseService";
import useAdminRole from "../../../hooks/useAdminRole";
import AdminLayout from "../AdminLayout";
import { useTranslation } from "react-i18next";
import { TextField, MenuItem, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CategoryIcon from "@mui/icons-material/Category";
import LabelIcon from "@mui/icons-material/Label";
import SyncIcon from "@mui/icons-material/Sync";
import { useAuth } from "../../../contexts/AuthContext";
import "./ItemList.scss";
import { Grid, Card, CardContent, CardActions, Button } from "@mui/material";

const useItemFilter = (initialItems) => {
  const [filteredItems, setFilteredItems] = useState(initialItems);
  const [itemType, setItemType] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemState, setItemState] = useState("");

  useEffect(() => {
    const filtered = initialItems.filter(
      (item) =>
        (itemType === "" || itemType === item.itemType.name) &&
        (itemName === "" || itemName === item.itemName) &&
        (itemState === "" || itemState === item.state)
    );
    setFilteredItems(filtered);
  }, [initialItems, itemType, itemName, itemState]);

  return {
    filteredItems,
    itemType,
    setItemType,
    itemName,
    setItemName,
    itemState,
    setItemState,
  };
};

const ItemList = () => {
  useAdminRole();
  const { handleTokenExpired } = useAuth();
  const { i18n } = useTranslation();
  const direction = i18n.language === "he" ? "rtl" : "ltr";

  const [items, setItems] = useState([]);
  const [type, setType] = useState([]);
  const [names, setName] = useState([]);

  const {
    filteredItems,
    itemType,
    setItemType,
    itemName,
    setItemName,
    itemState,
    setItemState,
  } = useItemFilter(items);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const allItemInstances = await getAllItemInstances();
        setItems(allItemInstances);
      } catch (error) {
        console.log(error);
        if (error.message === "Unauthorized") {
          handleTokenExpired();
        } else {
          console.error("Error fetching warehouse items.", error);
        }
      }
    };
    const fetchedTypes = async () => {
      const type = await fetchedItemTypes();
      setType(type);
    };
    const fetchNames = async () => {
      const names2 = await fetchItemNames();
      setName(names2);
    };
    fetchItems();
    fetchedTypes();
    fetchNames();
  }, [handleTokenExpired]);

  return (
    <div className="admin-equipment-list">
      <AdminLayout direction={direction}></AdminLayout>
      <main className="equipment-list">
        <p className="title">
          Effortlessly Browse and Filter Equipment Categories
        </p>
        <div className="search-filters">
          <div className="search">
            <TextField
              id="outlined-basic"
              variant="outlined"
              fullWidth
              label="Search By Category"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="filters">
            <TextField
              select
              label="Filter by Type"
              value={itemType}
              onChange={(event) => setItemType(event.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon />
                  </InputAdornment>
                ),
              }}
            >
              {type.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Filter by Name"
              value={itemName}
              onChange={(event) => setItemName(event.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LabelIcon />
                  </InputAdornment>
                ),
              }}
            >
              {names.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Filter by State"
              value={itemState}
              onChange={(event) => setItemState(event.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SyncIcon />
                  </InputAdornment>
                ),
              }}
            >
              {["TAKEN", "DAMAGED", "IN_MAINTENANCE", "AVAILABLE"].map(
                (option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                )
              )}
            </TextField>
          </div>
        </div>
        <div className="equipments-grid">
          <Grid container spacing={2}>
            {filteredItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={2.5} key={item.id}>
                <Card className="item-card" elevation={3}>
                  <CardContent className="item-card__details">
                    <p className="item-card__title">{item.itemName}</p>
                    <p className="item-card__body">{item.state}</p>
                  </CardContent>
                  <CardActions className="item-card__actions">
                    <Button className="item-card__button" size="small">
                      More info
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </main>
    </div>
  );
};

export default ItemList;
