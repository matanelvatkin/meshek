import React, { useContext, useEffect, useState } from "react";
import { Table } from "antd";
import { json, useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { languageContext } from "../../App";
import "./style.css";
import { getWord } from "../Language";
import axios from "axios";

export default function Items({ orders, loading, setLoading }) {
  const { language } = useContext(languageContext);

  const nav = useNavigate();

  const [data, setData] = useState([]);
  const [cityNames, setCityNames] = useState(true);
  const [shippingStatus, setShippingStatus] = useState();
  const [shippings, setShippings] = useState({
    selfCollecting: "",
    deliver: "",
  });

  const shipment = getWord('shipment');
  const selfCollected = getWord('selfCollected');

  const rowClassName = (record, index) => {
    if (data[index].status == "likut") {
      if (localStorage.getItem(data[index].number)) {
        return "t_green";
      } else {
        return "t_red";
      }
    } else {
      return "";
    }
  };

  const translateText = async (text) => {
    try {
      let response = await axios.get(
        "https://api.mymemory.translated.net/get",
        {
          params: {
            q: text,
            langpair: "he|en",
          },
        }
      );
      return (response.data.responseData.translatedText);
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };

  const columns = [
    {
      title: getWord('address'),
      dataIndex: "city",
    },
    {
      title: getWord('id'),
      dataIndex: "number",
    },
    {
      title: getWord("total"),
      dataIndex: "total",
    },
    {
      title: getWord('quantity'),
      dataIndex: "collected",
    },
  ];

  useEffect(() => {
    if (orders && orders.length > 0) {
      orders.forEach(async order => {
        const city = language === 'hebrew' ? order.shipping.city : await translateText(order.shipping.city)
        setCityNames(prev => ({ ...prev, [order.id]: city }))
      })

      setShippings((prev) => ({
        selfCollecting: orders.filter(
          (order) => order.shipping_total == "0.00"
        ),
        deliver: orders.filter((order) => order.shipping_total != "0.00"),
      }));

      if (sessionStorage.getItem("shippingStatus")) {
        setShippingStatus(sessionStorage.getItem("shippingStatus"))
      }
      else {
        setShippingStatus('deliver')
      }

      setLoading(false);
      
    } else if (orders) {
      setLoading(false);
    }
  }, [orders, language]);

  useEffect(() => {
    if (shippingStatus) {
      setData(
        shippings[shippingStatus]
          .map((item) => {
            return {
              key: item.id,
              city: cityNames[item.id],
              number: item.number,
              total: item.total,
              collected: (sessionStorage.getItem(item.number) ? JSON.parse(sessionStorage.getItem(item.number)).length : '0') + "/" + item.line_items.length,
              status: item.status
            };
          })
          .sort((a, b) => a.number - b.number)
      );
    }
  }, [shippingStatus, cityNames]);


  return (
    <div className="itemsContainer">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="collectingOptions">
            <button
              className={`coButton ${shippingStatus == 'selfCollecting' ? 'selected' : ''}`}
              onClick={(e) => {
                sessionStorage.setItem('shippingStatus', e.target.value);
                setShippingStatus(e.target.value);
              }}
              value="selfCollecting"
            >
              {selfCollected} (
              {shippings.selfCollecting ? shippings.selfCollecting.length : ""})
            </button>
            <button
              className={`coButton ${shippingStatus == 'deliver' ? 'selected' : ''}`}
              onClick={(e) => {
                sessionStorage.setItem('shippingStatus', e.target.value);
                setShippingStatus(e.target.value);
              }}
              value="deliver"
            >
              {shipment} ({shippings.deliver ? shippings.deliver.length : ""})
            </button>
          </div>
          {data.length > 0 && <Table
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  if (
                    data[rowIndex].status != 'likut' ||
                    localStorage.getItem(data[rowIndex].number)
                  ) {
                    localStorage.setItem(data[rowIndex].number, true);
                    nav("../items/" + data[rowIndex].number);
                  }
                },
              };
            }}
            pagination={false}
            bordered={true}
            dataSource={data}
            columns={columns}
            rowClassName={rowClassName}
          />}
        </>
      )}
    </div>
  );
}
