import React from "react";
import { useNavigate } from "react-router-dom";
import "./Unauthorized.scss";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="unauthorized">
      <div className="unauthorized__container">
        <div className="unauthorized__graphic"></div>
        <h1 className="unauthorized__title">Access Denied</h1>
        <p className="unauthorized__text">
          Oops! You don't have permission to view this page.
        </p>
        <button className="unauthorized__button" onClick={goHome}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
