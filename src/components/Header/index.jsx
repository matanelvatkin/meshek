import React, { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { languageContext } from '../../App'
import './style.css'

export default function Header() {
    const {language} = useContext(languageContext)
    const location = useLocation()
    const nav = useNavigate()
    const onClick = (e) =>{
        nav(e.target.value)
    }
  return (
    <div className='header'>
        <button className='deButton' onClick={onClick} value={'../../'}>{language==='hebrew'?'שפה':'भाषा'}</button>
        {location.pathname!==('/items')&&<button className='deButton' onClick={onClick} value={'../items'}>{language==='hebrew'?'הזמנות':'आदेश'}</button>}
    </div>
  )
}
