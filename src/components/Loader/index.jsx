import React from "react";
import "./style.css";
import logo from "../../../public/logo.svg";

export default function Loader() {
  return (
    <div className="loader-container">
        <img  className="logo" src={logo}></img>
      <div className="loader">
      </div>
    </div>
  );
}
