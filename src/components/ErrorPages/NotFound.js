import React, { useState } from "react";
import "./NotFound.scss";
const NotFound = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
    console.log("Search for:", searchQuery);
  };

  return (
    <div className="not-found">
      <div className="not-found__container">
        <div className="not-found__graphic"></div>
        <h1 className="not-found__title">Oops! This page doesn't exist.</h1>
        <p className="not-found__text">
          It seems like the page you're looking for has vanished into thin air.
          But don't worry, we've got you covered:
        </p>
        <ul className="not-found__links">
          <li>
            <a href="/">Home</a>
          </li>
          {/* Add other links as needed */}
        </ul>
        <p className="not-found__text">
          Or try searching for what you're looking for:
        </p>
        <form onSubmit={handleSearch} className="not-found__search">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <p className="not-found__text">
          If you still can't find what you're looking for, feel free to{" "}
          <a href="/contact">contact us</a> for assistance.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
