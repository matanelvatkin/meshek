import React, { useEffect, useState } from 'react'
import Item from '../Item';
import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Items({orders}) {
    const [data,setData] = useState([]) 
    const nav = useNavigate()
    const columns = [
        {
          title: 'תאריך',
          dataIndex: 'date',
        },
        {
            title: 'מספר הזמנה',
            dataIndex: 'number',
        },
        {
            title: 'שם הלקוח',
            dataIndex: 'name',
        },
        // {
        //   title: 'סכום',
        //   dataIndex: 'totalPrice',
        // },
        {
          title: 'סטטוס',
          dataIndex: 'status',
        },
      ];
    useEffect(()=>{
        if(orders&&orders.length>0){
            setData(orders.map(item=>{
                return {
                    key:item.id,
                    date:item.date_created.replace('T',`\n`),
                    number:item.number,
                    name:item.shipping.first_name +' '+ item.shipping.last_name,
                    // totalPrice:item.total,
                    status:item.status
                }
            }))
        }
    },[orders])
  return (
    <div>
        <Table onRow={(record, rowIndex) => {
    return {
      onClick: (event) => {
        nav('items/'+data[rowIndex].number)}
    };
  }} dataSource={data} columns={columns} />
    </div>
  )
}
