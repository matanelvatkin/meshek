import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Select, Table } from "antd";
import Loader from "../Loader";
import axios from "axios";
import logo from "../../../public/logo.jpeg";
import { languageContext } from "../../App";
import "./style.css";

export default function Item({ setOrders, orders, setUpdateOrders }) {
  const numberOfOrder = useParams();
  const { language } = useContext(languageContext);
  const nav = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [order, setOrder] = useState();
  const [status, setStatus] = useState([]);
  const columns = [
    {
      title: language === "hebrew" ? "תמונה" : "छवि",
      dataIndex: "image",
    },
    {
      title: language === "hebrew" ? "שם" : "नाम",
      dataIndex: "name",
    },
    {
      title: language === "hebrew" ? "כמות" : "मात्रा",
      dataIndex: "quantity",
    },
  ];
  useEffect(() => {
    if (orders) {
      const ordered = orders.find((item) => item.number === numberOfOrder.id);
      const res = (async () =>
        await axios.get(
          "https://meshek-kirshner.co.il/wp-json/wc/v3/orders/" +
            ordered.id +
            "?consumer_key=ck_c46ca7077572152d70f72053920ec5d19e552ad1&consumer_secret=cs_3abdc6f2aeaf8f098a7497875e25430e6abdef29"
        ))();
      if (res.status == "likut" && !localStorage.getItem(ordered.id))
        nav("../items");
      setOrder(ordered);
    }
  }, [orders]);
  useEffect(() => {
    const go = async () => {
      const res = await axios.get(
        "https://meshek-kirshner.co.il/wp-json/wp/v2/statuses?consumer_key=ck_c46ca7077572152d70f72053920ec5d19e552ad1&consumer_secret=cs_3abdc6f2aeaf8f098a7497875e25430e6abdef29"
      );
      setStatus(
        Object.keys(res.data)
          .filter((stat) => !stat.includes("acf-disabled"))
          .map((stat) => {
            if (!stat.includes("wc-")) {
              return {
                value: stat,
                label: stat,
              };
            }
            return {
              value: stat.slice(3),
              label: stat.slice(3),
            };
          })
      );
    };
    go();
  }, []);
  const rowClassName = (record, index) => {
    if (data[index].quantity > 1) {
        return "t_green";
      }
  };
  useEffect(() => {
    if (order) {
     
      setData(
        order.line_items.map((item, index) => {
          return {
            key: index,
            name: language === "hebrew" ? item.name : item._inhdia,
            image: (
              <img
                style={{ width: "60px", height: "60px" }}
                src={item.image.src || logo}
                alt={item.id}
              />
            ),
            quantity: item.quantity,
          };
        })
      );
      if (JSON.parse(sessionStorage.getItem(numberOfOrder.id))) {
        setSelectedRowKeys(
          JSON.parse(sessionStorage.getItem(numberOfOrder.id))
        );
      }
    }
  }, [order]);
  const onSelectChange = async (newSelectedRowKeys) => {
    if (!sessionStorage.getItem(numberOfOrder.id)) {
      await axios.put(
        "https://meshek-kirshner.co.il/wp-json/wc/v3/orders/" +
          order.number +
          "?consumer_key=ck_c46ca7077572152d70f72053920ec5d19e552ad1&consumer_secret=cs_3abdc6f2aeaf8f098a7497875e25430e6abdef29",
        { status: "likut" }
      );
    }
    sessionStorage.setItem(
      numberOfOrder.id,
      JSON.stringify(newSelectedRowKeys)
    );
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  const handleChange = async (value) => {
    if(confirm('אתה בטוח שסיימת?')){
    if (order.shipping_total != "0.00") {
      let regex = /^(.*?\d+)\s+/;
      let match = order.shipping.address_1.match(regex);
      let address = match ? match[1] : order.shipping.address_1;
      const orderData = {
        recipient_name:
          order.shipping.first_name + " " + order.shipping.last_name,
        expected_date: new Date(order.date_modified)
          .toISOString()
          .slice(0, order.date_modified.indexOf("T")),
        mobile: order.billing.phone,
        reference: order.number,
        instructions: order.customer_note,
        address: { street: address.trim(), city: order.shipping.city.trim() },
      };
      const res = await axios
        .post("https://app.delivers.co.il/api/shipments", orderData, {
          headers: {
            "x-access-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxNzAsInVzZXJfaWQiOjI2MTgsInJvbGUiOiJhZG1pbiIsIm9yZ19pZCI6bnVsbCwibGltaXQiOm51bGwsImlhdCI6MTcxNTI2MDExNSwiZXhwIjoxODA5ODY4MTE1fQ.OfTJc8mSl19yvHWDoVlajXMbizGd7ABXMBY0qwz8LKo",
          },
        })
        .catch(async (err) => {
          await axios.post(
            "https://app.delivers.co.il/api/shipments/import?create_with_error=true",
            orderData,
            {
              headers: {
                "x-access-token":
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxNzAsInVzZXJfaWQiOjI2MTgsInJvbGUiOiJhZG1pbiIsIm9yZ19pZCI6bnVsbCwibGltaXQiOm51bGwsImlhdCI6MTcxNTI2MDExNSwiZXhwIjoxODA5ODY4MTE1fQ.OfTJc8mSl19yvHWDoVlajXMbizGd7ABXMBY0qwz8LKo",
              },
            }
          );
        });
    }else{
      const message = `שלום *${order.shipping.first_name + " " + order.shipping.last_name}*
      הזמנה *${order.number}* ממשק קירשנר מוכנה לאיסוף. 
      
      נא הגיעו אל ״פירות קדרון" בוויז.
      ברגע שאתם מגיעים אנא פנו לקופאים.
      
      שעות הפתיחה
      ראשון-חמישי: 9:00-17:00
      שישי: 8:00-15:00`
      const phone = order.billing.phone.startsWith('0')?order.billing.phone.replace("0",'972',1):order.billing.phone
      const res = await axios.get(`https://api-messageflow.flow-il.com/webhook/add_message?UUID=6a708fea-a4d0-4976-a180-9f3bdd3de52e&ToMobileNumber=${phone}&wapMessage=${encodeURIComponent(message)}`)
    }
    // ?consumer_key=ck_c46ca7077572152d70f72053920ec5d19e552ad1&consumer_secret=cs_3abdc6f2aeaf8f098a7497875e25430e6abdef29
    const res = await axios.put(
      "https://meshek-kirshner.co.il/wp-json/wc/v3/orders/" +
        order.number +
        "?consumer_key=ck_c46ca7077572152d70f72053920ec5d19e552ad1&consumer_secret=cs_3abdc6f2aeaf8f098a7497875e25430e6abdef29",
      { status: value }
    );
    nav("../items");
    setUpdateOrders((prev) => !prev);
    setOrders();
  }
  };
  return (
    <div>
      {status.length > 0 && (
        <div className="statuswrap">
          <span className="titleststus">
            {language === "hebrew" ? "בסיום יש לבחור את שם המלקט" : "स्थिति"}:
          </span>
          <Select
            placeholder="processing"
            style={{ width: "150px" }}
            onChange={handleChange}
            options={status}
            disabled={selectedRowKeys.length != order.line_items.length}
          />
        </div>
      )}
      {order ? (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered={true}
          rowClassName={rowClassName}
          title={() => (
            <div>
              <div>
                <p>שם:{order.billing.first_name + " " + order.billing.last_name}</p>
                <p>פלאפון: {order.billing.phone}</p>
                <p>מספר: {numberOfOrder.id}</p>
              </div>
              <p>הערות: {order.customer_note}</p>
            </div>
          )}
        />
      ) : (
        <Loader />
      )}
    </div>
  );
}
