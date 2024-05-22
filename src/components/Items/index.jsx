import React, { useContext, useEffect, useState } from "react";
import { Table } from "antd";
import { json, useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { languageContext } from "../../App";
import "./style.css";

export default function Items({ orders }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingStatus, setShippingStatus] = useState();
  const [shippings, setShippings] = useState({
    selfCollecting: "",
    deliver: "",
  });
  const { language } = useContext(languageContext);
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
  const nav = useNavigate();
  const columns = [
    {
      title: language === "hebrew" ? "כתובת" : "तारीख",
      dataIndex: "city",
    },
    {
      title: language === "hebrew" ? "הזמנה" : "क्रम संख्या",
      dataIndex: "number",
    },
    {
      title: language === "hebrew" ? "סה''כ" : "स्थिति",
      dataIndex: "total",
    },
    {
      title: language === "hebrew" ? "כמות" : "स्थिति",
      dataIndex: "collected",
    },
  ];
  useEffect(() => {
    if (orders && orders.length > 0) {
      setShippings((prev) => ({
        selfCollecting: orders.filter(
          (order) => order.shipping_total == "0.00"
        ),
        deliver: orders.filter((order) => order.shipping_total != "0.00"),
      }));
      if(sessionStorage.getItem("shippingStatus")){
        setShippingStatus(sessionStorage.getItem("shippingStatus"))
      }
      else{
        setShippingStatus('deliver')
      }
      setLoading(false);
    } else if (orders) {
      setLoading(false);
    }
  }, [orders]);
  useEffect(() => {
    if (shippingStatus) {
      setData(
        shippings[shippingStatus]
          .map((item) => {
            return {
              key: item.id,
              city: item.shipping.city,
              number: item.number,
              total: item.total,
              collected: (sessionStorage.getItem(item.number)?JSON.parse(sessionStorage.getItem(item.number)).length:'0')+"/"+item.line_items.length,
              status: item.status
            };
          })
          .sort((a, b) => a.number - b.number)
      );
    }
  }, [shippingStatus]);
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="collectingOptions">
            <button
              className={`coButton ${shippingStatus=='selfCollecting'? 'selected' : ''}`}
              onClick={(e) => {
                sessionStorage.setItem('shippingStatus', e.target.value);
                setShippingStatus(e.target.value);
              }}
              value="selfCollecting"
            >
              ללא משלוח (
              {shippings.selfCollecting ? shippings.selfCollecting.length : ""})
            </button>
            <button
              className={`coButton ${shippingStatus=='deliver'? 'selected' : ''}`}
              onClick={(e) => {
                sessionStorage.setItem('shippingStatus', e.target.value);
                setShippingStatus(e.target.value);
              }}
              value="deliver"
            >
              משלוחים ({shippings.deliver ? shippings.deliver.length : ""})
            </button>
          </div>
          {data.length>0&&<Table
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  if (
                    data[rowIndex].status!='likut'||
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
