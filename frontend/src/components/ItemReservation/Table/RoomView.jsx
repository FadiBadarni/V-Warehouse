import React, { useRef, useState } from "react";
import "./RoomView.scss";

const RoomView = () => {
  // Create a ref to the img element
  const imgRef = useRef(null);
  const [myText, setMyText] = useState("ROOM");

  // Handle click event on the img element
  const handleMouseMove = (event) => {
    // 520 166  354 137
    const img = imgRef.current;
    if (img) {
      const rect = img.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x >= 200 && x <= 730 && y >= 7 && y <= 325) {
        //   console.log(x, y);
        setMyText("Green Wall");
      } else if (x >= 190 && x <= 440 && y >= 490 && y <= 700) {
        //   console.log(x, y);
        setMyText("Make BOOK");
      } else if (x >= 30 && x <= 230 && y >= 34 && y <= 188) {
        //   console.log(x, y);
        setMyText("Light");
      } else if (x >= 814 && x <= 850 && y >= 194 && y <= 230) {
        //   console.log(x, y);
        setMyText("Camera");
      } else setMyText("ROOM");

      //   console.log(x, y);
    }
  };

  // Handle mouse leave event
  const handleMouseLeave = () => {
    // console.log("Mouse left the image");
    // Perform any desired actions when the mouse leaves the image
  };

  return (
    <div className="full-view-photo-container">
      <div className="photo-frame">
        <img
          src="https://images.squarespace-cdn.com/content/v1/50e46031e4b0c2f49772822a/1630428519904-ZQW72DBGNYD34XWG6D7T/234387297_10158952489934681_538939411794666493_n.jpg?format=1000w"
          alt="Full View Photo"
          className="full-view-photo"
          //   onClick={handleClick}
          onMouseMove={handleMouseMove}
          ref={imgRef}
        />
        <div className="text-overlay">
          <h2>{myText}</h2>
        </div>
      </div>
    </div>
  );
};

export default RoomView;
