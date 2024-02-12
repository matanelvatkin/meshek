import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Items from "./components/Items";
import Item from "./components/Item";

function App() {
  const [orders, setOrders] = useState();
  const [updateOrders, setUpdateOrders] = useState(false);
  const location=useLocation()
  const nav = useNavigate();
  const go = async () => {
    const res = await axios.get(
      "https://meshek-kirshner.co.il/wp-json/wc/v3/orders?consumer_key=ck_c46ca7077572152d70f72053920ec5d19e552ad1&consumer_secret=cs_3abdc6f2aeaf8f098a7497875e25430e6abdef29&per_page=100"
    );
    setOrders(res.data);
  };
  useEffect(() => {
    go();
    if (!location.pathname.includes("/items")) nav("/items");
  }, [updateOrders]);

  return (
    <Routes>
      <Route path="/*" element={<Items orders={orders} />} />
      <Route path="/items/:id" element={<Item orders={orders} setOrders={setOrders} setUpdateOrders={setUpdateOrders}/>} />
    </Routes>
  );
}

export default App;
