import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { logoColor } from "./constants";

const MapaDesdeBackend = ({ lat, long, direccion }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY, // 👈 asegúrate de tener tu API key aquí
  });

  const abrirEnMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
    window.open(url, "_blank"); // abre en la app o navegador
  };

  if (loadError) return <div>Error cargando el mapa</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  const partes = direccion.split(",");
  const direccionCorta = partes.slice(0, partes.length - 1).join(",");

  const containerStyle = {
    width: "100%",
    height: "200px",
    borderRadius: "12px",
    overflow: "hidden",
  };

  const center = { lat, lng: long };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px"}}>
      <div style={containerStyle}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
        >
          <Marker
            position={center}
            title="Lugar"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
            }}
          />
        </GoogleMap>
      </div>

      <button
        onClick={abrirEnMaps}
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          color: logoColor,
          fontWeight: 800,
          fontSize: "25px",
          textAlign: "left",
        }}
      >
        {direccionCorta}
      </button>
    </div>
  );
};

export default MapaDesdeBackend;
