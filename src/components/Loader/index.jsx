import React from "react";
import "./style.css";
import logo from "../../../public/logo.svg";
import useLoadingStore from "../../LoadingContext";
import { getWord } from "../Language";

export default function Loader() {

  const { text } = useLoadingStore();
  console.log('text: ', text);

  const translatedText = getWord(text);
  const loading = translatedText.props.children || 'Loading';

  return (
    <div className="loader-container">
      <div className="imageHolder">
        <img className="logo" src={logo}></img>
        <div className="loader" />
      </div>
      {/* טקסט מותאם אישית */}
      <h2>{loading}...</h2>
    </div>
  );
}
