import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Select, Table } from "antd";
import Loader from "../Loader";
import axios from "axios";
import logo from "../../../public/logo.jpeg";
import { languageContext } from "../../App";
import "./style.css";
import { getWord } from "../Language";

export default function Item({ setOrders, orders, setUpdateOrders, setId, loading, setLoading }) {
  const numberOfOrder = useParams();

  const { language } = useContext(languageContext);

  const nav = useNavigate();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [cityName, setCityName] = useState();
  const [order, setOrder] = useState();
  const [status, setStatus] = useState([]);
  const [userText, setUserText] = useState("");
  const [numOfBoxes, setNumOfBoxes] = useState(0);

  const numOfBoxesWord = getWord('numOfBoxes');
  const choseMelaket = getWord('choseMelaket');
  const words = {
    name: getWord('name'),
    id: getWord('id'),
    address: getWord('address'),
    phone: getWord('phone'),
    notes: getWord('notes'),
  };

  const columns = [
    {
      title: getWord('image'),
      dataIndex: "image",
    },
    {
      title: getWord('name'),
      dataIndex: "name",
    },
    {
      title: getWord('quantity'),
      dataIndex: "quantity",
    },
  ];

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

  const getText = async (text) => {
    if (text) {
      if (language === "hebrew") setUserText(text);
      else {
        const note = await translateText(text);
        setUserText(note)
      }
    }
  };

  const getCityName = async (text) => {
    if (text) {
      if (language === "hebrew") setCityName(text);
      else {
        const city = await translateText(text);
        setCityName(city)
      }
    }
  };

  useEffect(() => {
    if (order) {
      getText(order.customer_note)
      getCityName(order.shipping.city)
    }
  }, [language]);

  useEffect(() => {
    if (orders) {
      // setLoading(true);
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
      return "t_yalow";
    }
  };

  useEffect(() => {
    if (order) {
      getText(order.customer_note);
      getCityName(order.shipping.city)
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
      } else {
        onSelectChange([]);
      }
    }
  }, [order]);

  // הגדרת האי-די של ההזמנה כדי שההדר יוכל להשתמש בו לבטל את הליקוט אם יש צורך
  useEffect(() => {
    if (numberOfOrder.id) setId(numberOfOrder.id);
  }, [numberOfOrder])

  // מתי שיש דטא והכל מוכן הלואדר מפסיק
  // useEffect(() => { if (data.length > 0) setLoading(false) }, [data]);

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
    if (confirm('אתה בטוח שסיימת?')) {
      if (order.shipping_total != "0.00") {
        const data = {
          hostId: numberOfOrder.id,
          orderDate: order.date_created,
          customerContact: {
            name: order.billing.first_name + " " + order.billing.last_name,
            phone: order.billing.phone,
            email: order.billing.email,
          },
          pickup: {
            address: {
              fullAddress: "הרימון 12 מושב קדרון",
            },
            contact: {
              name: "משק קרישנר",
              phone: "0586692614",
            },
            hardPriority: 0,
            Priority: 1,
          },
          firstStop: {
            scheduledAt: new Date().toISOString(),
            contact: {
              name: order.billing.first_name + " " + order.billing.last_name,
              phone: order.billing.phone,
              email: order.billing.email,
            },
            notes: order.customer_note,
            address: {
              city: order.shipping.city,
              streetName: order.shipping.address_1,
              apartmentNumber: order.meta_data.find(data => data.key == "_billing__dira")?.value,
              floor: order.meta_data.find(data => data.key == "_billing__koma")?.value,
            },
            packages: [
              {
                barcode: numberOfOrder.id + Date.now(),
                name: "ארגזים",
                quantity: numOfBoxes,
              },
            ],
          },
          isDouble: false,
          openDailyProject: true,
        }
        const result = await axios.post(
          "https://api2.pickpackage.com/api/external/tasks/createTask?appKey=4E8RZ0QY1TEVT78F9TQVWEH2DN4ZH4XMN06GQPES6Z4Q4Y9GB45Z",
          data
        );
      }
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
      {loading ? (
        <Loader />
      ) : (
        <>
          {status.length > 0 && (
            <div className="statuswrap">
              <span className="titleststus">
                {choseMelaket}:
              </span>
              <Select
                placeholder="processing"
                style={{ width: "150px" }}
                onChange={handleChange}
                options={status}
                disabled={
                  (selectedRowKeys.length != order.line_items.length ||
                    numOfBoxes == 0)
                }
              />
            </div>
          )}
          {<div className="statuswrap">
            <span className="titleststus">{numOfBoxesWord}</span>
            <input
              type="number"
              onChange={(e) => setNumOfBoxes(e.target.value)}
            />
          </div>}
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
                    <p>
                      {words.name}:{order.billing.first_name + " " + order.billing.last_name}
                    </p>
                    <p> {words.phone}: {order.billing.phone}</p>
                    <p> {words.id}: {numberOfOrder.id}</p>
                    <p> {words.address}: {cityName}</p>
                  </div>
                  <div>
                    {words.notes}:<p className="text_red"> {userText}</p>
                  </div>
                </div>
              )}
            />
          ) : (
            <Loader />
          )}
        </>
      )}
    </div>
  );
}
