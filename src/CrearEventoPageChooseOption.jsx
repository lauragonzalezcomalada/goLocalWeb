import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, backgroundColor, orangeColor, logoColor, orangeColorLight } from './constants.js'
import { useState, useEffect } from 'react'
import WeekCalendar from './WeekCalendar.jsx'
import { Container, Card } from 'react-bootstrap';
import { useContext } from 'react'
import { AuthContext } from './AuthContext.jsx'
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';


export default function CrearEventoPageChooseOption() {


    const navigate = useNavigate()

    const [templates, setTemplates] = useState([])
    const { accessToken, refreshTokenIfNeeded } = useContext(AuthContext)

    useEffect(() => {
        async function fetchTemplates() {
            try {
                var response = await fetch(API_BASE_URL + '/templates/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                })
                var data = await response.json()

                if (response.status === 401) {
                    console.log('response status = 401')
                    // intentamos refrescar
                    const newAccessToken = await refreshTokenIfNeeded()
                    if (!newAccessToken) return // no se pudo refrescar

                    // reintentamos con token nuevo
                    response = await fetch(`${API_BASE_URL}/templates/`, {
                        headers: {
                            Authorization: `Bearer ${newAccessToken}`
                        }
                    })
                    if (response.ok) {
                        data = await response.json()
                    }

                }
                setTemplates(data);
            } catch (e) {
                console.error('Error fetching user profile', e)
            }
        }
        fetchTemplates()

    }, [accessToken])

    return <div style={{ marginTop: '56px', width: '100%', height: '100%', backgroundColor: backgroundColor }}>
        <div
            style={{
                height: 'calc(100vh - 56px - 170px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
          
                width: '100%',
            }}
        >
            <div>
                <div style={{ display: 'flex', width: '100vw', height: '500px' }}>
                    <div
                        style={{
                            width: '50%',
                            borderRight: '5px dotted '+logoColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}

                        onClick={() => navigate('/crearEventoFromScratch')}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="bi bi-plus-lg" style={{ fontSize: '5rem',color: logoColor }}></i>

                            <h1 style={{ fontWeight: 800, color: logoColor }}>CREAR UN EVENTO DESDE ZERO</h1>
                        </div>
                    </div>
                    <div
                        style={{
                            width: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection:'column'

                        }}
                       
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="bi bi-collection" style={{ fontSize: '5rem', color: logoColor }}></i>
                            <h1 style={{ fontWeight: 800, color:logoColor }}>USÁ UNA PLANTILLA</h1>
                        </div>

                        {templates.map((template) =>(
                            
                            <div
                                style={{
                                    height:'4rem',
                                    width:'80%',
                                    borderRadius:'20px',
                                                              border: '4px solid '+logoColor,
                                                              display:'flex',
                                                              alignItems:'center',
                                                              justifyContent:'center',
                                                              marginTop:'1rem',
                                                              backgroundColor:orangeColorLight

                                }}

                                 onClick={() => navigate('/crearEventoFromScratch', { state: { uuid: template.uuid } })}

                            >

                                <span  style={{fontWeight:400, fontSize:'25px', color: logoColor}}>  {template.name.toUpperCase()} </span>
                              
                            </div>
                        ))


                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
}
