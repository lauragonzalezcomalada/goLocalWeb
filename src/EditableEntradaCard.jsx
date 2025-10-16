import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { API_BASE_URL, backgroundColor, logoColor } from './constants';
import DateCard from './DateCard';
import { useContext } from 'react'
import { AuthContext } from './AuthContext'


export default function EditableEntradaCard({ initialData }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const { accessToken, refreshTokenIfNeeded, setAccessToken } = useContext(AuthContext)


  //Formatear fecha
  const fechaEvento = new Date(formData.fecha);
  const dia = fechaEvento.getUTCDate();
  const mes = new Intl.DateTimeFormat('es-AR', { month: 'short', timeZone: 'UTC' }).format(fechaEvento).toUpperCase(); // "AGO"
  const hora = fechaEvento.getUTCHours().toString().padStart(2, "0") + ":" + fechaEvento.getUTCMinutes().toString().padStart(2, "0");

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
    try {
      const response = await fetch(`${API_BASE_URL}/update_entrada/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json',
        }, body: JSON.stringify({ uuid: formData.uuid, event_type: formData.tipo, titulo: formData.nombre, descripcion: formData.descripcion, disponibles: formData.disponibles, precio: formData.precio })
      });
      if (!response.ok) throw new Error('Error al actualizar entrada');

      var data = await response.json()
      setFormData({
        ...formData,
        max_disponibilidad: data.max_disponibilidad,
        porcentaje_ventas: data.porcentaje_ventas

      });
    } catch (error) { console.error('Error en fetch:', error);}


    setEditMode(false);
  };

  return (
    <Card className="m-3 p-0" style={{ height: '500px', width: '80%', borderRadius: '1rem', overflow: 'hidden' , backgroundColor:backgroundColor}}>
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

              <div className='col-md-8' style={{ backgroundColor: 'rgba(189, 125, 125, 1)' }}>
                <div className='d-flex p-5 mt-5' style={{ height: '100%' }}>
                  <div style={{ flex: 2 }}>
                    <span style={{ fontSize: '50px', fontWeight: 'bold' }}>{formData.nombre}</span><br />
                    <span style={{ fontSize: '30px', fontWeight: 'lighter' }}>{formData.descripcion}</span><br />
                    <span style={{ fontSize: '40px', fontWeight: 'lighter', lineHeight: '3' }}>{'$' + formData.precio}</span>
                  </div>
                  <div className="px-0" style={{ flex: 1 }}>
                    <span className="fw-light" style={{ fontSize: '22px' }}> Disponibles: {formData.disponibles}</span><br />
                    <span className="fw-light" style={{ fontSize: '22px' }}> Entradas vendidas: {formData.vendidas}</span><br />
                    <span className="fw-light" style={{ fontSize: '22px' }}> Cantidad de entradas total: {formData.max_disponibilidad}</span>

                    <div className="progress mt-3 mb-3" role="progressbar" aria-label="Basic example" aria-valuenow={formData.porcentaje_ventas} aria-valuemin="0" aria-valuemax="100">
                      <div
                        className="progress-bar"
                        style={{ width: `${formData.porcentaje_ventas}%` }}
                      >{formData.porcentaje_ventas + '%'}</div>
                    </div>

                    <button type="button" className="btn btn-outline-primary px-5 mt-3 mx-5" style={{ lineHeight: '2' }} onClick={handleEditClick}>Editar</button>

                  </div>
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
          <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center w-100 px-2 mt-3" style={{ height: '100%' }}>
            <Form.Group className="mb-3 w-100 mt-3 px-3" style={{ lineHeight: '1' }}>
              <Form.Label className="fs-4 fw-medium" style={{ color: logoColor }}>Nombre</Form.Label>
              <Form.Control style={{
    borderWidth: '2px',         
    borderColor: logoColor,       
    borderStyle: 'dotted',    
  }}
              className='fs-4 fw-light'
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1' }}>
              <Form.Label className="fs-4 fw-medium"  style={{ color: logoColor }}>Descripción</Form.Label>
              <Form.Control style={{
    borderWidth: '2px',         
    borderColor: logoColor,       
    borderStyle: 'dotted',    
  }}
                className='fs-4 fw-light'
                as="textarea"
                name="descripcion"
                rows={1}
                value={formData.descripcion}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1' }}>
              <Form.Label className="fs-4 fw-medium"  style={{ color: logoColor }}>Precio</Form.Label>
              <Form.Control style={{
    borderWidth: '2px',         
    borderColor: logoColor,       
    borderStyle: 'dotted',    
  }}
                className='fs-4 fw-light'
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1' }}>
              <Form.Label className="fs-4 fw-medium"  style={{ color: logoColor }}>Disponibles</Form.Label>
              <Form.Control
              style={{
    borderWidth: '2px',         
    borderColor: logoColor,       
    borderStyle: 'dotted',    
  }}
                className="fs-4 fw-light"
                type="number"
                name="disponibles"
                value={formData.disponibles}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex gap-2 px-3">
              <Button type="submit" variant="success" className="fs-3 fw-lighter"style={{width: '20vw', height:'7vh', borderRadius:'20px', borderColor:'transparent', backgroundColor: logoColor}}>
                Guardar
              </Button>
              <Button variant="secondary" className="fs-3 fw-lighter" style={{width: '20vw', height:'7vh', borderRadius:'20px', borderColor:'transparent'}} onClick={() => setEditMode(false)}>
                Cancelar
              </Button>
            </div>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
}
