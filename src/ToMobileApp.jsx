import screenshot from './assets/videopresentacio.mov';
import caritaVino from './assets/vinitopainted.png';
import solocarita from './assets/cine_chatgpt.png';
import caritaDeportista from './assets/deportista_chatgpt.png';

import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import icon from './assets/icon.png'

import { logoColor } from './constants';

export default function HomePage() {

  const [showTextUno, setShowTextUno] = useState(false);
  const [showTextDos, setShowTextDos] = useState(false);
  const [showTextTres, setShowTextTres] = useState(false);

    const navigate = useNavigate();

  return (
<div
      style={{
        width: '100%',                
        minHeight: 'calc(100vh - 18vh)',
        overflow:'hidden',
        color: 'white',
        boxSizing: 'border-box',
        backgroundColor: '#FEEDEB',
        display: 'flex',
        flexDirection: 'column',     
        alignItems: 'stretch',
        position: 'relative',
        overflowX: 'hidden',    
        color:logoColor    
      }}
    > 
      <div>
        Ya puedes disfrutar de 
      </div>
      <div  >
            <img src={icon}  style={{height:'200px'}}/>

      </div>
    
    
    </div>

     
  );
}
