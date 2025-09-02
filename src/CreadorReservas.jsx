import React, { useState } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import CamposForm from './CamposForm.jsx';

export default function CreadorReservas({ onGuardar , onCancelar}) {
    const [formData, setFormData] = useState({
        tipoReserva: '',
        cantidad: ''
    });

    const [nuevoCampo, setNuevoCampo] = useState({ uuid: '', label: ''});
    const [campos, setCampos] = useState([]);


    const handleChangeReserva = (e) => { // en el form principal de tipo de reserva y cantidad
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


 
    const agregarCampo = () => {
        setCampos([...campos, nuevoCampo]);
        setNuevoCampo({ uuid: '', label: '' }); // limpiar
    };




    const handleAceptar = () => {
    
        if (formData.tipoReserva && formData.cantidad && campos.length > 0) {
            onGuardar({
                ...formData,   // tipoReserva, cantidad
                campos         // lista de campos personalizados
            }); // Enviamos al padre
            setFormData({ tipoReserva: '', cantidad: '' }); // Limpiar
            agregarCampo();
        } else {
            alert('Completá todos los campos del formulario y agregá al menos un campo personalizado.');
        }
    };

    return (
        <div
            className="mt-3 p-3 mx-4"
            style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                background: '#f9f9f9c8',
                width: '95%',

            }}
        >
            <input
                type="text"
                name="tipoReserva"
                placeholder="Tipo de reserva"
                value={formData.tipoReserva}
                onChange={handleChangeReserva}
                className="form-control mb-2 fw-light fs-5"
            />


            <input
                type="number"
                name="cantidad"
                placeholder="Cantidad"
                value={formData.cantidad}
                onChange={handleChangeReserva}
                className="form-control mb-3 fw-light fs-5"
            />

            {/* Campos de reserva agregados */}
            {campos.length > 0 && (
                <div className="mb-3">
                    <strong>Campos de reserva agregados:</strong>
                    <ul>
                        {campos.map((campo, idx) => (
                            <li key={idx}>
                                {campo.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <CamposForm
                campo={nuevoCampo}
                setCampo={setNuevoCampo}
                onAgregar={agregarCampo}
            />

            {/* Botón para mostrar form de nuevo campo 
            {!mostrarFormCampo ? (
                <Button variant="outline-primary" onClick={() => setMostrarFormCampo(true)} className="mb-3">
                    + Añadir campo de reserva
                </Button>
            ) : (
                <Form onSubmit={agregarCampo} className="p-3 border rounded mb-3" style={{ background: '#fff' }}>
                    <Form.Group className="mb-2">
                        <Form.Label>Tipo de campo</Form.Label>
                        <Form.Select name="tipo" value={nuevoCampo.tipo} onChange={handleChangeCampo}>
                            <option value="">Selecciona un tipo</option>
                            <option value="text">Texto</option>
                            <option value="number">Número</option>
                            <option value="email">Email</option>
                            <option value="tel">Teléfono</option>
                            <option value="date">Fecha</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Label (visible)</Form.Label>
                        <Form.Control
                            type="text"
                            name="label"
                            value={nuevoCampo.label}
                            onChange={handleChangeCampo}
                            placeholder="Ej: ¿Cuál es tu nombre?"
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Nombre (clave interna)</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={nuevoCampo.nombre}
                            onChange={handleChangeCampo}
                            placeholder="Ej: nombre"
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>¿Obligatorio?</Form.Label>
                        <Form.Check
                            type="checkbox"
                            name="obligatorio"
                            checked={nuevoCampo.obligatorio || false}
                            onChange={(e) =>
                                setNuevoCampo((prev) => ({
                                    ...prev,
                                    obligatorio: e.target.checked,
                                }))
                            }
                         
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button type="submit" variant="primary">Guardar campo</Button>
                        <Button variant="secondary" onClick={() => setMostrarFormCampo(false)}>Cancelar</Button>
                    </div>
                </Form>
            )}
            */}


            <div className="d-flex justify-content-between mt-4 px-4">
                <button
                    type="button"
                    className="btn fw-light fs-5"
                    onClick={handleAceptar}
                    style={{ padding: '0.5rem 2rem', borderRadius: '20px', border:'0px', backgroundColor:'#FA7239' }}
                >
                    Aceptar
                </button>
                <button
                    type="button"
                    className="btn fw-light fs-5"
                    onClick={onCancelar}
                    style={{ padding: '0.5rem 2rem', borderRadius: '20px', border: '0px', backgroundColor:'#491a13b3' }}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}
