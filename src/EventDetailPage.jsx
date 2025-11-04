
import { IDLE_BLOCKER, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { API_BASE_URL, backgroundColor, logoColor, orangeColor, orangeColorLight, REFRESH_TOKEN_STORAGE_KEY, TOKEN_STORAGE_KEY } from './constants.js'
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap'
import { formatDate } from './helpers.js'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import DateCard from './DateCard.jsx'
import { useNavigate } from 'react-router-dom';
import soloCarita from './assets/nopicture.png';
import aLaGorra from './assets/aLaGorra.png';
import MapaDesdeBackend from './MapaDesdeBackend'


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

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        shortDesc: '',
        desc: '',
    });



    async function handleOpen(action, e) {
        if (action == 'desactivar') {
            return;
        }
        let able = await fetchAvailabilityToTurnVisible();
        if (able === true) {
            console.log('able to turn visible');
            setShowConfirmationModal(true);
            return;
        } else if (event.gratis == true) {
            setShowNotEnoughFreeModal(true);
        } else {
            setShowNotEnoughPagosModal(true);
        }

    };



    const handleRedirectToCompraBono = () => {
        setShowNotEnoughFreeModal(false);
        navigate("/comprarBono");
    };

    const handleRedirectToExtendRango
        = () => {
            setShowNotEnoughPagosModal(false);
            navigate("/extendRangoPlanesPagos");
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
                var response = await fetch(url + uuid, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                })
                var data = await response.json()
                if (!response.ok) {
                    await refreshTokenIfNeeded();
                    try {

                        response = await fetch(url + uuid, {
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

                console.log('data: ', data)
                setEvent(data)
                setFormData({
                    name: data['name'],
                    shortDesc: data['shortDesc'],
                    desc: data['desc'],
                })

            } catch (e) {
                console.error('Error fetching user profile', e)
            }
        }
        fetchEvent()

    }, [uuid, tipo])


    const toggleEdit = () => {

        if (editMode == true) {
            handleSave();
            return;
        }
        setEditMode(!editMode);
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {

        try {
            var response = await fetch(API_BASE_URL + '/update_evento/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json',
                },
                body: JSON.stringify({ event_type: 0, uuid: event.uuid, name: formData['name'], shortDesc: formData['shortDesc'], desc: formData['desc'] }),

            })
            var data = await response.json()
            if (response.status === 401) {
                await refreshTokenIfNeeded()
                try {

                    response = await fetch(API_BASE_URL + '/update_evento/', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name: formData['name'], shortDesc: formData['shortDesc'], desc: formData['desc'] }),

                    })

                    if (!response.ok) throw new Error('No autorizado o error')
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


        // Aquí podrías enviar los cambios al backend si quieres
        console.log("Guardado:", formData);
        setEditMode(false);
    };


    //Ejecutar una vez se tenga evento
    async function fetchAvailabilityToTurnVisible() {

        try {
            var response = await fetch(API_BASE_URL + '/able_turn_visible/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json',
                },
                body: JSON.stringify({ free_event: tipo === 1 ? true : event.gratis }),

            })
            var data = await response.json()
            if (response.status === 401) {
                await refreshTokenIfNeeded()
                try {

                    response = await fetch(API_BASE_URL + '/able_turn_visible/', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ free_event: tipo === 1 ? true : event.gratis }),

                    })

                    if (!response.ok) throw new Error('No autorizado o error2')
                    data = await response.json()
                } catch (e) {
                    console.error('Volvió a fallar', e)
                }


            }
            if (!response.ok) throw new Error('No autorizado o error')
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

    return <div
        style={{
            minHeight: '100vh',
            width: '100vw',
            overflowY: 'auto',
            // color: 'red',
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: backgroundColor,
            position: 'relative',
            flexDirection: 'row',
            padding: '0rem 10rem'


        }}
    >

        <div style={{
            borderRadius: '30px',
            border: '10px solid black', width: '50%', minHeight: '90vh', marginTop: '100px', display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>

            <div style={{ position: 'relative', display: 'flex' }}>
                <img
                    src={event.image !== null ? event.image : soloCarita}
                    style={{
                        width: '100%',
                        height: '700px',
                        objectFit: 'cover',
                        display: 'block',
                        borderRadius: '0.25rem'
                    }}
                />

                <div className="d-flex align-items-center justify-content-center" style={{
                    height: '4rem', width: 'fit-content', borderRadius: '20px', border: `2px solid ${event['active'] ? 'rgba(54, 160, 9, 1)' : 'rgba(204, 12, 12, 1)'}`,
                    align: 'right', position: 'absolute', top: '5%', left: '5%', padding: '1.5rem', backgroundColor: event['active'] ? 'rgba(54, 160, 9, 1)' : 'rgba(204, 12, 12, 1)'
                }} onClick={(e) =>
                    handleOpen(event.active ? "desactivar" : "activar", e)
                } >


                    {event['active'] === false && (
                        <div style={{ display: 'flex', flexDirection: 'row', color: 'white' }}>
                            <i className="bi bi-x-lg" style={{ fontSize: '30px' }}></i>
                            <span className="px-2" style={{ fontSize: '30px', fontWeight: 400 }}> EVENTO  <span className='fw-bold'>NO </span> VISIBLE</span>
                        </div>

                    )}
                    {event['active'] === true && (

                        <div style={{ display: 'flex', flexDirection: 'row', color: 'white' }}>
                            <i className="bi bi-check2" style={{ fontSize: '30px' }}></i>
                            <span className="px-2" style={{ fontSize: '30px', fontWeight: 400 }}> EVENTO  <span className="fw-bold" style={{ fontWeigh: 800 }}> VISIBLE </span> </span>
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
                        <Button variant="secondary" onClick={() => setShowConfirmationModal(false)} st>
                            CANCELAR
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
                            CANCELAR
                        </Button>
                        <Button variant="primary" onClick={handleRedirectToCompraBono}>
                            COMPRAR BONO
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showNotEnoughPagosModal} onHide={() => setShowNotEnoughPagosModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title> 😔 SIN PLANES PAGOS</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ fontSize: '20px' }}>
                        Te quedaste sin más planes pagos para crear con tu planificación. <br />Extiende tu rango de planes pagos para seguir.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowNotEnoughPagosModal(false)} style={{ borderRadius: '20px', fontSize: '20px', fontWeight: 800 }}>
                            CANCELAR
                        </Button>
                        <Button variant="primary" onClick={handleRedirectToExtendRango} style={{ backgroundColor: logoColor, borderColor: logoColor, fontSize: '20px', fontWeight: 800, borderRadius: '20px' }} >
                            COMPRAR BONO
                        </Button>
                    </Modal.Footer>
                </Modal>


                {/* CONTENEDOR INFERIOR CON DEGRADADO Y TEXTO */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '35%',
                        background: 'linear-gradient(to top, rgba(255, 255, 255, 0.8), rgba(0,0,0,0))',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'end',
                        padding: '0.5rem 1rem',
                        pointerEvents: 'auto',
                        lineHeight: 1,
                        padding: 0,
                        margin: 0
                    }}
                >

                    {/* <div
                        style={{
                            color: 'black',
                            fontWeight: 800,
                            textAlign: 'end',
                            fontSize: '100px',
                            whiteSpace: 'normal',
                            overflowWrap: 'break-word'
                            , marginBottom: '2px'
                        }}
                    >
                        {event.name}
                    </div>*/}
                    {editMode ? (
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{
                                color: "black",
                                fontWeight: 800,
                                textAlign: "end",
                                fontSize: "100px",
                                border: "none",
                                borderBottom: "4px solid " + logoColor,
                                borderRadius: 0,
                                background: "transparent",
                                width: "95%",
                                outline: "none",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                color: "black",
                                fontWeight: 800,
                                textAlign: "end",
                                fontSize: "100px",
                                whiteSpace: "normal",
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                                marginBottom: "2px",
                                marginBottom: "2px",

                            }}
                        >
                            {formData.name}
                        </div>
                    )}


                </div>
            </div>

            <div className="d-flex align-items-center" style={{ margin: '0rem 1rem' }}>

                <p className='mt-2' style={{ fontSize: '30px', fontWeight: 800 }}>{fecha} a las {hora} </p>
            </div>
            <div
                style={{
                    margin: "0rem 1rem",
                    fontSize: "25px",
                    fontWeight: 300,
                    fontStyle: "italic",
                }}
            >
                {editMode ? (
                    <input
                        name="shortDesc"
                        value={formData.shortDesc}
                        onChange={handleChange}
                        style={{
                            fontSize: "25px",
                            fontWeight: 300,
                            border: "none",
                            borderBottom: "2px solid " + logoColor,
                            borderRadius: 0,
                            fontStyle: "italic",
                            width: "100%",
                            background: "transparent",
                            outline: "none",
                        }}
                    />
                ) : (
                    <em>{formData.shortDesc}</em>
                )}
            </div>

            <div
                style={{
                    textAlign: "justify",
                    margin: "1rem 1rem",
                    fontSize: "30px",
                }}
            >
                {editMode ? (
                    <textarea
                        name="desc"
                        value={formData.desc}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            fontSize: "30px",
                            border: "1px solid " + logoColor,
                            borderRadius: "10px",
                            padding: "1rem",
                            fontFamily: "inherit",
                            lineHeight: 1.4,
                        }}
                    />
                ) : (
                    formData.desc
                )}
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
                                backgroundColor: orangeColor,
                                border: '1.5px solid ' + logoColor,
                                borderRadius: '20px',
                                color: logoColor,
                                gap: '0.5rem',
                            }}
                        >
                            <div style={{ fontSize: '30px' }}> {tag.icon}</div>
                            <div style={{ fontWeight: 800, fontSize: '30px' }}> {tag.name}</div>

                        </div>
                    ))}

                </div>
            )}
            {/* editMode && (
                <button>
                    ADD TAGS
                </button>
            ) */}
            <div style={{ margin: '1rem 1rem' }}>
                <MapaDesdeBackend
                    lat={event['lat']}
                    long={event['long']}
                    direccion={event['direccion']}
                />
            </div>


        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20vh', marginLeft: '5vw', textAlign: 'start', width: '40vw' }}>

            <button onClick={() => toggleEdit()} style={{ borderRadius: '20px', alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', fontSize: '30px', fontWeight: 800, backgroundColor: editMode ? 'white' : logoColor, color: editMode ? logoColor : 'white', width: '10rem', lineHeight: 1 }}>
                {editMode ? "GUARDAR" : "EDITAR"}
            </button>
            <div style={{ fontSize: '30px', fontWeight: 400, color: logoColor }}>


                Veces visitado: <span style={{ fontWeight: 800, }}> {event['views']} </span>  <i className="bi bi-eye" style={{ marginLeft: '1vw', fontSize: '30px' }}></i>
            </div>
            <div style={{ fontSize: '30px', fontWeight: 400, color: logoColor }}>

                Veces compartido: <span style={{ fontWeight: 800 }}> {event['shares']}</span> <i className="bi bi-send" style={{ marginLeft: '1vw', fontSize: '30px' }}></i>
            </div>

            <div style={{ fontSize: '30px', fontWeight: 400, color: logoColor }}>

                Asistentes confirmados: <span style={{ fontWeight: 800 }}> {event['asistentes'].length}</span> <i className="bi bi-people-fill" style={{ marginLeft: '1vw', fontSize: '30px' }}></i>
            </div>
            {event['entradas_for_plan']?.length > 0 && (

                <div  >

                    {event['entradas_for_plan'].map((entrada, index) => (

                        <Card style={{ height: '300px', width: '100%', borderRadius: '1rem', overflow: 'hidden', marginTop: '2rem' }}>
                            <Card.Body className='p-0' style={{ height: '300px' }}>
                                <div className='row g-0' style={{ height: '100%' }}>

                                    <div className="col-md-4 g-0" style={{
                                        height: '100%', borderTopLeftRadius: '1rem',
                                        borderBottomLeftRadius: '1rem', display: 'flex',
                                        flexDirection: 'column',
                                    }}>
                                        <div style={{ flex: '2', overflow: 'hidden', backgroundColor: backgroundColor }}>
                                            <img src={event['image'] !== null ? event['image'] : soloCarita} style={{
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
                                                backgroundColor: logoColor,
                                                padding: '1rem',
                                                color: 'white',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '1rem',
                                            }}
                                        >
                                            <div>   <DateCard
                                                dia={dia}
                                                mes={mes}
                                            /></div>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>

                                                <i className="bi bi-clock" style={{ fontSize: '50px' }}></i>
                                                <p className="px-2 mt-3" style={{ fontSize: '30px' }}>{hora}</p>

                                            </div>

                                        </div>
                                    </div>

                                    <div className='col-md-8' style={{ backgroundColor: orangeColorLight, height: '100%' }}>
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
                                                <span className="fw-lighter" style={{ fontSize: '25px' }}> Total: <span className='fw-light'>{entrada['maxima_disponibilidad']}</span></span>

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
                <div>
                    {event.reservas_forms?.map((reserva, index) => (
                        <Card style={{ marginTop: '2rem', minHeight: '200px', height: 'auto', width: '100%', borderRadius: '1rem', overflow: 'hidden' }} onClick={() => { }}>
                            <Card.Body className='p-0' style={{ minheight: '200px' }}>


                                <div className='row g-0' style={{ width: '100%', minHeight: '200px', }}>

                                    <div className="col-md-4 g-0 d-flex flex-column" style={{
                                        backgroundColor: logoColor,
                                        borderTopLeftRadius: '1rem',
                                        borderBottomLeftRadius: '1rem',
                                        overflow: 'hidden',
                                        flex: 2,
                                    }}>

                                        <div style={{
                                            flexGrow: 2, position: 'relative'
                                        }}>
                                            <img src={event['image']} style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
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
                                                flex: 1,
                                                padding: '1rem',
                                                color: 'white',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '1rem',
                                                position: 'relative',
                                            }}
                                        >
                                            <div>   <DateCard
                                                dia={dia}
                                                mes={mes}
                                            /></div>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>

                                                <i className="bi bi-clock" style={{ fontSize: '50px' }}></i>
                                                <p className="px-2 mt-3" style={{ fontSize: '30px' }}>{hora}</p>

                                            </div>

                                        </div>
                                    </div>

                                    <div className='col-md-8' style={{ backgroundColor: orangeColorLight, minHeight: '300px', height: 'auto' }}>
                                        <div className='d-flex px-3 py-5 mt-2' style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                            <div style={{ flex: 2 }}>
                                                <span style={{ fontSize: '40px', fontWeight: 'bold' }}>{reserva['nombre']}</span><br />
                                                <span className="fw-light" style={{ fontSize: '22px' }}> Disponibilidad:<span style={{ fontWeight: 900 }}> {reserva['max_disponibilidad']}</span> </span>

                                            </div>
                                            <div className="d-flex flex-wrap gap-3 mt-2" style={{ flex: 3 }}>
                                                <p className="fw-light mt-2" style={{ fontSize: '22px' }}> CAMPOS DEL FORMULARIO DE RESERVA</p>

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
            {event['aLaGorra'] == true && (
                <div className='mt-4' style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 400, fontSize: '20px', color: logoColor }}> EVENTO A LA GORRA: </div>
                    <div className='mt-2' style={{ width: '100%', height: '50vh', display: 'flex', flexDirection: 'row', alignItems: 'end' }}>
                        <img src={aLaGorra} style={{ height: '100%' }} />
                        {event['recommendedAmount'] != null && (<div style={{ fontSize: '30px', fontWeight: 400, color: logoColor }}>Cantidad recomendada: <span style={{ fontWeight: 800 }}> {event['recommendedAmount']} </span></div>
                        )}
                         {event['recommendedAmount'] === null && (<div style={{ fontSize: '30px', fontWeight: 800, color: logoColor }}>No hay cantidad recomendada</div>
                        )}

                    </div>
                </div>


            )}

        </div>



    </div>
}

