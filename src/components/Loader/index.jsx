import React from "react";
import "./style.css";
import logo from "../../../public/logo.jpeg";

export default function Loader() {
  return (
    <div className="loader-container">
        <img src={logo}></img>
      <div className="loader">
      </div>
    </div>
  );
}
