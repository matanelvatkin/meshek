import React, { useContext, useEffect } from "react";
import { languageContext } from "../../App";
import "./style.css";

const LA = {
  india: {
    image: "Image",
    name: "Name",
    quantity: "Qty",
    arr_you_shure: "Are you shure?",
    id: "Order number",
    address: "Address",
    notes: "notes",
    numOfBoxes: "Number of boxes",
    back: "Back",
    total: "Total",
    selfCollected: "Pickup",
    shipment: "Shipping",
    choseMelaket:"Chose Your Name",
    phone:'Phone',
    leaveOrder: "Leave the order",
    leaveConfirm: "This action will unassign this order to you, are you sure you want to exit?",
    loadingOrders: "Loading orders",
    saveOrderToYou: "Saves the order for you",
    leavingOrder: "Leaving the order to others"
  },
  en: {
    image: "Image",
    name: "Name",
    quantity: "Qty",
    arr_you_shure: "Are you shure?",
    id: "Order number",
    address: "Address",
    notes: "notes",
    numOfBoxes: "Number of boxes",
    back: "Back",
    total: "Total",
    selfCollected: "Pickup",
    shipment: "Shipping",
    choseMelaket:"Chose Your Name",
    phone:'Phone',
    leaveOrder: "Leave the order",
    leaveConfirm: "This action will unassign this order to you, are you sure you want to exit?",
    loadingOrders: "Loading orders",
    saveOrderToYou: "Saves the order for you",
    leavingOrder: "Leaving the order to others"
  },
  hebrew: {
    image: "תמונה",
    name: "שם",
    quantity: "כמות",
    arr_you_shure: "אתה בטוח שסיימת?",
    id: "מספר הזמנה",
    address: "כתובת",
    notes: "הערות",
    numOfBoxes: "מספר ארגזים",
    back: "אחורה",
    total: "סכום",
    selfCollected: "ללא משלוח",
    shipment: "משלוחים",
    choseMelaket:'בסיום יש לבחור את שם המלקט',
    phone:'פלאפון',
    leaveOrder: "נטישת הזמנה",
    leaveConfirm: "פעולה זאת תבטל את הקצאת הזמנה זאת אליך, האם אתה בטוח שברצונך לצאת?",
    loadingOrders: "טוען הזמנות",
    saveOrderToYou: "שומר לך את ההזמנה",
    leavingOrder: "נוטש הזמנה"
  },
};

export const getWord = (word) => {
  const { language } = useContext(languageContext);
  return <>{LA[language][word]}</>
};

export default function Language({ setOpenMenu }) {
  const { setLanguage } = useContext(languageContext);
  const onClick = (e) => {
    setLanguage(e.target.value);
    setOpenMenu((prev) => !prev);
  };

  return (
    <div className="lan">
      <button className="deButton" onClick={onClick} value="hebrew">
        עברית
      </button>
      <button className="deButton" onClick={onClick} value="india">
        हिंदी
      </button>
      {/* <button className="deButton" onClick={onClick} value="en">
        english
      </button> */}
    </div>
  );
}
