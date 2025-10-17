import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react'
import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, logoColor } from './constants.js'


export default function CamposForm({ campo, setCampo, onAgregar }) {

    const [campos, setCampos] = useState([]);


    useEffect(() => {


        async function fetchCampos() {

            try {
                var response = await fetch(API_BASE_URL + '/campos_reserva/', {
                    method: 'GET',
                })
                var data = await response.json()
                setCampos(data)
            } catch (e) {
                console.error('Error fetching campos', e)
            }
        } fetchCampos()

    }, []);


    const agregarCampo = () => {
        if (campo.uuid && campo.label) {
            onAgregar(campo);
            setCampo({ uuid: '', label: '' }); // Limpiar después de agregar
        } else {
            alert('Por favor, completa todos los campos del formulario.');
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'uuid') {
            // Buscar el campo completo por UUID
            const selectedCampo = campos.find(c => c.uuid === value);
            if (selectedCampo) {
                setCampo({
                    uuid: selectedCampo.uuid,
                    label: selectedCampo.label,
                });
            }
        } else {
            setCampo((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    return (
        <div className="p-3 mb-3">
            <Form.Group className="mb-3">
                <Form.Label>Tipo</Form.Label>
                <Form.Select name="uuid" value={campo.uuid} onChange={handleChange}>
                    <option value="">Seleccionar campo...</option>
                    {campos.map(campo => <option name="label" value={campo.uuid}>{campo.label}</option>)}
                </Form.Select>
            </Form.Group>

            <Button type="button" onClick={agregarCampo} className="mt-2" style={{borderRadius:'20px', backgroundColor:logoColor, borderColor:'transparent'}}>
                AÑADIR CAMPO
            </Button>
        </div>
    );
}
