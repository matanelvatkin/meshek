import React, { useContext } from 'react'
import { languageContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import './style.css'

export default function Language() {
    const {setLanguage} =useContext(languageContext)
    const nav= useNavigate()
    const onClick = (e) =>{
        setLanguage(e.target.value)
        nav('../items')
    }
  return (
    <div className='lan'>
        <button className='deButton' onClick={onClick} value='hebrew'>עברית</button>
        <button className='deButton' onClick={onClick}  value='india'>हिंदी</button>
    </div>
  )
}
