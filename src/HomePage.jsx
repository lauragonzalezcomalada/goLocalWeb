import screenshot from './assets/videopresentacio.mov';
import caritaVino from './assets/vinitopainted.png';
import solocarita from './assets/cine_chatgpt.png';
import caritaDeportista from './assets/deportista_chatgpt.png';

import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";


import { backgroundColor, logoColor } from './constants';

export default function HomePage() {

  const [showTextUno, setShowTextUno] = useState(false);
  const [showTextDos, setShowTextDos] = useState(false);
  const [showTextTres, setShowTextTres] = useState(false);

    const navigate = useNavigate();

  return (
    <div
      style={{
        width: '100%',                
        minHeight: '100vh',
        color: 'white',
        boxSizing: 'border-box',
        backgroundColor: backgroundColor,
        display: 'flex',
        flexDirection: 'column',     
        alignItems: 'stretch',
        position: 'relative',
        overflowX: 'hidden',        
      }}
    >
      <div style={{ height: 'calc(100vh - 18vh)', width: '100%', position: 'relative' }}>
        <div style={{ height: '100%', width: '100%' }}>
          <div style={{ position: 'absolute', width: '100%', top: '25%', left: '5%', zIndex: 1, maxWidth: '65vw' }}>
            <div style={{ color: logoColor, fontSize: '70px', fontWeight: 800 }}>
              La nueva manera para encontrar eso que no sabías que querías!
            </div>
            <div style={{ height: '10vh' }} />
            <div style={{ color: logoColor, fontSize: '90px', fontWeight: 900 }}>
              GOLOCAL, GOEASY
            </div>
          </div>

          <div style={{ position: 'absolute', top: '5%', right: '10%', zIndex: 1, color: 'white' }}>
            <video
              style={{ height: '75vh', width: 'auto' }}
              src={screenshot}
              autoPlay
              loop
              muted
            />
          </div>
        </div>
      </div>

      {/* Sección que debe quedar DEBAJO */}
      <div
        style={{
          width: '100%',
          height: 'auto',
          backgroundColor: logoColor,
          color: 'white',
          padding: '80px 10%',
          textAlign: 'center',
          fontSize: '25px',
        }}
      >
        PUBLICITA TUS PLANES DESDE LA APLICACIÓN,
        GESTIONA LAS RESERVAS DE TUS EVENTOS GRATUITOS, VENDE TUS ENTRADAS Y MUCHO MÁS!
      </div>
      <div
        style={{
          width: '100%',
          height: 'auto',
          backgroundColor: '#FEEDEB',
          color: logoColor,
          padding: '80px 10%',
          textAlign: 'center',
          fontSize: '30px',
          alignItems: 'start'
        }}
      >
        <div style={{ display: 'flex',width:'100%',flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{display:'flex', flexDirection:'row'}}>
            <img onMouseEnter={() =>  setShowTextUno(true)}
         src={caritaVino} style={{ height: '60vh' }}></img>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', marginLeft:'20px'}}>
           <img onMouseEnter={() => setShowTextDos(true)}
         src={solocarita} style={{ height: '20vh' }}></img>
          <img onMouseEnter={() => setShowTextTres(true)}
         src={caritaDeportista} style={{ height: '25vh' }}></img>
          </div>
      
          </div>
         
          <div style={{display:'flex', flexDirection:'column'}}>


         
            {showTextUno && (
          <div
            style={{
              marginRight: '10px',
              color: '#333',
              fontWeight: 500,
              transition: 'opacity 0.3s ease',
            }}
          >
           Para tí, amante del vino!
          </div>
        )}
        {showTextDos && (
          <div
            style={{
              marginRight: '10px',
              color: '#333',
              fontWeight: 500,
              transition: 'opacity 0.3s ease',
            }}
          >
            Para tí, que te gusta descubrir cosas nuevas!
          </div>
        )}
        {showTextTres && (
          <div
            style={{
              marginRight: '10px',
              color: '#333',
              fontWeight: 500,
              transition: 'opacity 0.3s ease',
            }}
          >
            Para tí, amante de los planes a última hora!
          </div>
        )} </div>

        </div>

       
      
      </div>
      <div
        style={{
          width: '100%',
          height: 'auto',
          backgroundColor: '#FEEDEB',

          color: logoColor,
          padding: '80px 10%',
          textAlign: 'center',
          fontSize: '30px',
          alignItems: 'start'
        }}
      >
        <span style={{ fontWeight: 600 }}>GOLOCAL</span>  no es una ticketera!<br />
        <span style={{ fontWeight: 600 }}>GOLOCAL</span>  es el lugar donde acudir cuando no sabes qué hacer y quieres descubrir que está pasando en ese momento en tu ciudad! <br />
        <span style={{ fontWeight: 600 }}>GOLOCAL</span>  es donde experimentar con eventos nuevos y diferentes, es donde encontrar planes de última hora, es donde ver qué está pasando cerca tuyo! <br />
        <span style={{ fontWeight: 600 }}>GOLOCAL</span>  es una comunidad a la que quieres pertenecer!
      </div>
      <div
        style={{
          width: '100%',
          height: 'auto',
          backgroundColor: '#fb8474',
          color: 'white',
          padding: '80px 10%',
          textAlign: 'center',
          fontSize: '25px',
        }}
      >
        TIENES UNA  <span style={{ fontWeight: 800 }}>IDEA </span> PARA UN EVENTO? QUIERES ORGANIZAR UN PLAN Y ENCONTRAR GENTE QUE LE INTERESE?
        <br/>
        <span style={{ fontSize: '35px', fontWeight: 400, marginLeft: '10px' }}>ESTO ES GOLOCAL! </span> <br />
        APOYAMOS A LA <span style={{ fontWeight: 800 }}> INNOVACIÓN</span>, A LA  <span style={{ fontWeight: 800 }}> CREATIVIDAD </span>, A LA GENTE QUE TIENE IDEAS Y QUIERE LLEGAR A QUIÉNES BUSCAN DESCUBRIRLOS!
        <br/>
        <button onClick={() => navigate("/create_profile")}  style={{ marginTop: '20px', padding: '10px 25px', fontSize: '40px', backgroundColor: 'white', color: logoColor, border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 400 }}>
        SÉ UN GOLOCALER!
      
      </button>
      </div>
      

    </div>
  );
}
