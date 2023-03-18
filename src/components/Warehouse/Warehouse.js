import React, { useState, useEffect } from "react";
import { getWarehouseItems } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./Warehouse.scss";

const Warehouse = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const tags = [
    "All",
    "Audio",
    "Camera",
    "Lighting",
    "Computer",
    "Video Production",
    "Presentation",
    "Storage",
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth/login");
    } else {
      const fetchItems = async () => {
        if (isAuthenticated) {
          try {
            const warehouseItems = await getWarehouseItems();
            setItems(warehouseItems);
          } catch (error) {
            console.error("Error fetching warehouse items:", error);
          }
        }
      };

      fetchItems();
    }
  }, [isAuthenticated, navigate, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="warehouse-container">
      <header className="warehouse-header">
        <h1>The Visual Nexus: Where Creativity Meets Equipment</h1>
        <h2>
          Discover, reserve, and conquer your projects with the right tools
        </h2>
      </header>
      <div className="tag-container">
        {tags.map((tag, index) => (
          <button
            key={index}
            className={`tag-button ${selectedTag === tag ? "selected" : ""}`}
            onClick={() => setSelectedTag(tag === "All" ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="warehouse">
        {items
          .filter((item) => !selectedTag || item.type === selectedTag)
          .map((item) => (
            <div key={item.id} className="item">
              <div className="item-details">
                <h3>
                  <Link to={`/warehouse/item/${item.id}`}>{item.name}</Link>
                </h3>
                <p>{item.description}</p>
              </div>
              <div className="item-tag">{item.type}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Warehouse;
