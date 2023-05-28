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

import "./Warehouse.scss";

const Warehouse = () => {
  const { isAuthenticated, loading, handleTokenExpired } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  const [tags, setTags] = useState(["All"]);

  const { t, i18n } = useTranslation("warehouse");

  const fetchItems = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const warehouseItems = await getWarehouseItems();

        const newTags = await fetchedItemTypes();
        setTags(["All", ...newTags]);

        const translatedItems = await Promise.all(
          warehouseItems.map(async (item) => {
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

        setItems(translatedItems);
      } catch (error) {
        if (error.message === "Unauthorized") {
          handleTokenExpired();
        } else {
          console.error("Error fetching warehouse items:", error);
        }
      }
    }
  }, [isAuthenticated, i18n.language, handleTokenExpired]);

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
        <div className="warehouse__tag-container">
          {tags.map((tag, index) => (
            <button
              key={index}
              className={`warehouse__tag-button ${
                selectedTag === tag ? "warehouse__tag-button--selected" : ""
              }`}
              onClick={() => setSelectedTag(tag === "All" ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <Items items={items} selectedTag={selectedTag} />

        <Fab
          component={Link}
          to="/warehouse/items/2852"
          aria-label="add"
          className="fab"
          variant="extended"
        >
          <RoomIcon />
          <span className="fab-text">Reserve Room</span>
        </Fab>
      </div>
    </div>
  );
};

export default Warehouse;
