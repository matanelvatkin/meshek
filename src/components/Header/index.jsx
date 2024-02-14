import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { languageContext } from '../../App'
import './style.css'

export default function Header() {
    const {language} = useContext(languageContext)
    const nav = useNavigate()
    const onClick = (e) =>{
        nav(e.target.value)
    }
  return (
    <div className='header'>
        <button className='deButton' onClick={onClick} value={'../../'}>{language==='hebrew'?'שפה':'भाषा'}</button>
        <button className='deButton' onClick={onClick} value={'../items'}>{language==='hebrew'?'מוצרים':'उत्पादों'}</button>
    </div>
  )
}
