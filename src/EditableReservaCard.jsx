import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { API_BASE_URL, backgroundColor, logoColor, orangeColor, orangeColorLight } from './constants';
import DateCard from './DateCard';
import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import soloCarita from './assets/nopicture.png';


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
        <Card className="m-3 p-0" style={{ height: '500px', width: '80%', borderRadius: '1rem', overflow: 'hidden', backgroundColor:backgroundColor,borderColor:'transparent' }}>
            <Card.Body className='p-0' style={{ height: '400px' }}>
                {!editMode ? (
                    <>
                        <div className='row g-0' style={{ height: '100%' }}>
                            <div className="col-md-4 g-0" style={{
                                height: '100%',
                                borderTopLeftRadius: '1rem',
                                borderBottomLeftRadius: '1rem', 
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <div style={{ flex: '2', overflow: 'hidden' }}>
                                    <img src={formData.imagen !== null ? formData.imagen : soloCarita} style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block'
                                    }}></img>
                                </div>
                                <div
                                    className="d-flex"
                                    style={{
                                        flex: 1,
                                        backgroundColor:logoColor,
                                        padding: '0.5rem',
                                        color: 'white',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '1rem',
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
                            <div className='col-md-8 ' style={{ backgroundColor: orangeColorLight ,}}>
                                <div className='d-flex p-5' style={{ height: '100%' }}>
                                    <div style={{ flex: 3,display:'flex', flexDirection:'column', justifyContent:'center' }}>
                                        <span style={{ fontSize: '50px', fontWeight: 'bold' }}>{formData.nombre}</span><br />
                                        <span className="fw-light fs-4"> Confirmadas: {formData.confirmadas}</span><br />
                                        <span className="fw-light fs-4"> Cantidad de entradas total: {formData.max_disponibilidad}</span>
                                        <div className="progress mt-3 mb-3" role="progressbar" aria-label="Basic example" aria-valuenow={formData.porcentaje_reservas} aria-valuemin="0" aria-valuemax="100">
                                            <div
                                                className="progress-bar"
                                                style={{ width: `${formData.porcentaje_ventas}%` }}
                                            >{formData.porcentaje_ventas + '%'}</div>
                                        </div>
                                    </div>
                                    <div className="px-0" style={{ flex: 3,display:'flex', flexDirection:'column', justifyContent:'center'}}>
                                        {formData.campos.map((campo) => {
                                            return <div
                                                className="p-2 rounded mb-1 mx-2"
                                                style={{ flex: 'auto 0 auto', gap: '2rem',  border: '2px solid '+logoColor, backgroundColor: logoColor
                                                }}
                                            >
                                                <span style={{ fontSize: '18px', fontWeight: 'bold' , color: 'white'}}>{campo.label}</span>
                                            </div>
                                        })}
                                        <button type="button" className="btn btn-outline-primary px-5 mx-5" style={{marginTop:'1rem', lineHeight: '1.5', borderRadius: '20px', backgroundColor: logoColor, color: 'white', borderColor: 'transparent', fontSize: '30px', fontWeight: 400 }}  onClick={handleEditClick}>EDITAR</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center w-100" style={{ height: '100%', backgroundColor: orangeColorLight }}>
                        <Form.Group className="mb-3 w-100 mt-4 px-3" style={{ lineHeight: '1' }}>
                            <Form.Label className="fs-4 fw-bold" style={{ color: logoColor }}>NOMBRE</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1' }}>
                            <Form.Label className="fs-4 fw-bold" style={{ color: logoColor }}>RESERVAS MÁXIMAS PARA EL EVENTO</Form.Label>
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
                            <Form.Label className="fs-4 fw-bold" style={{ color: logoColor }}>CAMPOS DE LA RESERVA</Form.Label>
                            {camposPosibles.map((campo) => {
                                const isChecked = formData.campos.some(c => c.uuid === campo.uuid);
                                return (
                                    <Form.Check
                                    className="fs-6" style={{ color: logoColor, checkColor: logoColor , accentColor: logoColor,}}
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
                        <div className="d-flex gap-2">
                            <Button type="submit" variant="success" className="fs-3 fw-bolder" style={{ width: '20vw', height: '7vh', borderRadius: '20px', borderColor: 'transparent', backgroundColor: logoColor }}>
                                GUARDAR
                            </Button>
                            <Button variant="secondary" className="fs-3 fw-bolder" style={{ width: '20vw', height: '7vh', borderRadius: '20px', borderColor: 'transparent' }} onClick={() => setEditMode(false)}>
                                CANCELAR
                            </Button>
                        </div>
                        <div className="mb-5" />

                    </Form>

                )}
            </Card.Body>
        </Card>
    );
}
