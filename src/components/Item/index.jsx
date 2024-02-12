import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table } from "antd";
const columns = [
  {
    title: "name",
    dataIndex: "name",
  },
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "quantity",
    dataIndex: "quantity",
  },
];

export default function Item({ orders }) {
  const numberOfOrder = useParams();
  const nav = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    if(orders){

        let order = orders.find((item) => item.number === numberOfOrder.id);
        setData(order.line_items.map((item,index)=>{
            return {
                key:index,
                name: item.name,
                id: item.product_id,
                quantity: item.quantity
            }
        }))
        if(JSON.parse(sessionStorage.getItem(numberOfOrder.id))){
            setSelectedRowKeys(JSON.parse(sessionStorage.getItem(numberOfOrder.id)))
        }
    }
  }, [orders]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    sessionStorage.setItem(numberOfOrder.id,JSON.stringify(newSelectedRowKeys))
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
  return (
    <>
      <button
        onClick={() => {
          nav("../items");
        }}
      >
        all orders
      </button>
      <h3>{numberOfOrder.id}</h3>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </>
  );
}
