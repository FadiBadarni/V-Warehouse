import React, { useState, useEffect } from "react";
import { getWarehouseItems } from "../../../api/api";
import AdminLayout from "../AdminLayout";
import "./EquipmentList.scss";

const EquipmentList = () => {
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
      <AdminLayout></AdminLayout>
      <main className="equipment-list">
        <h2>Equipment List</h2>
        {items.map((item) => (
          <div key={item.id} className="item">
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
            <div className="item-tag">{item.type}</div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default EquipmentList;
