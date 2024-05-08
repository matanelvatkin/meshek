import React, { useContext} from 'react'
import { languageContext } from '../../App'
import './style.css'

export default function Language({setOpenMenu}) {
    const {setLanguage} =useContext(languageContext)
    const onClick = (e) =>{
        setLanguage(e.target.value)
        setOpenMenu(prev=>!prev)
    }
    
  return (<div className='lan'>
        <button className='deButton' onClick={onClick} value='hebrew'>עברית</button>
        <button className='deButton' onClick={onClick}  value='india'>हिंदी</button>
    </div>
  )
}
