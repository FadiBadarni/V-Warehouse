import React from "react";

const ItemInfo = ({ item }) => (
  <div className="item-info">
    <h2>{item.name}</h2>
    <p>{item.description}</p>
    <p>Type: {item.type}</p>
    <p>{item.accompanyingEquipment}</p>
    <p>{item.safetyInstructions}</p>
  </div>
);

export default ItemInfo;
