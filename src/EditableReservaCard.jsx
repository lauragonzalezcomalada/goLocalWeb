import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { API_BASE_URL, backgroundColor } from './constants';
import DateCard from './DateCard';
import { useContext } from 'react'
import { AuthContext } from './AuthContext'


export default function Reserva({ initialData }) {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(initialData);
    const { accessToken, refreshTokenIfNeeded, setAccessToken } = useContext(AuthContext)
    const [error, setError] = useState("");

    //Formatear fecha
    const fechaEvento = new Date(formData.fecha);
    const dia = fechaEvento.getUTCDate();
    const mes = new Intl.DateTimeFormat('es-AR', { month: 'short', timeZone: 'UTC' }).format(fechaEvento).toUpperCase(); // "AGO"
    const hora = fechaEvento.getUTCHours().toString().padStart(2, "0") + ":" + fechaEvento.getUTCMinutes().toString().padStart(2, "0");

    const [camposPosibles, setCamposPosibles] = useState([]);

    useEffect(() => {
        async function fetchCampos() {
            try {
                var response = await fetch(API_BASE_URL + '/campos_reserva/', {
                    method: 'GET',
                })
                var data = await response.json()
                setCamposPosibles(data)
            } catch (e) {
                console.error('Error fetching campos', e)
            }
        } fetchCampos()

    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (error) {
            console.warn("No se puede enviar: ", error);
            return;
        }

        try {
            var response = await fetch(`${API_BASE_URL}/update_reserva/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json',
                }, body: JSON.stringify({ uuid: formData.uuid, event_type: formData.tipo, nombre: formData.nombre, max_disponibilidad: formData.max_disponibilidad, campos: formData.campos })
            });

            var data = await response.json()

            if (response.status === 401) {
                console.log('response status en fetch entradas = 401')
                // intentamos refrescar
                const newAccessToken = await refreshTokenIfNeeded()
                if (!newAccessToken) return // no se pudo refrescar

                // reintentamos con token nuevo
                response = await fetch(`${API_BASE_URL}/update_reserva/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ uuid: formData.uuid, event_type: formData.tipo, nombre: formData.nombre, max_disponibilidad: formData.max_disponibilidad, campos: formData.campos })
                });

                if (response.ok) {
                    data = await response.json()
                }
            }
            setFormData({
                ...formData,
                max_disponibilidad: data.max_disponibilidad,
                porcentaje_ventas: data.porcentaje_reservados

            });
        } catch (error) { console.error('Error en fetch:', error); }
        setEditMode(false);
    };

    return (
        <Card className="m-3 p-0" style={{ height: '400px', width: '100%', borderRadius: '1rem', overflow: 'hidden', backgroundColor:backgroundColor }}>
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
                                    <img src={formData.imagen} style={{
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
                                <div className='d-flex p-5 mt-5' style={{ height: '100%' }}>
                                    <div style={{ flex: 3 }}>
                                        <span style={{ fontSize: '50px', fontWeight: 'bold' }}>{formData.nombre}</span><br />
                                        <span className="fw-light" style={{ fontSize: '22px' }}> Confirmadas: {formData.confirmadas}</span><br />
                                        <span className="fw-light" style={{ fontSize: '22px' }}> Cantidad de entradas total: {formData.max_disponibilidad}</span>
                                        <div className="progress mt-3 mb-3" role="progressbar" aria-label="Basic example" aria-valuenow={formData.porcentaje_reservas} aria-valuemin="0" aria-valuemax="100">
                                            <div
                                                className="progress-bar"
                                                style={{ width: `${formData.porcentaje_ventas}%` }}
                                            >{formData.porcentaje_ventas + '%'}</div>
                                        </div>
                                    </div>
                                    <div className="px-0" style={{ flex: 3 }}>
                                        {formData.campos.map((campo) => {
                                            return <div

                                                className="p-2 border rounded mb-1 mx-2"
                                                style={{ flex: '1 0 auto', gap: '2rem' }}
                                            >
                                                <span style={{ fontSize: '18px', fontWeight: 'lighter' }}>{campo.label}</span>
                                            </div>
                                        })}
                                        <button type="button" className="btn btn-outline-primary px-5 mt-3 mx-5" style={{ lineHeight: '2', position: 'absolute', bottom: '2rem', right: '2rem' }} onClick={handleEditClick}>Editar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center w-100 px-2 mt-3" style={{ height: '100%', overflowY: 'auto' }}>
                        <Form.Group className="mb-3 w-100 mt-3 px-3" style={{ lineHeight: '1' }}>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1' }}>
                            <Form.Label>Reservas máximas para el evento</Form.Label>
                            <Form.Control
                                type="number"
                                name="max_disponibilidad"
                                value={formData.max_disponibilidad}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        max_disponibilidad: e.target.value
                                    });

                                    const nueva = Number(e.target.value);
                                    const minima = (formData.confirmadas);

                                    if (nueva < minima) {
                                        setError(`Debe ser al menos ${minima}`);
                                    } else {
                                        setError("");

                                    }
                                }}
                            />
                            {error && (
                                <Form.Text className="text-danger">
                                    {error}
                                </Form.Text>
                            )}
                        </Form.Group>

                        {/* Campos de reserva */}
                        <Form.Group className="mb-3 px-3 w-100">
                            <Form.Label>Campos de la reserva</Form.Label>
                            {camposPosibles.map((campo) => {
                                const isChecked = formData.campos.some(c => c.uuid === campo.uuid);
                                return (
                                    <Form.Check
                                        key={campo.id}
                                        type="checkbox"
                                        label={campo.label}
                                        checked={isChecked}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                // Agregar
                                                setFormData({
                                                    ...formData,
                                                    campos: [...formData.campos, campo]
                                                });
                                            } else {
                                                // Eliminar
                                                setFormData({
                                                    ...formData,
                                                    campos: formData.campos.filter(c => c.id !== campo.id)
                                                });
                                            }
                                        }}
                                    />
                                );
                            })}
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
    );
}
