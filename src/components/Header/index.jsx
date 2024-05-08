import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { languageContext } from "../../App";
import "./style.css";
import Language from "../Language";

export default function Header() {
  const { language } = useContext(languageContext);
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const nav = useNavigate();
  const onClick = (e) => {
    nav(e.target.value);
  };
  const handleClick = () => {
    setOpenMenu(prev=>!prev)
  };
  return (
    <div className="header">
      <button
        className="deButton relative"
        onClick={() =>handleClick()}
      >
        {language === "hebrew" ? "שפה" : "भाषा"}
      </button>
      {openMenu && <Language setOpenMenu={setOpenMenu} />}
      {location.pathname !== "/items" && (
        <button className="deButton" onClick={onClick} value={"../items"}>
          {language === "hebrew" ? "הזמנות" : "आदेश"}
        </button>
      )}
    </div>
  );
}
