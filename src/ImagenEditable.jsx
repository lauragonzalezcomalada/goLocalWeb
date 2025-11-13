import React, { useRef } from 'react';

function ImagenEditable({ userData }) {
  const fileInputRef = useRef(null);


  // Cuando se selecciona una nueva imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="col-md-4"
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: editMode ? 'pointer' : 'default', // solo clickable en modo edición
        position: 'relative'
      }}
      onClick={handleImageClick}
    >
      <img
        src={userData.image ? userData.image : soloCarita}
        alt="Imagen de perfil"
        style={{
          height: '500px',
          width: '500px',
          objectFit: userData.image ? 'cover' : 'scale-down',
          borderRadius: '500px',
          border: '7px solid ' + logoColor,
          transition: '0.3s ease-in-out',
          filter: editMode ? 'brightness(0.9)' : 'none'
        }}
      />

      {/* input oculto */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />

      {/* Overlay opcional con texto */}
      {editMode && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '20px',
            fontSize: '1.1rem'
          }}
        >
          Cambiar imagen
        </div>
      )}
    </div>
  );
}

export default ImagenEditable;
