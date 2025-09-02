import React, { useState } from 'react';

export default function CreadorEntradas({ onGuardar }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    cantidad: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCancel = () => {
    if (onCancel) {
      onCancel(index);
    }
  };


  const handleAceptar = () => {
    if (formData.nombre && formData.descripcion && formData.precio && formData.cantidad) {
      onGuardar(formData); // Enviamos al padre
      setFormData({ nombre: '', precio: '', cantidad: '' }); // Limpiar si querés
    } else {
      alert('Completá todos los campos');
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
        name="nombre"
        placeholder="Nombre de la entrada"
        value={formData.nombre}
        onChange={handleChange}
        className="form-control mb-2 fw-light fs-5"
      />
       <input
        type="text"
        name="descripcion"
        placeholder="Descripción"
        value={formData.descripcion}
        onChange={handleChange}
        className="form-control mb-2 fw-light fs-5"
      />
      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={formData.precio}
        onChange={handleChange}
        className="form-control mb-2 fw-light fs-5"
      />
      <input
        type="number"
        name="cantidad"
        placeholder="Cantidad"
        value={formData.cantidad}
        onChange={handleChange}
        className="form-control mb-3 fw-light fs-5"
      />
    <div style={{ display: 'flex', direction:"row", justifyContent: 'space-between', gap: '1rem', marginLeft:'3rem', marginRight:'3rem' }}>
      <button  
        type="button"
        className="btn btn-success fw-light fs-5"
        onClick={handleAceptar}
        style={{ padding: '0.5rem 2rem', borderRadius: '20px', border: '0px',backgroundColor:'#FA7239' }}
      >
        Aceptar
      </button>
      <button
        type="button"
        className="btn btn-secondary fw-light fs-5"
        onClick={handleCancel}
        style={{ padding: '0.5rem 2rem', borderRadius: '20px', border: '0px', backgroundColor:'#491a13b3' }}
      >
        Cancelar
      </button>
      </div>
    </div>
  );
}
