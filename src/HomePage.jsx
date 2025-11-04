import screenshot from './assets/videopresentacio.mov';
import caritaVino from './assets/vinitopainted.png';
import plantilles from './assets/plantilles.png';
import aLaGorra from './assets/aLaGorra.png';

import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { backgroundColor, logoColor, logoColorLight, orangeColorLight } from './constants';

import { TypeAnimation } from 'react-type-animation';

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
          <div style={{ position: 'absolute', width: '100%',marginTop:'10vh', left: '5%', zIndex: 1, maxWidth: '65vw' }}>
            <div style={{ color: logoColor, fontSize: '70px', fontWeight: 400 }}>
              Publicitá, administrá y vendé tus entradas.<br />
              ¡Todo en la misma plataforma!
            </div>
            <div style={{ height: '10vh' }} />

            <TypeAnimation
              sequence={[
                'GOLOCAL, GOEASY',
                2000,
                '',
                2000,
                '',

              ]}
              speed={5}
              deletionSpeed={10}
              repeat={Infinity}
              style={{ color: logoColor, fontSize: '90px', fontWeight: 800 }}
            />

          </div>

          <div style={{  height: '70vh',position: 'absolute', top: '7.5%', right: '10%', zIndex: 1, color: 'white', border: '4px solid black', borderRadius: '22px' }}>
            <video
              style={{ height: '100%', width: 'auto', borderRadius: '20px' }}
              src={screenshot}
              autoPlay
              loop
              muted
            />
          </div>
        </div>
      </div>

      {/* CREÁ EVENTOS GRATUITO, DE PAGO Y COBRÁ A TRAVÉS DE GOLOCAL */}
      <div
        style={{
          width: '100%',
          height: 'auto',
          backgroundColor: logoColorLight,
          color: 'white',
          padding: '5%',


        }}
      >
        <span style={{
          fontWeigth: 800, fontSize: '50px', textAlign: 'start'
        }}>        Creá eventos gratuitos, de pago y cobrá a través de GOLOCAL
        </span>
      </div>

      {/* CREÁ Y PERSONALIZÁ TUS ENTRADAS, SIGUE TUS VENTAS Y VE EL CRECIMIENTO DE TUS EVENTOS */}
      <div
        style={{
          width: '100%',
          height: 'auto',
          backgroundColor: orangeColorLight,
          color: 'white',
          padding: '2% 10%',
          display: 'flex',
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center'



        }}
      >
        <img src={plantilles} style={{width:'50vw'}}/>

        <div className = 'px-5' style={{fontSize:'40px', color:'white', fontWeight:400}}>
          Creá plantillas de tus planes habituales, facilita y optimiza tu proceso de publicación!

        </div>
      </div>
        {/*

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
        <div style={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <img onMouseEnter={() => setShowTextUno(true)}
              src={caritaVino} style={{ height: '60vh' }}></img>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '20px' }}>
              <img onMouseEnter={() => setShowTextDos(true)}
                src={solocarita} style={{ height: '20vh' }}></img>
              <img onMouseEnter={() => setShowTextTres(true)}
                src={caritaDeportista} style={{ height: '25vh' }}></img>
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>



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



      </div>*/}  
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
        <img src={aLaGorra} style={{width:'20vw'}} />
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
          fontSize: '30px',
          fontWeight:300
        }}
      >
        TENÉS UNA  <span style={{ fontWeight: 800 }}>IDEA </span> PARA UN EVENTO? QUIERES ORGANIZAR UN PLAN Y ENCONTRAR GENTE QUE LE INTERESE?
        <br />
        <span style={{ fontSize: '35px', fontWeight: 400, marginLeft: '10px' }}>ESTO ES GOLOCAL! </span> <br />
        APOYAMOS A LA <span style={{ fontWeight: 800 }}> INNOVACIÓN</span>, A LA  <span style={{ fontWeight: 800 }}> CREATIVIDAD </span>, A LA GENTE QUE TIENE IDEAS Y QUIERE LLEGAR A QUIÉNES BUSCAN DESCUBRIRLOS!
        <br />
        <button onClick={() => navigate("/create_profile")} style={{ marginTop: '20px', padding: '10px 25px', fontSize: '40px', backgroundColor: 'white', color: logoColor, border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 400 }}>
          SÉ UN GOLOCALER!

        </button>
      </div>
        <div
        style={{
          width: '100%',
          height: 'auto',
          backgroundColor: logoColor,
          color: 'white',
          padding: '80px 10%',
          textAlign: 'center',
          fontSize: '30px',
          fontWeight:300
        }}
      >
        FOOTER DATA
      </div>


    </div>
  );
}


{/* EL QUE ESTAVA PROVANT D'UTILITZAR PER LES PARTICLES {engineLoaded && showIntro && (
    
import { useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";


  const [showIntro, setShowIntro] = useState(true);
  const [engineLoaded, setEngineLoaded] = useState(false);

    // Inicializa el motor de partículas una sola vez
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setEngineLoaded(true));
  }, []);

  // Controla cuándo ocultar la intro y mostrar el contenido
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 4000);
    return () => clearTimeout(timer);
  }, []);



  <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "#000",
            zIndex: 9999,
            opacity: showIntro ? 1 : 0,
            transition: "opacity 1s ease-out",
          }}
        >
          <Particles
            id="tsparticles"
            style={{ zIndex: 999999 }}
            options={{
              fullScreen: { enable: true },
              detectRetina: true,
              particles: {
                number: { value: 10 },
                move: {
                  enable: true,
                  speed: { min: 4, max: 10 },
                  direction: "none",
                  outModes: "destroy",
                },
                shape: {
                  type: "image",
                  image: [
                    {
                      src: "/vite.svg",
                      width: '200px',
                      height: 'auto',
                    }
                  ]
                },

                opacity: { value: 1 },
                size: { value: { min: 16, max: 32 } },
              },
              emitters: {
                autoPlay: true,
                life: { duration: 2, count: 1 },
                rate: { quantity: 80, delay: 0.1 },
                position: { x: 50, y: 50 },
              },
            }}
          />
        </div>
      )}
        
      */}