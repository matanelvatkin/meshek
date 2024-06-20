import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { languageContext } from "../../App";
import "./style.css";
import Language, { getWord } from "../Language";
import { FaLanguage, FaBackward } from "react-icons/fa";
import axios from "axios";
import useLoadingStore from "../../LoadingContext";


export default function Header({ id, go, setLoading, loading }) {
  const { language } = useContext(languageContext);

  // טקסט טעינה
  const { setText } = useLoadingStore();

  const location = useLocation();

  const backWord = getWord('back');
  const leaveWord = getWord('leaveOrder');
  const areYouSureWord = getWord('leaveConfirm');

  const [openMenu, setOpenMenu] = useState(false);

  const nav = useNavigate();

  // פונקציית נטישת הזמנה
  const leaveOrder = async () => {
    if (sessionStorage.getItem(id)) {
      setLoading(true);
      await axios.put(
        "https://meshek-kirshner.co.il/wp-json/wc/v3/orders/" + id +
        "?consumer_key=ck_c46ca7077572152d70f72053920ec5d19e552ad1&consumer_secret=cs_3abdc6f2aeaf8f098a7497875e25430e6abdef29",
        { status: "processing" }
      );

      sessionStorage.removeItem(id);
      localStorage.removeItem(id);
      await go();
    }
  };

  // const exit = async (e) => {
  //   setText("saveOrderToYou");
  //   setLoading(true);
  //   await go();
  //   nav(e.target.value);
  // };

  const leaveOrderBtn = async (e) => {
    let areYouSure = confirm(areYouSureWord.props.children);
    if (areYouSure) {
      setText("leavingOrder");
      setLoading(false);
      await leaveOrder();
      nav(e.target.value);
      // reload the page:
      window.location.reload();
    }
  };

  const handleClick = () => {
    setOpenMenu(prev => !prev)
  };

  if (loading) return <></>

  return (
    <div className="header">
      <button
        className="deButton2 relative"
        onClick={() => handleClick()}>
        <FaLanguage />
      </button>
      {openMenu && <Language setOpenMenu={setOpenMenu} />}
      {location.pathname !== "/items" && (
        <div className="btns">
          <button className="deButton3" onClick={leaveOrderBtn} value={"../items"}>
            {leaveWord}
          </button>
          {/* <button className="deButton3" onClick={exit} value={"../items"}>
            {backWord}
          </button> */}
        </div>
      )}
    </div>
  );
}
