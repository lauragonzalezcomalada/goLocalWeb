import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from './constants.js'
import { useState, useEffect } from 'react'
import WeekCalendar from './WeekCalendar'
import { Container, Card, Button } from 'react-bootstrap';
import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { Icono } from './Icono'
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import noPicture from './assets/nopicture.png';

import ojitosgif from './assets/ojitos.gif';

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { listenArrayEvents } from 'chart.js/helpers';



export default function EntradasPage() {
    //// Entradas es un dict tipus:asdf
    /*
        {'dd/mm':[{tipo:x,
        {entradas:[{entrada_dinero_recaudado,entrada_disponibles,
                    entrada_max_disp,entrada_porcentajedeventas,
                    entrada_precio,entrada_shortDesc},{...}],
        event_dateandtime,event_name,event_uuid}}]}*/

    const [referencias, setReferencias] = useState(null)
    const { accessToken, refreshTokenIfNeeded, setAccessToken } = useContext(AuthContext)

    const [expandedEventoUuid, setExpandedEventoUuid] = useState(null);
    const [ticketsVendidos, setTicketsVendidos] = useState({}); // objeto { event_uuid: [tickets] }
    const [loadingTickets, setLoadingTickets] = useState(false);
    const [errorTickets, setErrorTickets] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(300, 0)
    }, [])

    useEffect(() => {
        if (!accessToken) return
        async function fetchEntradas() {

            try {
                var response = await fetch(API_BASE_URL + '/entradas_user_admin/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                var data = await response.json()

                if (response.status === 401) {
                    console.log('response status en fetch entradas = 401')
                    // intentamos refrescar
                    const newAccessToken = await refreshTokenIfNeeded()
                    if (!newAccessToken) return // no se pudo refrescar

                    // reintentamos con token nuevo
                    response = await fetch(`${API_BASE_URL}/entradas_user_admin/`, {
                        headers: {
                            Authorization: `Bearer ${newAccessToken}`
                        }
                    })
                    if (response.ok) {
                        data = await response.json()
                    }
                }

                setReferencias(data)
            } catch (e) {
                console.error('Error fetching entradas para el userprofile', e)
            }
        } fetchEntradas()
    }, [accessToken])

    async function toggleExpandTickets(event_uuid, event_type, event_ticketsType) {
        console.log('toggle expanded tickets');
        if (expandedEventoUuid === event_uuid) {
            // Si ya está abierto, cerramos y no hacemos fetch
            setExpandedEventoUuid(null);
            return;
        }



        setExpandedEventoUuid(event_uuid);
        setLoadingTickets(true);
        setErrorTickets(null);
        try {
            var response = await fetch(`${API_BASE_URL}/sold_tickets_for_event/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json',
                }, body: JSON.stringify({ event_type: event_type, event_uuid: event_uuid, tickets_type: event_ticketsType })
            })
            if (!response.ok) throw new Error('Error al traer tickets');
            var data = await response.json();

            if (response.status === 401) {
                console.log('response status en fetch entradas = 401')
                // intentamos refrescar
                const newAccessToken = await refreshTokenIfNeeded()
                if (!newAccessToken) return // no se pudo refrescar

                // reintentamos con token nuevo
                response = await fetch(`${API_BASE_URL}/sold_tickets_for_event/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`
                    }, body: JSON.stringify({ event_type: event_type, event_uuid: event_uuid, tickets_type: event_ticketsType })

                })
                if (response.ok) {
                    data = await response.json()
                }
            }
            setTicketsVendidos(prev => ({
                ...prev,
                [event_uuid]: { type: event_ticketsType, data }
            }));


        } catch (error) {
            setErrorTickets(error.message);
        } finally {
            setLoadingTickets(false);
        }
    }

    async function handleStatusChange(evento_uuid, reservaNameKey, reserva_uuid, reserva_status) {

        var estado = reserva_status === true ? '1' : '0'

        try {
            var response = await fetch(`${API_BASE_URL}/update_reserva_status/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json',
                }, body: JSON.stringify({ reserva_uuid: reserva_uuid, reserva_status: estado })
            })
            if (response.status === 401) {
                console.log('response status en update status = 401')
                // intentamos refrescar
                const newAccessToken = await refreshTokenIfNeeded()
                if (!newAccessToken) return // no se pudo refrescar

                // reintentamos con token nuevo
                response = await fetch(`${API_BASE_URL}/update_reserva_status/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`
                    }, body: JSON.stringify({ reserva_uuid: reserva_uuid, reserva_status: estado })

                })
                if (!response.ok) {
                    console.log('Error in backend');
                    return;
                }
            }

            if (response.ok) {
                setTicketsVendidos(prev => {
                    const updated = { ...prev };

                    const reservasObj = updated[evento_uuid].data.data[reservaNameKey];
                    const updatedReservasObj = reservasObj?.map(reserva => {
                        if (reserva.uuid === reserva_uuid) {
                            return { ...reserva, status: parseInt(estado) };
                        }
                        return reserva;
                    });
                    updated[evento_uuid] = {
                        ...updated[evento_uuid],
                        data: {
                            ...updated[evento_uuid].data,
                            data: {
                                ...updated[evento_uuid].data.data,
                                [reservaNameKey]: updatedReservasObj,  // Actualizás solo el grupo específico (dentro o fuerta, o el que sea)
                            }
                        }
                    };
                    return updated;
                });

            } else {
                alert("Hubo un error actualizando el valor");
            }

        } catch (error) { console.log(error) }
    }

    function fetchEntradaTypeDetail(entrada_uuid, evento_tipo, entrada_name, evento_fecha, entrada_shortDesc, entrada_vendidas, entrada_disponibles, entrada_max_disp, entrada_porcentajedeventas, entrada_precio, evento_image) {
        navigate('/entradaDetail', { state: { entrada_uuid, evento_tipo, entrada_name, evento_fecha, entrada_shortDesc, entrada_vendidas, entrada_disponibles, entrada_max_disp, entrada_porcentajedeventas, entrada_precio, evento_image } })
    }


    function fetchReservaTypeDetail(reserva_uuid, evento_tipo, reserva_nombre, evento_fecha, reserva_confirmadas, reserva_max_disponibilidad, reserva_porcentaje_reservado, reserva_campos, evento_image) {
        navigate('/reservaDetail', { state: { reserva_uuid, evento_tipo, reserva_nombre, evento_fecha, reserva_confirmadas, reserva_max_disponibilidad, reserva_porcentaje_reservado, reserva_campos, evento_image } })
    }

    function fetchExternalTicketsLinkDetail(evento_tipo, evento_fecha, evento_uuid, evento_tickets_link, evento_image) {
        navigate('/externalLinkDetail', { state: { evento_uuid, evento_tipo, evento_fecha, evento_tickets_link, evento_image } })
    }

    if (Object.keys(referencias || {}).length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '56px', height: '100vh' }}>
                <img src={ojitosgif} style={{ height: '250px', width: '250px' }} />
            </div>
        )
    }

    return <div style={{ marginTop: '56px', width: '100%', minHeight: '100vh', overflowY: 'auto' }}>
        {Object.entries(referencias)?.map(([fecha, listaEntradas]) => {
            return (<div> <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '2rem 2rem'
            }}>
                <div style={{ flex: 1, height: '2px', backgroundColor: '#FA7239' }}></div>
                <span className="fw-bold" style={{ margin: '0 1rem', whiteSpace: 'nowrap', color: '#FA7239', fontSize: '20px' }}>{fecha}</span>
            </div>
                {listaEntradas?.map((evento, index) => {
                    if (evento.tracking_tipo === 0) { //plan con entradas
                        var anchoColumna = Math.max(1, Math.floor((12 - 3) / evento.entradas.length));
                        var colIcono = Math.max(1, 12 - anchoColumna * evento.entradas.length - 2);
                    }
                    else if (evento.tracking_tipo === 1) { // plan con reservas
                        var anchoColumna = Math.max(1, Math.floor((12 - 3) / evento.reservas.length));
                        var colIcono = Math.max(1, 12 - anchoColumna * evento.reservas.length - 2);
                    }

                    return (<>
                        <div key={evento.event_uuid} className="card mx-3 mb-1">
                            <div className="row g-0">
                                <div className="col-md-2">
                                    <div style={{ position: 'relative', minHeight: '12rem', width: '100%' }}>
                                        <img
                                            src={evento.event_imageUrl ? evento.event_imageUrl : noPicture}
                                            className="img-fluid rounded-start"
                                            style={evento.event_imageUrl
                                                ? {
                                                    minHeight: '12rem',
                                                    height: '100%',
                                                    width: '100%',
                                                    objectFit: 'cover',
                                                }
                                                : {
                                                    maxHeight: '12rem',
                                                    maxWidth: '12rem',
                                                    objectFit: 'scale-down',
                                                    margin: '0 auto', // centrar
                                                    display: 'block',
                                                }}
                                        />
                                        {/*CAPA DE DEGRADADO PARA AÑADIR TEXTO */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 50, left: 0, right: 0, bottom: 0,
                                                background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.8))',
                                                borderRadius: '0.25rem',
                                                pointerEvents: 'none'  // para que no interfiera con clicks en la imagen si hay
                                            }}
                                        />
                                        {/*EL TEXT */}
                                        <div
                                            className='d-flex justify-content-center'
                                            style={{
                                                width: '90%',
                                                position: 'absolute',
                                                bottom: '0.5px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                color: 'white',
                                                fontWeight: 'light',
                                                textAlign: 'center',
                                                pointerEvents: 'none',
                                                fontSize: '30px',
                                                whiteSpace: 'normal',
                                                overflowWrap: 'break-word',
                                            }}
                                        >
                                            {evento.event_name}
                                        </div>

                                    </div>
                                </div>

                                {/*evento con entradas*/}
                                {evento.tracking_tipo === 0 &&
                                    evento.entradas?.map((entrada, i) => {
                                        return (<div key={i} className={`col-md-${anchoColumna} d-flex align-items-center`} style={{ paddingLeft: '1rem', paddingRight: '1rem' }} onClick={() => fetchEntradaTypeDetail(entrada.entrada_uuid, evento.tipo, entrada.entrada_name, evento.event_dateandtime, entrada.entrada_shortDesc, entrada.entrada_vendidas, entrada.entrada_disponibles, entrada.entrada_max_disp, entrada.entrada_porcentajedeventas, entrada.entrada_precio, evento.event_imageUrl)}>

                                            <div className="card" style={{ width: '100%', height: '85%', color: '#491a13ff' }}>
                                                <div className="card-body d-flex align-items-center">
                                                    <div className='col-md-8 mt-2'>
                                                        <p className="fw-bold" style={{ lineHeight: '1', fontSize: '22px' }}>{entrada.entrada_name}</p>
                                                        <p style={{ lineHeight: '1', fontSize: '16px' }}>{entrada.entrada_shortDesc}</p>
                                                        <p style={{ lineHeight: '2', fontSize: '22px' }}>{'$' + Number(entrada.entrada_precio).toLocaleString('es-AR')}</p>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <p style={{ fontSize: '22px' }}>{entrada.entrada_disponibles + '/' + entrada.entrada_max_disp}</p>

                                                        <div className="progress mt-3 mb-3" role="progressbar" aria-label="Basic example" aria-valuenow={entrada.entrada_porcentajedeventas} aria-valuemin="0" aria-valuemax="100">
                                                            <div
                                                                className="progress-bar"
                                                                style={{ width: `${entrada.entrada_porcentajedeventas}%`, backgroundColor: '#491a13ff' }}
                                                            >{entrada.entrada_porcentajedeventas + '%'}</div>
                                                        </div>
                                                        <p style={{ fontSize: '22px' }}>{'$' + Number(entrada.entrada_dinero_recaudado).toLocaleString('es-AR')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)
                                    })}
                                {/*evento con reservas*/}
                                {evento.tracking_tipo === 1 &&
                                    evento.reservas?.map((reserva, i) => {
                                        console.log('tracking_tipo 1');

                                        return (<div key={i} className={`col-md-${anchoColumna} d-flex align-items-center`} style={{ paddingLeft: '1rem', paddingRight: '1rem', marginTop: '1rem', marginBottom: '1rem' }} onClick={() => fetchReservaTypeDetail(reserva.uuid, evento.tipo, reserva.nombre, evento.event_dateandtime, reserva.confirmadas, reserva.max_disponibilidad, reserva.porcentaje_reservado, reserva.campos, evento.event_imageUrl)}>
                                            <div className="card" style={{ width: '100%', height: '100%', color: '#491a13ff' }}>
                                                <div className="card-body d-flex align-items-center">
                                                    <div className='col-md-6 mt-2'>
                                                        <p className="fw-bold" style={{ lineHeight: '1', fontSize: '22px' }}>{reserva.nombre}</p>
                                                        <p style={{ fontSize: '22px' }}>{reserva.confirmadas + '/' + reserva.max_disponibilidad}</p>
                                                        <div className="progress mt-3 mb-3" role="progressbar" aria-label="Basic example" aria-valuenow={reserva.porcentaje_reservado} aria-valuemin="0" aria-valuemax="100">
                                                            <div
                                                                className="progress-bar"
                                                                style={{ width: `${reserva.porcentaje_reservado}%` }}
                                                            >{reserva.porcentaje_reservado + '%'}</div>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-6' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                        {reserva.campos?.map((campo) => {
                                                            return <div

                                                                className="p-2 mb-1 mx-2"
                                                                style={{ flex: '2 0 auto', gap: '2rem', border: '2px solid #491a13ff', borderRadius: '10px' }}
                                                            >
                                                                <span style={{ fontSize: '18px', fontWeight: 'light' }}>{campo.label}</span>
                                                            </div>
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>);
                                    })
                                }
                                {/*Evento gratis sin reserva*/}
                                {evento.tracking_tipo === 2 && (
                                    <div key={'sin_resereva'} className={`col-md-8 d-flex align-items-center justify-content-center p-5`} style={{ paddingLeft: '1rem', paddingRight: '1rem', marginTop: '1rem', marginBottom: '1rem' }} >
                                        <div style={{ position: 'absolute', right: '5rem', display: 'flex', flexDirection: 'column' }}>
                                            <span className='fw-light fs-4'> Evento <span style={{ fontWeight: 'bold' }}> gratuito</span></span>
                                            <span className='fw-light fs-4'><span style={{ fontWeight: 'bold' }}> sin</span> reservas</span>
                                        </div>
                                        <div id="views-block" style={{ display: "flex", flexDirection: "row", marginLeft: '2rem', justifyContent: 'center', alignItems: 'center', color: '#491a13ff' }} >
                                            <OverlayTrigger
                                                placement="top" // posición del tooltip
                                                overlay={
                                                    <Tooltip id="tooltip-top">
                                                        Veces que se visitado el evento
                                                    </Tooltip>
                                                }
                                            >
                                                <span>
                                                    <Icono className="bi bi-eye-fill" style={{ fontSize: '2rem', color: '#491a13ff' }} />

                                                </span>
                                            </OverlayTrigger>
                                            <span className=' px-4' style={{ fontSize: "1.5rem", fontWeight: 'light', color: '#491a13ff' }}> {evento.views}</span>
                                        </div>
                                        <div id="shares-block" style={{ display: "flex", flexDirection: "row", marginLeft: '2rem', justifyContent: 'center', alignItems: 'center' }} >
                                            <OverlayTrigger
                                                placement="top" // posición del tooltip
                                                overlay={
                                                    <Tooltip id="tooltip-top">
                                                        Veces que se ha compartido
                                                    </Tooltip>
                                                }
                                            >
                                                <span>
                                                    <Icono className="bi bi-send" style={{ fontSize: '2rem', color: '#491a13ff' }} />

                                                </span>
                                            </OverlayTrigger>
                                            <span className=' px-4' style={{ fontSize: "1.5rem", fontWeight: 'light', color: '#491a13ff' }}> {evento.shares}</span>
                                        </div>
                                    </div>

                                )}
                                {/*Evento de pago con link externo*/}
                                {evento.tracking_tipo === 3 && (
                                    <div key={'sin_entradas_centr'} className={`col-md-8 d-flex align-items-center justify-content-center p-3`} style={{ paddingLeft: '1rem', paddingRight: '1rem', marginTop: '1rem', marginBottom: '1rem' }} >
                                        <div style={{ position: 'absolute', right: '5rem', display: 'flex', flexDirection: 'column', color: '#491a13ff' }}>
                                            <span className='fw-light fs-4'> Evento <span style={{ fontWeight: 'bold' }}> pago</span></span>
                                            <span className='fw-light fs-4'><span style={{ fontWeight: 'bold' }}>ticketera</span> externa</span>
                                        </div>
                                        <div className="justify-content-center align-items-center p-3" style={{ display: 'flex', flexDirection: 'column', maxWidth: '85%' }}>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip id="tooltip-top">Presiona para editar el link</Tooltip>}
                                            >
                                                <div
                                                    role="button"
                                                    tabIndex={0}
                                                    style={{ color: '#491a13ff', cursor: 'pointer' }}
                                                    onClick={() => fetchExternalTicketsLinkDetail(
                                                        evento.tipo,
                                                        evento.event_dateandtime,
                                                        evento.event_uuid,
                                                        evento.tickets_link,
                                                        evento.event_imageUrl
                                                    )}
                                                >
                                                    Link a las entradas:
                                                    <span className="fw-bold fs-4 px-1">{evento.tickets_link}</span>
                                                </div>
                                            </OverlayTrigger>

                                            <div className="mt-3 align-items-center justify-content-center" style={{ display: 'flex', flexDirection: 'row' }}>
                                                <div id="views-block" style={{ display: "flex", flexDirection: "row", marginLeft: '2rem', justifyContent: 'center', alignItems: 'center' }} >
                                                    <OverlayTrigger
                                                        placement="top" // posición del tooltip
                                                        overlay={
                                                            <Tooltip id="tooltip-top">
                                                                Veces que se visitado el evento
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <span>
                                                            <Icono className="bi bi-eye-fill" style={{ fontSize: '2rem', color: '#491a13ff' }} />

                                                        </span>
                                                    </OverlayTrigger>
                                                    <span className=' px-4' style={{ fontSize: "1.5rem", fontWeight: 'light', color: '#491a13ff' }}> {evento.views}</span>
                                                </div>
                                                <div id="shares-block" style={{ display: "flex", flexDirection: "row", marginLeft: '2rem', justifyContent: 'center', alignItems: 'center' }} >

                                                    <OverlayTrigger
                                                        placement="top" // posición del tooltip
                                                        overlay={
                                                            <Tooltip id="tooltip-top">
                                                                Veces que se ha compartido
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <span>
                                                            <Icono className="bi bi-send" style={{ fontSize: '2rem', color: '#491a13ff' }} />
                                                        </span>

                                                    </OverlayTrigger>
                                                    <span className=' px-4' style={{ fontSize: "1.5rem", fontWeight: 'light', color: '#491a13ff' }}> {evento.shares}</span>
                                                </div>
                                                <div id="external-link-block" style={{ display: "flex", flexDirection: "row", marginLeft: '2rem', justifyContent: 'center', alignItems: 'center' }} >
                                                    <OverlayTrigger
                                                        placement="top" // posición del tooltip
                                                        overlay={
                                                            <Tooltip id="tooltip-top">
                                                                Clicks al link de las entradas
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <span>
                                                            <Icono className="bi bi-hand-index" style={{ fontSize: '2rem', color: '#491a13ff' }} />
                                                        </span>
                                                    </OverlayTrigger>
                                                    <span className=' px-4' style={{ fontSize: "1.5rem", fontWeight: 'light', color: '#491a13ff' }}> {evento.shares}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {(evento.tracking_tipo === 0 || evento.tracking_tipo === 1) && (
                                    <div className={`col-md-${colIcono}  d-flex align-items-center justify-content-center`} style={{ paddingRight: '3rem', flexDirection: 'column' }}>
                                        <div id="views-block" style={{ display: "flex", flexDirection: "row", marginLeft: '2rem', justifyContent: 'center', alignItems: 'center' }} >
                                            <OverlayTrigger
                                                placement="top" // posición del tooltip
                                                overlay={
                                                    <Tooltip id="tooltip-top">
                                                        Veces que se visitado el evento
                                                    </Tooltip>
                                                }
                                            >
                                                <span>
                                                    <Icono className="bi bi-eye-fill" style={{ fontSize: '2rem', color: '#491a13ff' }} />
                                                </span>
                                            </OverlayTrigger>
                                            <span className=' px-4' style={{ fontSize: "1.5rem", fontWeight: 'light', color: '#491a13ff' }}> {evento.views}</span>
                                        </div>
                                        <div id="shares-block" style={{ display: "flex", flexDirection: "row", marginLeft: '2rem', justifyContent: 'center', alignItems: 'center' }} >
                                            <OverlayTrigger
                                                placement="top" // posición del tooltip
                                                overlay={
                                                    <Tooltip id="tooltip-top">
                                                        Veces que se ha compartido
                                                    </Tooltip>
                                                }
                                            >
                                                <span>
                                                    <Icono className="bi bi-send" style={{ fontSize: '2rem', color: '#491a13ff' }} />
                                                </span>
                                            </OverlayTrigger>
                                            <span className=' px-4' style={{ fontSize: "1.5rem", fontWeight: 'light', color: '#491a13ff' }}> {evento.shares}</span>
                                        </div>
                                        <span
                                            role="button"
                                            onClick={() => toggleExpandTickets(evento.event_uuid, evento.tipo, evento.tracking_tipo)}
                                            style={{ cursor: 'pointer', marginLeft: '2rem' }}
                                        >
                                            <Icono className="bi bi-chevron-down" style={{ fontSize: '1.5rem', color: '#491a13ff' }} />
                                        </span>

                                    </div>)}
                            </div>
                        </div >
                        {expandedEventoUuid === evento.event_uuid && (
                            <div className="card mx-3 mb-3 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                                {loadingTickets ? (
                                    <div className="text-center">Cargando datos...</div>
                                ) : errorTickets ? (
                                    <div className="text-danger">Error: {errorTickets}</div>
                                ) : ticketsVendidos[evento.event_uuid] && ticketsVendidos[evento.event_uuid].data ? (
                                    ticketsVendidos[evento.event_uuid].type === 0 ? (
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Nombre</th>
                                                    <th>Email</th>
                                                    <th>Fecha de compra</th>
                                                    <th>Precio</th>
                                                    <th>Asistido</th>
                                                    <th>QR</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ticketsVendidos[evento.event_uuid].data?.map((ticket, index) => (
                                                    <tr key={ticket.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{ticket.nombre}</td>
                                                        <td>{ticket.email}</td>
                                                        <td>
                                                            {ticket.fecha_compra
                                                                ? format(parseISO(ticket.fecha_compra), "dd/MM/yyyy HH:mm")
                                                                : "-"}
                                                        </td>
                                                        <td>{'$' + Number(ticket.precio).toLocaleString('es-AR')}</td>
                                                        <td>{ticket.status === 0 ? 'No' : 'Sí'}</td>
                                                        <td>
                                                            <a
                                                                href={API_BASE_URL + ticket.qr_code}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <i className="bi bi-qr-code px-2" style={{ fontSize: '1.5rem', color: '#FA7239' }}></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        ticketsVendidos[evento.event_uuid] &&
                                            Object.values(ticketsVendidos[evento.event_uuid].data.data).some(arr => Array.isArray(arr) && arr.length > 0)
                                            ?
                                            Object.entries(ticketsVendidos[evento.event_uuid].data.data)?.map(([nombreFormulario, reservas]) => (
                                                <div key={nombreFormulario} style={{ marginBottom: '2rem' }}>
                                                    {/* Título del grupo */}
                                                    <h5>{nombreFormulario}</h5>
                                                    {reservas.length > 0 && (
                                                        <table
                                                            key={nombreFormulario}
                                                            className="table table-hover w-100"
                                                            style={{ tableLayout: 'fixed', width: '100%' }}
                                                        >
                                                            <thead>
                                                                <tr>
                                                                    {Object.keys(reservas[0].values)?.map((campo, idx) => (
                                                                        <th className="text-uppercase" key={idx}>{campo}</th>
                                                                    ))}
                                                                    <th key="asist">¿Asistido?</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {reservas?.map((reserva, idx) => (
                                                                    <tr key={idx}>
                                                                        {Object.values(reserva.values)?.map((valor, i) => (
                                                                            <td className="text-uppercase" key={i}>{valor}</td>
                                                                        ))}
                                                                        <td>
                                                                            <input className="form-check-input p-3" type="checkbox" checked={reserva.status === 1} id="checkDefault" style={{ accentColor: '#red' }} onChange={(e) => handleStatusChange(evento.event_uuid, nombreFormulario, reserva.uuid, e.target.checked)} />
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </div>
                                            )) :
                                            <div> No hay datos.</div>
                                    )
                                ) : (
                                    <div>No hay datos.</div>
                                )}
                            </div>

                        )
                        }
                    </>)
                })}
            </div>
            )
        })}

    </div >
}
