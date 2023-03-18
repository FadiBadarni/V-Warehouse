import React from "react";
import AdminLayout from "../AdminLayout";

import "./EquipmentOrders.scss";

const EquipmentOrders = () => {
  return (
    <div className="section equipment-orders">
      <AdminLayout></AdminLayout>
      <div className="orders-section">
        <h2>Equipment Orders</h2>
        <form>
          <label htmlFor="equipment">Equipment:</label>
          <select id="equipment">
            <option>Camera</option>
            <option>Microphone</option>
            <option>Laptop</option>
            <option>Projector</option>
            <option>Headphones</option>
          </select>
          <br />
          <label htmlFor="quantity">Quantity:</label>
          <input type="number" id="quantity" min="1" defaultValue="1" />
          <br />
          <button type="submit">Submit Order</button>
        </form>
        <h3>Pending Orders:</h3>
        <ul>
          <li>
            John Doe - Camera - Quantity: 1<button>Approve</button>
          </li>
          <li>
            Jane Smith - Laptop - Quantity: 2<button>Approve</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EquipmentOrders;
