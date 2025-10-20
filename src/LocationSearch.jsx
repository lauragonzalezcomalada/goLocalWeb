import React, { useState, useRef, useEffect } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { Form, Spinner } from 'react-bootstrap';
import { logoColor } from './constants';

const libraries = ['places'];

export default function LocationSearch({ dir, onUbicacionSeleccionada, errorPlace }) {
   
    const [direccion, setDireccion] = useState('');
    const autocompleteRef = useRef(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        libraries,
    });

    useEffect(() => {
        if (dir && dir !== direccion) {
            setDireccion(dir);
        }
    }, [dir]);
    const onPlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const nombreDireccion = place.formatted_address;

            setDireccion(nombreDireccion);
            onUbicacionSeleccionada({ direccion: nombreDireccion, lat, lng });
        }
    };

    if (loadError) return <div>Error cargando Google Maps</div>;
    if (!isLoaded) return <div><Spinner animation="border" /> Cargando mapa...</div>;

    return (
        <Form.Group className="mb-3 px-3 w-100">
            <Form.Label className="fs-4" style={{color:logoColor, fontWeight:800}}>Ubicación del evento</Form.Label>
            <Autocomplete
                onLoad={(ref) => (autocompleteRef.current = ref)}
                onPlaceChanged={onPlaceChanged}
            >
                <Form.Control
                    type="text"
                    placeholder="Buscar dirección..."
                    className='fs-4' style={{color:logoColor}}
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    isInvalid={!!errorPlace}
                />
            </Autocomplete>
        </Form.Group>
    );
}
