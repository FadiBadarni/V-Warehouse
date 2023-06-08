import React, { useState } from "react";
import "./Select.scss";
import warehouse from "../../assets/warehouse.png";
// import studioRoom from "../../assets/studio-room.gif";

const Select = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleSelect = (photo) => {
    setSelectedPhoto(photo);
    if (photo === "img2") {
      window.location.href = "/warehouse";
    } else window.location.href = "/room";
  };

  return (
    <div className="select-container">
      {/* <h1 className="title">Select an Image</h1> */}
      <div className="photo-gallery">
        <div
          className={`gallery-item ${
            selectedPhoto === "img1" ? "selected" : ""
          }`}
          onClick={() => handleSelect("img1")}>
          <img
            src="https://images.squarespace-cdn.com/content/v1/50e46031e4b0c2f49772822a/1630428519904-ZQW72DBGNYD34XWG6D7T/234387297_10158952489934681_538939411794666493_n.jpg?format=1000w"
            alt="Image 1"
          />
          <div className="overlay-text">Room</div>
        </div>

        <div
          className={`gallery-item ${
            selectedPhoto === "img2" ? "selected" : ""
          }`}
          onClick={() => handleSelect("img2")}>
          <img src={warehouse} alt="Image 2" />
          <div className="overlay-text">Borrow</div>
        </div>
      </div>
    </div>
  );
};

export default Select;
