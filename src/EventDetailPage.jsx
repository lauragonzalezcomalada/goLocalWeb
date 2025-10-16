
import { IDLE_BLOCKER, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { API_BASE_URL, backgroundColor, REFRESH_TOKEN_STORAGE_KEY, TOKEN_STORAGE_KEY } from './constants.js'
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap'
import { formatDate } from './helpers.js'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import DateCard from './DateCard.jsx'
import { useNavigate } from 'react-router-dom';
import soloCarita from './assets/nopicture.png';


export default function EventDetailPage() {

    const location = useLocation()
    const navigate = useNavigate()
    const { uuid, tipo } = location.state || {}
    const [event, setEvent] = useState(null)
    const { accessToken, refreshTokenIfNeeded } = useContext(AuthContext)
    const [ableToTurnVisible, setAbleToTurnVisible] = useState(null)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showNotEnoughFreeModal, setShowNotEnoughFreeModal] = useState(false);
    const [showNotEnoughPagosModal, setShowNotEnoughPagosModal] = useState(false);


    async function handleOpen() {

        //Hi ha d'haver 3 modals: Event gratis --> no hi ha més plans gratis: --> comprar bono
        // Event pago --> ja has omplert el teu rango de plans de pago mensuals --> ampliar rango
        // Tot okay --> confirmació
        let able = await fetchAvailabilityToTurnVisible();
        if (able === true) {
            console.log('able to turn visible');
            setShowConfirmationModal(true);
            return;
        } else if (event.gratis == true) { //not enough free plans
            setShowNotEnoughFreeModal(true);
        } else { // No hi ha suficients plans de pagament
            setShowNotEnoughPagosModal(true);
        }



    };



    const handleRedirectToCompraBono = () => {
        setShowNotEnoughFreeModal(false);
        navigate("/comprarBono"); // redirigir a la página de compra de bonos
    };

    const handleRedirectToExtendRango
        = () => {
            setShowNotEnoughPagosModal(false);
            navigate("/extendRangoPlanesPagos"); // redirigir a la página de compra de bonos
        };


    if (!uuid) {
        return <p>No se encontró el UUID del evento.</p>
    }

    useEffect(() => {

        if (!uuid || typeof tipo !== 'number') return
        var url = API_BASE_URL
        async function fetchEvent() {

            if (tipo === 0) { // class Activity
                url += '/activities/?activity_uuid='
            }
            else if (tipo === 1) { // class Promo
                url += '/promos/?promo_uuid='
            }
            else if (tipo === 2) { // class Private Plan
                url += '/private_plans/?privatePlanUuid='
            }
            try {
                const response = await fetch(url + uuid, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                })
                var data = await response.json()
                if (response.status === 401) {
                    console.log('status 401')

                    await refreshTokenIfNeeded()
                    try {

                        const response = await fetch(url + uuid, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                            },
                        })

                        if (!response.ok) throw new Error('No autorizado o error2')
                        data = await response.json()
                    } catch (e) {
                        console.error('Volvió a fallar', e)
                    }


                }
                if (!response.ok) throw new Error('No autorizado o error')
                console.log('promo:  ', data);
                setEvent(data)
            } catch (e) {
                console.error('Error fetching user profile', e)
            }
        }
        fetchEvent()

    }, [uuid, tipo])

    //Ejecutar una vez se tenga evento
    async function fetchAvailabilityToTurnVisible() {

        try {
            console.log('gratis?: ',  tipo === 1 ? true: event.gratis )
            var response = await fetch(API_BASE_URL + '/able_turn_visible/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json',
                },
                body: JSON.stringify({ free_event: tipo === 1 ? true: event.gratis }),

            })
            var data = await response.json()
            if (response.status === 401) {
                console.log('status 401')

                await refreshTokenIfNeeded()
                try {

                    response = await fetch(API_BASE_URL + '/able_turn_visible/', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ free_event: event.gratis }),

                    })

                    if (!response.ok) throw new Error('No autorizado o error2')
                    data = await response.json()
                } catch (e) {
                    console.error('Volvió a fallar', e)
                }


            }
            if (!response.ok) throw new Error('No autorizado o error')
            console.log('response: ', data)
            setAbleToTurnVisible(data)
            return data;
        } catch (e) {
            console.error('Error: ', e)
        }
    }


    async function handleConfirm() {
        try {
            var response = await fetch(`${API_BASE_URL}/handle_visibility_change/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json',
                }, body: JSON.stringify({ uuid: event.uuid, tipo: tipo })
            });

            var data = await response.json()

            if (response.status === 401) {
                console.log('response status en fetch entradas = 401')
                // intentamos refrescar
                const newAccessToken = await refreshTokenIfNeeded()
                if (!newAccessToken) return // no se pudo refrescar

                // reintentamos con token nuevo
                response = await fetch(`${API_BASE_URL}/update_tickets_link/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`,
                        'Content-Type': 'application/json',

                    }, body: JSON.stringify({ uuid: evento_uuid, tipo: tipo })
                });

                if (response.ok) {
                    data = await response.json()
                }
            }
            setEvent(prevEvent => ({
                ...prevEvent,
                active: data,
            }))
        } catch (error) { console.error('Error en fetch:', error); }

        setShowConfirmationModal(false);
    };



    if (!event)
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )

    const { fecha, hora, dia, mes } = formatDate(event?.startDateandtime)
    console.log('event: ', event);
    return <div
        style={{
            minHeight: '100vh',
            width: '100vw',
            overflowY: 'auto',
            // color: 'red',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: backgroundColor,
            position: 'relative'

        }}
    >

        <Container fluid className="py-5 px-0" style={{ width: "90%" }}>
            <Row className="px-0 mx-0 align-items-center">

                <Col md={6} className="d-flex flex-column justify-content-start mx-0 px-0">
                    <h3 className="display-5 mb-3" style={{ fontWeight: 'lighter' }}>
                        Tu evento:
                    </h3>
                    <h1 className="display-1 text-end px-3" style={{ fontSize: '120px', lineHeight: '1', fontWeight: 'regular' }}>
                        {event['name']}
                    </h1>
                    <div className='d-flex align-items-space-between px-2 mt-5'>
                        <div className="d-flex align-items-center">
                            <i className="bi bi-calendar-date-fill me-2" style={{ fontSize: '1.5rem' }} />
                            <p className='mt-3 fw-light fs-4'>{fecha}</p>
                        </div>
                        <div className="d-flex align-items-center px-5">
                            <i className="bi bi-clock"></i>
                            <p className='mt-3 px-2 fw-light fs-4'>{hora}</p>
                        </div>
                    </div>

                    {event['tag_detail']?.length > 0 && (
                        <div className="gap-3 mt-1 px-3 flex-wrap" style={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center',
                            width: '100%',
                            gap: '1.5rem',
                            flexWrap: 'wrap'
                        }}>
                            {event['tag_detail'].map((tag, index) => (
                                <div
                                    key={index}
                                    className="px-3 py-1 d-flex"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                        border: '1.5px solid #FA7239',
                                        borderRadius: '15px',
                                        fontSize: '18px',
                                        color: '#FA7239', gap: '0.5rem',
                                    }}
                                >
                                    <div> {tag.icon}</div>
                                    <div className='fw-medium'> {tag.name}</div>

                                </div>
                            ))}
                        </div>
                    )}

                    <div className='mt-5 px-2 fst-italic fw-bold fs-5'>

                        {event['shortDesc']}
                    </div>
                    <div className="mt-3 px-3 fw-lighter fs-3" style={{ textAlign: 'justify', marginRight: '10px' }}>
                        {event['desc']}
                    </div>
                    {/* Resto de contenido */}
                </Col>
                <Col md={6} className="px-1 flex" >

                    <div className="d-flex justify-content-end mt-2 mb-4">

                        <div className="d-flex align-items-center justify-content-center p-3" style={{
                            height: '3rem', width: 'fit-content', borderRadius: '20px', border: `2px solid ${event['active'] ? 'rgba(54, 160, 9, 0.8)' : 'rgba(204, 12, 12, 0.8)'}`,
                            align: 'right'
                        }} onClick={() =>
                            handleOpen(event.active ? "desactivar" : "activar")
                        } >


                            {event['active'] === false && (
                                <div style={{ display: 'flex', flexDirection: 'row', color: 'rgba(204, 12, 12, 0.8)' }}>
                                    <i className="bi bi-x-lg fs-5"></i>
                                    <span className="fs-5 fw-light px-2"> evento  <span className='fw-bold'>no </span> visible</span>
                                </div>

                            )}
                            {event['active'] === true && (

                                <div style={{ display: 'flex', flexDirection: 'row', color: 'rgba(54, 160, 9, 0.8)' }}>
                                    <i className="bi bi-check2 fs-5"></i>
                                    <span className="fs-5 fw-light px-2"> evento  <span className='fw-bold'> visible </span> </span>
                                </div>



                            )}

                        </div>




                        <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirmación</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {event['active'] === false
                                    ? "¿Seguro que quieres hacer este evento visible en la aplicación?"
                                    : "¿Seguro que quieres hacer invisible este evento?"}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
                                    Cancelar
                                </Button>
                                <Button
                                    variant={event['active'] === false ? "success" : "danger"}
                                    onClick={handleConfirm}
                                >
                                    Sí, estoy seguro
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={showNotEnoughFreeModal} onHide={() => setShowNotEnoughFreeModal(false)} centered>
                            <Modal.Header closeButton>
                                <Modal.Title> 😔 Sin planes gratuitos</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Te quedaste sin más planes gratuitos para crear. <br />Compra un bono para continuar.
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowNotEnoughFreeModal(false)}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" onClick={handleRedirectToCompraBono}>
                                    Comprar bono
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={showNotEnoughPagosModal} onHide={() => setShowNotEnoughPagosModal(false)} centered>
                            <Modal.Header closeButton>
                                <Modal.Title> 😔 Sin planes pagos</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Te quedaste sin más planes pagos para crear con tu planificación. <br />Extiende tu rango de planes pagos para seguir.
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowNotEnoughPagosModal(false)}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" onClick={handleRedirectToExtendRango} >
                                    Comprar bono
                                </Button>
                            </Modal.Footer>
                        </Modal>



                    </div>
                    <div style={{ textAlign: 'right' }}>
                        {event['gratis'] === true && <div className='fw-lighter fs-3' style={{ lineHeight: '1' }}>Plan   <span style={{ fontWeight: 700 }}>gratis</span></div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        {event['reserva_necesaria'] === true && <div className='fw-lighter fs-3' style={{ lineHeight: '1' }}><span style={{ fontWeight: 700 }}>Con</span> reserva</div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        {event['reserva_necesaria'] === false && <div className='fw-lighter fs-3' style={{ lineHeight: '1' }}><span style={{ fontWeight: 700 }}>Sin</span> reserva</div>}
                    </div>
                    <img
                        src={event['image']}
                        className="w-100"
                        style={{ objectFit: 'cover', height: '500px' }}
                    />

                    {event['tickets_link'] && (
                        <div style={{ marginTop: '1rem', fontSize: '1.2rem', textAlign: 'center', wordWrap: 'break-word', overflowWrap: 'break-word', display: 'flex', flexDirection: 'column' }}>
                            <div className='fw-lighter fs-4'style={{ textAlign:'start' }}>
                                Link a las entradas:
                            </div>
                            <div className='fw-medium fs-3' style={{softwrap:'true'}}>
                                {event['tickets_link']}
                            </div>
                        </div>
                    )}
                </Col>
            </Row>


            {event['entradas_for_plan']?.length > 0 && (

                <div className="mt-5" style={{ gap: '1rem' }}>

                    {event['entradas_for_plan'].map((entrada, index) => (

                        <Card className="m-3 p-0" style={{ height: '300px', width: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
                            <Card.Body className='p-0' style={{ height: '300px' }}>


                                <div className='row g-0' style={{ height: '100%' }}>

                                    <div className="col-md-4 g-0" style={{
                                        backgroundColor: '#fa5239', height: '100%', borderTopLeftRadius: '1rem',
                                        borderBottomLeftRadius: '1rem', display: 'flex',
                                        flexDirection: 'column',
                                    }}>
                                        <div style={{ flex: '2', overflow: 'hidden' }}>
                                            <img src={event['image']!== null  ? event['image'] : soloCarita} style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover', // rellena y recorta si es necesario
                                                display: 'block'
                                            }}></img>


                                        </div>
                                        <div
                                            className="d-flex"
                                            style={{
                                                flex: 1,
                                                padding: '0.5rem',
                                                color: 'white',
                                                flexDirection: 'row',
                                                alignItems: 'center',        // centra verticalmente
                                                justifyContent: 'center',    // centra horizontalmente
                                                gap: '1rem',                 // espacio entre DateCard, icono y hora
                                            }}
                                        >
                                            <div className=' px-3'>   <DateCard
                                                dia={dia}
                                                mes={mes}
                                            /></div>
                                            <div style={{ marginLeft: '5px', display: 'flex', flexDirection: 'row' }}>

                                                <i className="bi bi-clock" style={{ fontSize: '50px' }}></i>
                                                <p className="px-2 mt-3" style={{ fontSize: '30px' }}>{hora}</p>

                                            </div>

                                        </div>
                                    </div>

                                    {/*aquí comença la part de descripció de l'entrada*/}
                                    <div className='col-md-8' style={{ backgroundColor: '#fca784', height: '100%' }}>
                                        <div className='d-flex p-5 mt-2' style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                            <div style={{ flex: 3 }}>
                                                <span style={{ fontSize: '40px', fontWeight: 'bold' }}>{entrada['titulo']}</span><br />
                                                <span style={{ fontSize: '30px', fontWeight: 'lighter' }}>{entrada['desc']}</span><br />
                                                <span style={{ fontSize: '40px', fontWeight: 'lighter', lineHeight: '3' }}>{'$' + entrada['precio']}</span>
                                            </div>
                                            <div className="px-0" style={{ flex: 2 }}>
                                                {entrada['disponibles'] === 0 && (
                                                    <div style={{ width: '12rem', position: 'absolute', top: '2rem', right: '2rem', border: '5px solid #fa3950', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fa3950', fontSize: '30px' }}> SOLD OUT</div>
                                                )}
                                                <span className="fw-lighter" style={{ fontSize: '25px' }}> Disponibles: <span className='fw-light'>{entrada['disponibles']}</span></span><br />
                                                <span className="fw-lighter" style={{ fontSize: '25px' }}> Cantidad de entradas total: <span className='fw-light'>{entrada['maxima_disponibilidad']}</span></span>

                                                <div className="progress mt-3 mb-3" role="progressbar" aria-label="Basic example" aria-valuemin="0" aria-valuemax="100">
                                                    <div
                                                        className="progress-bar"
                                                        style={{
                                                            width: `${((entrada['maxima_disponibilidad'] - entrada['disponibles']) / entrada['maxima_disponibilidad']) * 100}%`,
                                                            backgroundColor: '#fa5239'
                                                        }}
                                                    >{(((entrada['maxima_disponibilidad'] - entrada['disponibles']) / entrada['maxima_disponibilidad']) * 100).toFixed(2) + '%'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )
            }
            {event['reservas_forms']?.length > 0 && (
                <div className="mt-5" style={{ gap: '1rem' }}>
                    {event.reservas_forms?.map((reserva, index) => (
                        <Card className="m-3 p-0" style={{ minHeight: '200px', height: 'auto', width: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
                            <Card.Body className='p-0' style={{ minheight: '200px' }}>


                                <div className='row g-0' style={{ width: '100%', minHeight: '200px', }}>

                                    <div className="col-md-4 g-0 d-flex flex-column" style={{
                                        backgroundColor: 'rgba(155,255,90,0.5)',
                                        borderTopLeftRadius: '1rem',
                                        borderBottomLeftRadius: '1rem',
                                        overflow: 'hidden',
                                        flex: 1,
                                    }}>

                                        <div style={{
                                            flexGrow: 2, position: 'relative'
                                        }}>
                                            <img src={event['image']} style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover', // rellena y recorta si es necesario
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                            }}></img>


                                        </div>
                                        <div
                                            className="d-flex"
                                            style={{
                                                flexGrow: 1,
                                                padding: '0.5rem',
                                                color: 'white',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '1rem',
                                                position: 'relative',
                                            }}
                                        >
                                            <div className=' px-3'>   <DateCard
                                                dia={dia}
                                                mes={mes}
                                            /></div>
                                            <div style={{ marginLeft: '5px', display: 'flex', flexDirection: 'row' }}>

                                                <i className="bi bi-clock" style={{ fontSize: '50px' }}></i>
                                                <p className="px-2 mt-3" style={{ fontSize: '30px' }}>{hora}</p>

                                            </div>

                                        </div>
                                    </div>

                                    {/*aquí comença la part de descripció de l'entrada*/}
                                    <div className='col-md-8' style={{ backgroundColor: 'rgba(189, 125, 125, 1)', minHeight: '300px', height: 'auto' }}>
                                        <div className='d-flex p-5 mt-2' style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                            <div style={{ flex: 1 }}>
                                                <span style={{ fontSize: '40px', fontWeight: 'bold' }}>{reserva['nombre']}</span><br />
                                                <span className="fw-light" style={{ fontSize: '22px' }}> Disponibilidad de reservas: {reserva['max_disponibilidad']}</span>

                                            </div>
                                            <div className="d-flex flex-wrap gap-3 mt-2" style={{ flex: 2 }}>
                                                <p className="fw-light mt-2" style={{ fontSize: '22px' }}> Campos del formulario de reserva </p>

                                                {reserva['campos']?.map((c) => (
                                                    <div

                                                        className="p-2 border rounded"
                                                        style={{ minWidth: '160px', flex: '1 0 auto' }}
                                                    >

                                                        <span style={{ fontSize: '22px', fontWeight: 'lighter' }}>{c.label}</span>

                                                    </div>
                                                ))}






                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </Card.Body>
                        </Card>



                    ))}
                </div>

            )}
        </Container>




    </div>
}


/*<div className='mt-2 px-3'>   <DateCard
                                                dia={dia}
                                                mes={mes}
                                            /></div>*/


/* <div className="mt-3 px-5 d-flex justify-content-between" style={{
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            border: '1.5px solid #0d6efd',
                            borderRadius: '15px',

                            fontSize: '18px',
                            height: '120px',
                            color: '#0d6efd',
                            alignContent: 'center',
                            justifyItems: 'end'
                        }}>
                            <div className='flex' style={{ alignContent: 'center', }}>
                                <div className='fs-3 fw-bold' style={{ lineHeight: '1.2' }}>{entrada.titulo}</div>
                                <div className=' fs-4 fw-light' style={{ lineHeight: '1.2' }}>{entrada.desc}</div>
                            </div>
                            <div className='fs-3 fw-medium ' style={{ alignContent: 'center', }}>{entrada.precio}  ARS</div>
                            <div className='flex' style={{ alignContent: 'center', }}>
                                <div className='fs-5 fw-light'>Entradas vendidas: {entrada.maxima_disponibilidad - entrada.disponibles} </div>
                                <div className='fs-5 fw-light'>Máxima disponibilidad: {entrada.maxima_disponibilidad}</div>
                                <div className='fs-5 fw-light'>Dinero recaudado: </div>

                            </div>


                        </div>*/


/* <Container>

        <div className="card" style={{top:'10vh', width:'30vw', height:'60vh', position:'relative', right:'5vw'}}>


            <img
                        src={ event["image"]}
                     
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
        </div>
        <div className= "container d-flex flex-column" style={{backgroundColor: 'rgba(255, 0, 0, 1)', minHeight: '100px', width:'50vw',position: 'relative', left:'10vw' , top:'20vh'}}>

            <h3 className="display-6" style={{color: 'rgba(255, 149, 0, 1)'}}>Tu evento:</h3>
            <div style={{height:'20px'}}></div>
            <h2 className="display-4 text-end px-4" style={{color: 'rgba(255, 149, 0, 1)' }}>{event['name']}</h2>
            <div style={{height:'20px'}}></div>
            
            <div className="container d-flex">
                <i className="bi bi-calendar-date-fill"></i>
                <p>{fecha}</p>
            </div>

        </div>
      
    </Container>*/