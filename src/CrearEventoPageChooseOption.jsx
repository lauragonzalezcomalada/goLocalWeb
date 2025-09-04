import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from './constants.js'
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

                console.log(data)
                setTemplates(data)



            } catch (e) {
                console.error('Error fetching user profile', e)
            }
        }
        fetchTemplates()

    }, [accessToken])

    return <div style={{ marginTop: '56px', width: '100%', height: '100%', backgroundColor: 'rgba(255,255,0,1)' }}>
        <div
            style={{
                height: 'calc(100vh - 56px - 170px)', // 100vh menos margen arriba menos navbar total
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f4f4f4',
                width: '100%',
            }}
        >
            <div>
                <div style={{ display: 'flex', width: '100vw', height: '500px' }}>
                    <div
                        style={{
                            width: '50%',
                            borderRight: '3px dotted #000000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}

                        onClick={() => navigate('/crearEventoFromScratch')}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="bi bi-plus-lg" style={{ fontSize: '5rem', lineHeight: '1' }}></i>

                            <h1 style={{ fontWeight: 'lighter', lineHeight: '1' }}>Crear evento desde zero</h1>
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
                            <i className="bi bi-collection" style={{ fontSize: '5rem', lineHeight: '1' }}></i>
                            <h1 style={{ fontWeight: 'lighter', lineHeight: '1' }}>Usa una plantilla</h1>
                        </div>

                        {templates.map((template) =>(
                            
                            <div
                                style={{
                                    height:'4rem',
                                    width:'80%',
                                    borderRadius:'10px',
                                                              border: '3px solid #000000',
                                                              display:'flex',
                                                              alignItems:'center',
                                                              justifyContent:'center',
                                                              marginTop:'1rem',
                                                              backgroundColor:'#FA7239'

                                }}

                                 onClick={() => navigate('/crearEventoFromScratch', { state: { uuid: template.uuid } })}

                            >

                                <span className='fw-lighter fs-4'>  {template.name} </span>
                              
                            </div>
                        ))


                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
}
