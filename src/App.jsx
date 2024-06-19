import { createContext, useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Items from "./components/Items";
import Item from "./components/Item";
import Header from "./components/Header";

export const languageContext = createContext()
function App() {
  const [orders, setOrders] = useState();
  const [updateOrders, setUpdateOrders] = useState(false);
  const [language, setLanguage] = useState('hebrew');
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const nav = useNavigate();

  const go = async () => {
    const res = await axios.get(
      "https://meshek-kirshner.co.il/wp-json/wc/v3/orders?consumer_key=ck_c46ca7077572152d70f72053920ec5d19e552ad1&consumer_secret=cs_3abdc6f2aeaf8f098a7497875e25430e6abdef29&status=processing likut&per_page=100"
    );
    if (res.data && res.data.length > 0)
      setOrders(res.data);
    else {
      setOrders([]);
    }
  };

  useEffect(() => {
    go();
  }, [updateOrders]);

  useEffect(() => {
    setLanguage('hebrew')
    nav('../items')
  }, [])

  return (
    <languageContext.Provider value={{ language, setLanguage }}>
      {location.pathname.includes('items') &&
        <Header id={id} go={go} loading={loading} setLoading={setLoading} />}
      <main className="main" style={{ direction: language === 'hebrew' ? 'rtl' : 'ltr' }}>
        <Routes>
          <Route path="/items" element={<Items
            orders={orders}
            loading={loading}
            setLoading={setLoading}
          />} />
          <Route path="/items/:id" element={<Item
            orders={orders}
            setOrders={setOrders}
            setUpdateOrders={setUpdateOrders}
            setId={setId}
            loading={loading}
            setLoading={setLoading}
          />} />
        </Routes>
      </main>
    </languageContext.Provider>
  );
}

export default App;
