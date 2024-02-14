import React, { useContext, useEffect, useState } from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { languageContext } from "../../App";

export default function Items({ orders }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const {language} = useContext(languageContext)
  const nav = useNavigate();
  const columns = [
    {
      title: language==='hebrew'?'תאריך':'तारीख',
      dataIndex: "date",
    },
    {
      title: language==='hebrew'?'מספר הזמנה':'क्रम संख्या',
      dataIndex: "number",
    },
    {
      title: language==='hebrew'?'סטטוס':'स्थिति',
      dataIndex: "status",
    },
  ];
  useEffect(() => {
    if (orders && orders.length > 0) {
      setData(
        orders.map((item) => {
          return {
            key: item.id,
            date: new Date(item.date_modified.slice(0,item.date_modified.indexOf('T'))).toLocaleDateString(),
            number: item.number,
            status: item.status,
          };
        }).sort((a,b)=>a.number - b.number)
      );
      setLoading(false);
    }
  }, [orders]);
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <Table
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                if(sessionStorage.getItem(data[rowIndex].number)||!data[rowIndex].isActive){
                  nav("../items/" + data[rowIndex].number);
                }
              },
            };
          }}
          pagination={false}
          bordered={true}
          dataSource={data}
          columns={columns}
          
        />
      )}
    </div>
  );
}
