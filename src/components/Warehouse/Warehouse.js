import React, { useState, useEffect } from "react";
import { getWarehouseItems } from "../../api/WarehouseService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { translateText } from "../../api/TranslationService";
import "./Warehouse.scss";

const Warehouse = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const tags = ["All", "Audio", "Cameras", "Lighting", "iPads", "Printers"];
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth/login");
    } else {
      const fetchItems = async () => {
        if (isAuthenticated) {
          try {
            const warehouseItems = await getWarehouseItems();
            const translatedItems = await Promise.all(
              warehouseItems.map(async (item) => {
                if (i18n.language !== "en") {
                  const translatedName = await translateText(
                    item.name,
                    i18n.language
                  );
                  const translatedDescription = await translateText(
                    item.description,
                    i18n.language
                  );

                  return {
                    ...item,
                    name: translatedName,
                    description: translatedDescription,
                  };
                }
                return item;
              })
            );
            setItems(translatedItems);
          } catch (error) {
            console.error("Error fetching warehouse items:", error);
          }
        }
      };

      fetchItems();
    }
  }, [isAuthenticated, navigate, loading, i18n.language]);

  if (loading) {
    return <div>Loading...</div>;
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
        <div className="warehouse__items">
          {items
            .filter((item) => !selectedTag || item.type === selectedTag)
            .map((item) => (
              <div key={item.id} className="warehouse__item">
                <div className="warehouse__item-details">
                  <h3>
                    <Link to={`/warehouse/item/${item.id}`}>{item.name}</Link>
                  </h3>
                  <p>{item.description}</p>
                </div>
                <div className="warehouse__item-tag">{item.type}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Warehouse;
