import EditableReservaCard from './EditableReservaCard';
import { useLocation } from 'react-router-dom'
import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { AuthContext } from './AuthContext'
import DateCard from './DateCard';
import { API_BASE_URL } from './constants';


export default function ReservaTypeDetail() {


    const location = useLocation()

    const { evento_tipo, evento_uuid, evento_image, evento_fecha,
        evento_tickets_link
    } = location.state || {}

    const [editMode, setEditMode] = useState(false);
    const { accessToken, refreshTokenIfNeeded, setAccessToken } = useContext(AuthContext)

    const fechaEvento = new Date(evento_fecha);
    const dia = fechaEvento.getUTCDate();
    const mes = new Intl.DateTimeFormat('es-AR', { month: 'short', timeZone: 'UTC' }).format(fechaEvento).toUpperCase(); // "AGO"
    const hora = fechaEvento.getUTCHours().toString().padStart(2, "0") + ":" + fechaEvento.getUTCMinutes().toString().padStart(2, "0");


    const [ticketsLink, setTicketsLink] = useState(evento_tickets_link)
    const handleChange = (e) => {
        console.log('la e')
        console.log(e.target.value);
        setTicketsLink(e.target.value)
    }

    const handleEditClick = () => {
        setEditMode(true);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        console.log('uuid en la handle submit')
        console.log(evento_uuid)
        try {
            var response = await fetch(`${API_BASE_URL}/update_tickets_link/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json',
                }, body: JSON.stringify({ uuid: evento_uuid, event_type: evento_tipo, tickets_link: ticketsLink })
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

                    }, body: JSON.stringify({ uuid: evento_uuid, event_type: evento_tipo, tickets_link: ticketsLink })
                });

                if (response.ok) {
                    data = await response.json()
                }
            }
            console.log('response')
            console.log(data.tickets_link)
            setTicketsLink(data.tickets_link)
            /* setFormData({
                 ...formData,
                 max_disponibilidad: data.max_disponibilidad,
                 porcentaje_ventas: data.porcentaje_reservados
 
             });*/
        } catch (error) { console.error('Error en fetch:', error); }


        setEditMode(false);
    };



    return <div className="d-flex align-items-start" style={{
        marginTop: '56px', width: '100%',
        overflowY: 'hidden'
    }}>

        <Card className="m-3 p-0" style={{ height: '400px', width: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
            <Card.Body className='p-0' style={{ height: '400px' }}>
                {!editMode ? (
                    <>
                        <div className='row g-0' style={{ height: '100%' }}>

                            <div className="col-md-4 g-0" style={{
                                backgroundColor: 'rgba(255,10,20,1)', height: '100%', borderTopLeftRadius: '1rem',
                                borderBottomLeftRadius: '1rem', display: 'flex',
                                flexDirection: 'column',
                            }}>

                                <div style={{ flex: '2', overflow: 'hidden' }}>
                                    <img src={evento_image} style={{
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
                                    <div className='mt-2 px-3'>   <DateCard
                                        dia={dia}
                                        mes={mes}
                                    /></div>
                                    <div style={{ marginTop: '12px', marginLeft: '5px', display: 'flex', flexDirection: 'row' }}>

                                        <i className="bi bi-clock" style={{ fontSize: '50px' }}></i>
                                        <p className="px-2 mt-3" style={{ fontSize: '30px' }}>{hora}</p>

                                    </div>

                                </div>
                            </div>

                            {/*aquí comença la part de descripció de la reserva */}
                            <div className='col-md-8' style={{ backgroundColor: 'rgba(189, 125, 125, 1)' }}>
                                <div className='p-5 mt-5' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

                                    <span style={{ fontSize: '50px', fontWeight: 'lighter' }}>Link a tus entradas: </span><br />


                                    <a
                                        href={'https://' + ticketsLink}
                                        target="_blank"
                                        className="fw-light fs-3"
                                        rel="noopener noreferrer"
                                        style={{ wordWrap: 'break-word', overflowWrap: 'break-word', color: 'black' }}
                                    >
                                        {ticketsLink}
                                    </a>



                                    <button type="button" className="btn btn-outline-primary px-5 mt-3 mx-5" style={{ lineHeight: '2', position: 'absolute', bottom: '2rem', right: '2rem' }} onClick={handleEditClick}>Editar</button>


                                </div>
                            </div>
                        </div>


                        {/*<h5>{formData.nombre}</h5>
            <p>{formData.descripcion}</p>
            <Button variant="outline-primary" onClick={handleEditClick}>
              Editar
            </Button>*/}


                    </>
                ) : (
                    <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center w-100 px-2 mt-3" style={{ height: '100%', overflowY: 'auto' }}>
                        <Form.Group className="mb-3 w-100 mt-3 px-3" style={{ lineHeight: '1' }}>
                            <Form.Label>Link a las entradas</Form.Label>
                            <Form.Control
                                type="text"
                                name="ticketsLink"
                                value={ticketsLink}
                                onChange={handleChange}
                            />
                        </Form.Group>


                        <div className="d-flex gap-2 px-3">
                            <Button type="submit" variant="success">
                                Guardar
                            </Button>
                            <Button variant="secondary" onClick={() => setEditMode(false)}>
                                Cancelar
                            </Button>
                        </div>
                        <div className="mb-5" />

                    </Form>

                )}
            </Card.Body>
        </Card>





    </div>
}