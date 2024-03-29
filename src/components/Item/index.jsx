import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Select, Table } from "antd";
import Loader from "../Loader";
import axios from "axios";
import logo from "../../../public/logo.jpeg"
import { languageContext } from "../../App";
import './style.css'

export default function Item({ setOrders,orders,setUpdateOrders }) {
  const numberOfOrder = useParams();
  const {language} = useContext(languageContext)
  const nav = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [order, setOrder] = useState();
  const [status, setStatus] = useState([]);
  const columns = [
      {
          title: language==='hebrew'?'תמונה':'छवि',
          dataIndex: "image",
      },
      {
        title: language==='hebrew'?'שם':'नाम',
        dataIndex: "name",
      },
      {
          title: language==='hebrew'?'כמות':'मात्रा',
      dataIndex: "quantity",
    },
  ];
  useEffect(() => {
    if (orders) {
      setOrder(orders.find((item) => item.number === numberOfOrder.id));
    }
  }, [orders]);
  useEffect(() => {
      const go = async () => {
        const res = await axios.get('https://meshek-kirshner.co.il/wp-json/wp/v2/statuses?consumer_key=ck_c46ca7077572152d70f72053920ec5d19e552ad1&consumer_secret=cs_3abdc6f2aeaf8f098a7497875e25430e6abdef29')
        setStatus(Object.keys(res.data).filter(stat=>!stat.includes('acf-disabled')).map(stat=>{
            if(!stat.includes('wc-')){
                return {
                    value:stat,
                    label:stat
                }
            }
            return{
                value:stat.slice(3),
                label:stat.slice(3)
            }

        }));
      };
      go();
  }, []);

  useEffect(() => {
    if (order) {
      setData(
        order.line_items.map((item, index) => {
          return {
            key: index,
            name: language==='hebrew'?item.name:item._inhdia,
            image:<img style={{width:'60px',height:"60px"}} src={item.image.src||logo} alt={item.id}/>,
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
  const onSelectChange = async(newSelectedRowKeys) => {
    sessionStorage.setItem(
      numberOfOrder.id,
      JSON.stringify(newSelectedRowKeys)
    );
    setSelectedRowKeys(newSelectedRowKeys);
    if(!order.isactive){
      await axios.put("https://meshek-kirshner.co.il/wp-json/wc/v3/orders/"+order.number+"?consumer_key=ck_c46ca7077572152d70f72053920ec5d19e552ad1&consumer_secret=cs_3abdc6f2aeaf8f098a7497875e25430e6abdef29",{isactive:TRUE})
    }
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
  const handleChange=async(value)=>{
    //?consumer_key=ck_c46ca7077572152d70f72053920ec5d19e552ad1&consumer_secret=cs_3abdc6f2aeaf8f098a7497875e25430e6abdef29
    const res=await axios.put("https://meshek-kirshner.co.il/wp-json/wc/v3/orders/"+order.number+"?consumer_key=ck_c46ca7077572152d70f72053920ec5d19e552ad1&consumer_secret=cs_3abdc6f2aeaf8f098a7497875e25430e6abdef29",{status:value})
    nav('../')
    setUpdateOrders(prev=>!prev)
    setOrders()
    
  }
  return (
    <div>

     {status.length>0&& <div className="statuswrap">
        <span>{language==='hebrew'?'סטטוס':'स्थिति'}:</span>
          <Select placeholder='processing' style={{width:'150px'}}onChange={handleChange} options={status} />
        </div>}
      {order ? (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered={true}
          title={() =>
            `${
              order.shipping.first_name + " " + order.shipping.last_name
            }, ${numberOfOrder.id}`
          }
        />
      ) : (
        <Loader />
      )}
    </div>
  );
}
