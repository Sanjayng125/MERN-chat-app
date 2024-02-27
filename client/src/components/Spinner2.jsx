import React from "react";
import "./Spinner2.css";

const Spinner2 = ({ width, height }) => {
  return (
    <div
      className="Spinner"
      style={{ width: width || "80px", height: height || "80px" }}
    ></div>
  );
};

export default Spinner2;
