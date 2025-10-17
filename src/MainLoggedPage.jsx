// HomePage.jsx

import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, backgroundColor } from './constants.js'
import { useState, useEffect } from 'react'
import WeekCalendar from './WeekCalendar'
import { Container, Card, Button } from 'react-bootstrap';
import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { obtenerLunes } from './helpers.js'


export default function MainLoggedPage() {

    const [userProfile, setUserProfile] = useState(null)
    const { accessToken, refreshTokenIfNeeded, setAccessToken } = useContext(AuthContext)
    const [eventos, setEventos] = useState(null)
    const [lunesVisible, setLunesVisible] = useState(obtenerLunes(new Date()))


    useEffect(() => {
        if (!accessToken) return
        async function fetchUserProfile() {
            try {
                var response = await fetch(API_BASE_URL + '/user/profile/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })

                var data = await response.json()

                if (response.status === 401) {
                    console.log('response status = 401')
                    // intentamos refrescar
                    const newAccessToken = await refreshTokenIfNeeded()
                    if (!newAccessToken) return // no se pudo refrescar

                    // reintentamos con token nuevo
                    response = await fetch(`${API_BASE_URL}/user/profile/`, {
                        headers: {
                            Authorization: `Bearer ${newAccessToken}`
                        }
                    })
                    if (response.ok) {
                        data = await response.json()
                    }
                }

                setUserProfile(data)  // Guarda el perfil en el estado
            } catch (e) {
                console.error('Error fetching user profile', e)
            }
        }
        fetchUserProfile()
    }, [accessToken])



    useEffect(() => {
        if (!accessToken) return
        async function getWeeklyEvents() {
            try {                
                const fechaISO = lunesVisible.toISOString().split('T')[0] // "YYYY-MM-DD"
                var response = await fetch(API_BASE_URL + '/events_for_the_week/?date=' + fechaISO, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                })
                var data = await response.json()
                if (response.status === 401) {
                    console.log('response status = 401')
                    // intentamos refrescar
                    const newAccessToken = await refreshTokenIfNeeded()
                    if (!newAccessToken) return // no se pudo refrescar

                    // reintentamos con token nuevo
                    response = await fetch(API_BASE_URL + '/events_for_the_week/?date=' + fechaISO, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        }
                    })
                    if (response.ok) {
                        data = await response.json()
                    }
                }
                setEventos(procesarEventosPorFecha(data['activities'], data['promos'], data['private_plans']))
                console.log('se ejecuta el fetch events weekly');
            } catch (e) {
                console.error('Error fetching activities for the week', e)
            }
        }
        getWeeklyEvents()

    }, [accessToken, lunesVisible])

    const cambiarSemana = (dias) => {
        const nuevaFecha = new Date(lunesVisible)
        nuevaFecha.setDate(nuevaFecha.getDate() + dias)
        setLunesVisible(obtenerLunes(nuevaFecha))
    }


    if (!userProfile || !eventos) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                width: '100vw',
                overflowY: 'auto',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:backgroundColor,
                position: 'relative'

            }}
        >
            <Container className="d-flex flex-column mb-4">

                <div className="d-flex justify-content-end mb-4" style={{ margin: '10vh', width: '100%' }}>

                    <i
                        className="bi bi-caret-left"
                        onClick={() => cambiarSemana(-7)}
                        style={{ color: '#491a13ff', fontSize: '2rem', cursor: 'pointer' }}
                        title="Semana anterior"
                    />
                    <i
                        className="bi bi-caret-right"
                        onClick={() => cambiarSemana(7)}
                        style={{ color: '#491a13ff', fontSize: '2rem', cursor: 'pointer', marginLeft: '2rem' }}
                        title="Semana siguiente"
                    />
                </div>


                <Container fluid className="d-flex justify-content-center" style={{ marginTop: '15vh', margin: '0 auto' }}>
                    <WeekCalendar
                        esteLunes={lunesVisible}
                        eventos={eventos}
                    > </WeekCalendar>
                </Container>
            </Container>

        </div>
    )
}


function procesarEventosPorFecha(activities, promos, privatePlans) {
    const agrupadosPorFecha = {}

    // Función auxiliar para formatear fecha
    const formatearFecha = (isoString) => {
        const date = new Date(isoString)
        const dia = String(date.getDate()).padStart(2, '0')
        const mes = String(date.getMonth() + 1).padStart(2, '0')
        return `${dia}/${mes}`
    }

    // Helper para agregar al mapa
    const agregar = (evento, tipo) => {
        const fecha = formatearFecha(evento.startDateandtime)
        const item = { tipo, ...evento }
        if (!agrupadosPorFecha[fecha]) {
            agrupadosPorFecha[fecha] = []
        }
        agrupadosPorFecha[fecha].push(item)
    }

    activities?.forEach(e => agregar(e, 0))       // tipo 0: actividad
    promos?.forEach(e => agregar(e, 1))           // tipo 1: promo
    privatePlans?.forEach(e => agregar(e, 2))     // tipo 2: plan privado

    return agrupadosPorFecha
}
