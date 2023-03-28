import React, { useState, useEffect } from "react";
import { getWarehouseItems } from "../../../api/api";
import useAdminRole from "../../../hooks/useAdminRole";
import AdminLayout from "../AdminLayout";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";

import "./EquipmentList.scss";

const EquipmentList = () => {
  useAdminRole();
  const { i18n } = useTranslation();
  const direction = i18n.language === "he" ? "rtl" : "ltr";

  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const warehouseItems = await getWarehouseItems();
        setItems(warehouseItems);
      } catch (error) {
        console.error("Error fetching warehouse items.", error);
      }
    };

    fetchItems();
  });
  return (
    <div className="admin-equipment-list">
      <AdminLayout direction={direction}></AdminLayout>
      <main className="equipment-list">
        <p className="title">
          Effortlessly Browse and Filter Equipment Categories
        </p>
        <div className="search">
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            label="Search By Category"
          />
        </div>
        <div className="equipments-grid">
          {items.map((item) => (
            <div key={item.id} className="list-item">
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <div className="item-tag">{item.type}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EquipmentList;
