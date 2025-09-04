


import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from './constants.js'
import { useState, useEffect } from 'react'
import WeekCalendar from './WeekCalendar.jsx'
import { useContext } from 'react'
import { AuthContext } from './AuthContext.jsx'
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import CreadorEntradas from './CreadorEntradas.jsx';
import CreadorReservas from './CreadorReservas.jsx';
import LocationSearch from './LocationSearch.jsx';
import { Card, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import TagChip from './TagChip.jsx';
import { useLocation } from 'react-router-dom';


export default function CrearEventoFromScratch() {

    const navigate = useNavigate()
    const location = useLocation();
    const uuid = location.state?.uuid;
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [esGratis, setEsGratis] = useState(null);
    const [necesitaReserva, setNecesitaReserva] = useState(null);
    const [centralizarEntradas, setCentralizarEntradas] = useState(null);
    const { accessToken, refreshTokenIfNeeded, setAccessToken } = useContext(AuthContext)
    const [entradas, setEntradas] = useState([]);
    const [mostrarNuevaEntrada, setMostrarNuevaEntrada] = useState(false);

    const [reservas, setReservas] = useState([]);
    const [mostrarNuevaReserva, setMostrarNuevaReserva] = useState(false);
    const [ubicacion, setUbicacion] = useState({ direccion: '', lat: '', lng: '' });

    const [errors, setErrors] = useState({});
    const [createTemplate, setCreateTemplate] = useState(false);


   /* const [freePlanes, setFreePlanes] = useState(0);
    const [showModalFreePlanes, setShowModalFreePlanes] = useState(false); */
/*

    useEffect(() => {

        if (!accessToken) return

        const fetchUserProfileAvailableFreePlans = async () => {
            try {
                var response = await fetch(API_BASE_URL + '/available_free_plans/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                var data = await response.json();
                if (response.status === 401) {
                    console.log('response status = 401');
                    // intentamos refrescar
                    const newAccessToken = await refreshTokenIfNeeded();
                    if (!newAccessToken) return; // no se pudo refrescar

                    // reintentamos con token nuevo
                    response = await fetch(`${API_BASE_URL}/available_free_plans/`, {
                        headers: {
                            Authorization: `Bearer ${newAccessToken}`
                        }
                    });
                    if (response.ok) {
                        data = await response.json();
                    }
                }
                setFreePlanes(data);
                // Aquí puedes usar data si lo necesitas, por ejemplo:
                // setFreePlanes(data.free_planes);
            } catch (e) {
                console.error('Error fetching available free plans', e);
            }
        };

        fetchUserProfileAvailableFreePlans();
    }, [accessToken]);
 */

    const handleCreateTemplateChange = (e) => {
        setCreateTemplate(e.target.checked);
    };

    const [formData, setFormData] = useState({
        tipoEvento: '',
        titulo: '',
        shortDesc: '',
        descripcion: '',
        fecha: '',
        startTime: '',
        endTime: '',
        urlCompraEntradas: '',
        imagen: null, // Para manejar la imagen subida
    });

    if (uuid) {
        console.log('hi ha uuid')

        useEffect(() => {
            async function fetchTemplateValues() {

                try {
                    var response = await fetch(API_BASE_URL + '/templates/?uuid=' + uuid, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    })
                    var data = await response.json()
                    if (response.status === 401) {
                        console.log('response status = 401')
                        // intentamos refrescar
                        const newAccessToken = await refreshTokenIfNeeded()
                        if (!newAccessToken) return // no se pudo refrescar

                        // reintentamos con token nuevo
                        response = await fetch(`${API_BASE_URL}/templates/`, {
                            headers: {
                                Authorization: `Bearer ${newAccessToken}`
                            }
                        })
                        if (response.ok) {
                            data = await response.json()
                        }

                    }


                    setFormData({
                        tipoEvento: data.tipoEvento,
                        titulo: data.values.nombre,
                        shortDesc: data.values.shortDesc,
                        descripcion: data.values.descripcion,
                        startTime: data.values.startDateandtime.split('T')[1],
                        endTime: data.values.endDateadntime ? data.values.endDateandtime.split('T')[1] : null,
                        urlCompraEntradas: data.values.tickets_link,
                    })
                    setSelectedTags(data.values.tags)
                    setEsGratis(data.values.gratis)
                    setNecesitaReserva(data.values.reserva_necesaria)
                    setCentralizarEntradas(data.values.control_entradas)
                    console.log(data)
                    console.log(data?.values?.entradas_for_event)

                    if (data?.values?.reservas_forms?.length > 0) {
                        const nuevasReservas = data.values.reservas_forms.map((reserva_form) => ({
                            tipoReserva: reserva_form.nombre,
                            cantidad: reserva_form.max_disponibilidad,
                            campos: reserva_form.campos?.map(campo => ({
                                uuid: campo.uuid,
                                label: campo.label
                            })) || []

                        }));

                        setReservas(nuevasReservas);

                    }

                    if (data?.values?.entradas_for_event?.length > 0) {
                        console.log('hi ha entradaes')
                        const nuevasEntradas = data.values.entradas_for_event.map((entrada) => ({
                            nombre: entrada.nombre,
                            descripcion: entrada.descripcion,
                            precio: entrada.precio,
                            cantidad: entrada.cantidad,


                        }));

                        setEntradas(nuevasEntradas);

                    }


                    setUbicacion({ direccion: data.values.direccion, lat: parseFloat(data.values.lat.replace(',', '.')), lng: parseFloat(data.values.lng.replace(',', '.')) })

                } catch (e) {
                    console.error('Error fetching user profile', e)
                }
            }
            fetchTemplateValues()

        }, [uuid])
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({ ...prev, [name]: '' }));  // neteja errors quan sobreescrius

        if(name === 'tipoEvento' && value === '1'){
            console.log('automaticament gratis perquè es promo');
            setEsGratis(true);
        }
    };

    const handleEsGratisChange = (e) => {

        if (e.target.value === 'si' /* && freePlanes === 0*/) {
            setShowModalFreePlanes(true);
            return;
        }
        setEsGratis(e.target.value === 'si');
        setNecesitaReserva(null);
        setCentralizarEntradas(null);
        setEntradas([]);
        setMostrarNuevaEntrada(false);
        setReservas([]);
        setNecesitaReserva(null);
        setMostrarNuevaReserva(false);

    };

    const handleReservaChange = (e) => {
        setNecesitaReserva(e.target.value === 'conReserva');
    }

    const handleCentralizarEntradasChange = (e) => {
        setCentralizarEntradas(e.target.value === 'si');
        setEntradas([]);
    }

    const guardarEntrada = (nueva) => {
        setEntradas((prev) => [...prev, nueva]);
        setMostrarNuevaEntrada(false); // Oculta el form una vez guardado
    };


    const guardarReserva = (nueva) => {

        setReservas((prev) => [...prev, nueva]);
        setMostrarNuevaReserva(false); // Oculta el form una vez guardado
    }

    const cancelarReserva = () => {
        setMostrarNuevaReserva(false); // Oculta el form sin guardar
    }

    const handleRedirectToCompraBono = () => {
        setShowModalFreePlanes(false);
        navigate("/comprarBono"); // redirigir a la página de compra de bonos
    };



    useEffect(() => {

        async function fetchTags() {

            try {
                var response = await fetch(API_BASE_URL + '/tags/', {
                    method: 'GET',
                })
                var data = await response.json()
                setTags(data)
            } catch (e) {
                console.error('Error fetching tags', e)
            }
        } fetchTags()
    }, []);

    const toggleTag = (id) => {
        setSelectedTags((prev) =>
            prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]
        );
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.tipoEvento) newErrors.tipoEvento = 'Selecciona un tipo de evento';
        if (!formData.titulo) newErrors.titulo = 'Campo obligatorio';
        if (!formData.descripcion) newErrors.descripcion = 'Campo obligatorio';
        if (!formData.fecha) newErrors.fecha = 'Campo obligatorio';
        if (!formData.startTime) newErrors.startTime = 'Campo obligatorio';
        if (formData.tipoEvento === '2' && !formData.endTime) newErrors.endTime = 'Campo obligatorio';
        if (esGratis === null) newErrors.gratis = 'Campo obligatorio';
        if (esGratis === true && necesitaReserva === null) newErrors.necesitaReserva = 'Campo obligatorio';
        if (esGratis === false && centralizarEntradas === null) newErrors.centralizarEntradas = 'Campo obligatorio';
        if (esGratis === true && necesitaReserva === true && reservas.length === 0) {
            newErrors.reservas = 'Debes agregar al menos un formulario de reserva';
        }
        if (centralizarEntradas === true && entradas.length === 0) {
            newErrors.entradas = 'Debes agregar al menos una entrada';
        }
        if (esGratis === false && centralizarEntradas === false && !formData.urlCompraEntradas) {
            newErrors.urlCompraEntradas = 'Campo obligatorio';
        }
        if (ubicacion.direccion === '') newErrors.locationError = 'Campo obligatorio';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const submitCrearEvento = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        const formDataToSend = new FormData();
        formDataToSend.append('fromGoLocalWeb', true);
        formDataToSend.append('tipoEvento', formData.tipoEvento);
        formDataToSend.append('name', formData.titulo);
        formDataToSend.append('shortDesc', formData.shortDesc);
        formDataToSend.append('descripcion', formData.descripcion);
        formDataToSend.append('startDateandtime', `${formData.fecha}T${formData.startTime}`);
        formDataToSend.append('gratis', esGratis);
        formDataToSend.append('reserva', necesitaReserva);
        formDataToSend.append('centralizarEntradas', centralizarEntradas);
        formDataToSend.append('urlCompraEntradas', formData.urlCompraEntradas);
        formDataToSend.append('lat', ubicacion.lat);
        formDataToSend.append('lng', ubicacion.lng);
        formDataToSend.append('direccion', ubicacion.direccion);

        // Imagen
        if (formData.imagen) {
            formDataToSend.append('image', formData.imagen); // campo debe llamarse igual que en tu modelo/backend
        }

        if (formData.tipoEvento == '1') {// promo
            formDataToSend.append('endDateandtime', `${formData.fecha}T${formData.endTime}`);

        }

        // Campos que son listas -> serializar a string JSON
        formDataToSend.append('tags', JSON.stringify(selectedTags));
        if (centralizarEntradas) {
            formDataToSend.append('entradas', JSON.stringify(entradas));
        }
        if (necesitaReserva) {
            formDataToSend.append('reservas', JSON.stringify(reservas));
        }

        // En caso de evento tipo 1, agregar endTime
        if (formData.tipoEvento === '1') {
            formDataToSend.append('endTime', formData.endTime);
        }

        console.log('formDataToSend contents:');

        for (const [key, value] of formDataToSend.entries()) {
            console.log(key, value);
        }
        try {
            var response = await fetch(`${API_BASE_URL}/createevent/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                method: 'POST',
                body: formDataToSend,
                // NO pongas headers, fetch lo maneja con boundary de FormData
            });

            var result = await response.json();
            if (response.status === 401) {
                console.log('response status = 401')
                // intentamos refrescar
                const newAccessToken = await refreshTokenIfNeeded()
                if (!newAccessToken) return // no se pudo refrescar

                // reintentamos con token nuevo
                response = await fetch(`${API_BASE_URL}/createevent/`, {
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`
                    },
                    method: 'POST',
                    body: formDataToSend,
                })
                if (response.ok) {
                    result = await response.json()
                    console.log('Evento creado con 401:', result);
                }

            }

            if (response.error) {
                console.log('error?')

            }

        } catch (error) {
            console.error('Error al enviar:', error);
        }


        if (createTemplate === true) {
            console.log('crear una plantilla de levent')
            const formDataForTemplate = new FormData()

            const valuesJson = {
                "nombre": formData.titulo,
                "shortDesc": formData.shortDesc,
                "descripcion": formData.descripcion,
                "startDateandtime": `${formData.fecha}T${formData.startTime}`,
                "gratis": esGratis,
                "lat": ubicacion.lat.toString(),
                "lng": ubicacion.lng.toString(),
                "direccion": ubicacion.direccion,
                "reserva_necesaria": necesitaReserva,
                "control_entradas": centralizarEntradas,
                "tickets_link": formData.urlCompraEntradas,
                "tags": selectedTags,
                "entradas_for_event": entradas,
                "reservas_forms": reservas,
            }
            formDataForTemplate.append('name', formData.titulo)
            formDataForTemplate.append('tipoEvento', formData.tipoEvento)
            formDataForTemplate.append("values", JSON.stringify(valuesJson))

            try {
                var response = await fetch(`${API_BASE_URL}/templates/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    method: 'POST',
                    body: formDataForTemplate,
                    // NO pongas headers, fetch lo maneja con boundary de FormData
                });

                if (response.status === 401) {
                    console.log('response status = 401')
                    // intentamos refrescar
                    const newAccessToken = await refreshTokenIfNeeded()
                    if (!newAccessToken) return // no se pudo refrescar

                    // reintentamos con token nuevo
                    response = await fetch(`${API_BASE_URL}/templates/`, {
                        headers: {
                            Authorization: `Bearer ${newAccessToken}`
                        },
                        method: 'POST',
                        body: formDataForTemplate,
                    })
                    if (response.ok) {
                        result = await response.json()
                        console.log('Evento creado con 401:', result);
                    }
                }
                if (response.error) {
                    console.log('error?')
                }
                navigate('/eventDetail', { state: { uuid: result['uuid'], tipo: Number(formData.tipoEvento) } })



            } catch (error) {
                console.error('Error al enviar:', error);
            }
        }

        if (response.status === 201) {
            navigate('/eventDetail', { state: { uuid: result['uuid'], tipo: Number(formData.tipoEvento) } })
        }
    };


    return <div style={{/* marginTop: '56px',*/ marginTop:'56px', width: '100%', height: '100%' }}>
        <Form /* onSubmit={handleSubmit} */ className="d-flex align-items-center w-100 px-0 mt-3 g-0" style={{ height: '100%' }}>
            <div className="w-50 " style={{ marginLeft: '100px', paddingTop: '50px' }}>
                <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row' }}>
                    <Form.Label className='fw-light fs-5'>¿Qué tipo de evento es?</Form.Label>
                    <Form.Select name="tipoEvento" value={formData.tipoEvento} onChange={handleChange} isInvalid={!!errors.tipoEvento}>
                        <option value="">Tipo de evento</option>
                        <option value="0">Plan</option>
                        <option value="1">Promo</option>
                        <option value="2">Plan Privado</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors.tipoEvento}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <Form.Label className='mt-2 fw-light fs-5'>Título</Form.Label>
                    <Form.Control
                        type="text"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        isInvalid={!!errors.titulo}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.titulo}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <Form.Label className='mt-2 fw-light fs-5'>Descripción corta</Form.Label>
                    <Form.Control
                        type="text"
                        name="shortDesc"
                        value={formData.shortDesc}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <Form.Label className='mt-2 fw-light fs-5'>Descripción del evento</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="descripcion"
                        rows={6}
                        value={formData.descripcion}
                        onChange={handleChange}
                        isInvalid={!!errors.descripcion}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.descripcion}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <Form.Label className='fw-light fs-5'>Fecha del evento</Form.Label>
                    <Form.Control
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                        isInvalid={!!errors.fecha}

                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.fecha}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <Form.Label className='fw-light fs-5'>Hora del evento</Form.Label>
                    <Form.Control
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        isInvalid={!!errors.startTime}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.startTime}
                    </Form.Control.Feedback>
                </Form.Group>



                {formData.tipoEvento === '1' && (
                    <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                        <Form.Label className='fw-light fs-5'>Hora de fin de la promo</Form.Label>
                        <Form.Control type="time" name="endTime" value={formData.endTime} onChange={handleChange} isInvalid={!!errors.endTime} />
                        <Form.Control.Feedback type="invalid">
                            {errors.endTime}
                        </Form.Control.Feedback>
                    </Form.Group>
                )}

                <div className="d-flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <TagChip
                            key={tag.id}
                            icon={tag.icon}
                            name={tag.name}
                            selected={selectedTags.includes(tag.id)}
                            onClick={() => toggleTag(tag.id)}
                            size="md"

                        />
                    ))}
                </div>

            </div>


            <div className="w-50 p-3" >
                {/* Formulario columna 2 */}

                <div style={{ width: '100%', display: 'flex', flexDirecion: 'row', alignItems: 'end' }}>
                    <div className="form-check form-switch" style={{ position: 'absolute', right: '2rem' }}>
                        <input className="form-check-input"
                            type="checkbox" role="switch"
                            id="switchCheckDefault" style={{ fontSize: '22px' }}

                            checked={createTemplate}
                            onChange={handleCreateTemplateChange}
                        />
                        <label className="form-check-label fw-light fs-5" htmlFor="switchCheckDefault">Crear plantilla de este evento</label>
                    </div>
                </div>


                <LocationSearch dir={ubicacion.direccion || ''}
                    onUbicacionSeleccionada={setUbicacion} errorPlace={errors.locationError} />

                <Form.Group
                    className="mb-3 px-3 w-100"
                    style={{
                        lineHeight: '1',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '20px',
                        alignItems: 'center',
                    }}
                >
                    <Form.Label className="fw-light fs-5">Subí una imagen</Form.Label>
                    <Form.Control
                        type="file"
                        name="imagen"

                        onChange={(e) =>
                            setFormData({ ...formData, imagen: e.target.files[0] })
                        }
                        style={{ maxWidth: '300px' }} // opcional, para que no se agrande mucho
                    />
                </Form.Group>
                {formData.tipoEvento === '0' && (
                <Form.Group className="mb-3 w-100 mt-3 px-3" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <Form.Label className='mt-2 fw-light fs-5'>¿Es gratis?</Form.Label>
                    <div className="d-flex gap-5 align-items-center">
                        <Form.Check
                            type="radio"
                            label={<span className="fw-light fs-5" style={{ marginLeft: '10px', paddingTop: '3rem' }}>sí</span>}
                            name="gratis"
                            value="si"
                            checked={esGratis === true}
                            onChange={handleEsGratisChange}
                            isInvalid={!!errors.gratis}
                        />
                        <Form.Check
                            type="radio"
                            label={<span className="fw-light fs-5" style={{ marginLeft: '20px', paddingTop: '3rem' }}>no</span>}
                            name="gratis"
                            value="pago"
                            checked={esGratis === false}
                            onChange={handleEsGratisChange}
                            isInvalid={!!errors.gratis}
                        />

                    </div>
                    <Form.Control.Feedback type="invalid">
                        {errors.gratis}
                    </Form.Control.Feedback>

                </Form.Group>)}

                {esGratis === true && formData.tipoEvento !== '2' && (  <Form.Group className="mb-3 w-100 mt-3 px-3" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <Form.Label className='mt-2 fw-light fs-5'>¿Se necesita hacer una reserva?</Form.Label>
                    <div className="d-flex gap-5 align-items-center">
                        <Form.Check
                            type="radio"
                                label={<span className="fw-light fs-5" style={{ marginLeft: '20px' }}>sí</span>}
                                name="reserva"
                                value="conReserva"
                                checked={necesitaReserva === true}
                                onChange={handleReservaChange}
                                isInvalid={!!errors.necesitaReserva}
                            />
                            <Form.Check
                                type="radio"
                                label={<span className="fw-light fs-5" style={{ marginLeft: '20px' }}>no</span>}
                                name="reseva"
                                value="sinReserva"
                                checked={necesitaReserva === false}
                                onChange={handleReservaChange}
                                isInvalid={!!errors.necesitaReserva}
                            />

                        </div>
                        <Form.Control.Feedback type="invalid">
                            {errors.necesitaReserva}
                        </Form.Control.Feedback>
                    </Form.Group>


                )}
                {esGratis === false && (<Form.Group className="mb-3 w-100 mt-3 px-3" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <Form.Label className='mt-2 fw-light fs-5' >¿Quieres centralizar las entradas con GoLocal?</Form.Label>
                    <div className="d-flex gap-5 align-items-center">
                        <Form.Check
                            type="radio"
                            label={<span className="fw-light fs-5" style={{ marginLeft: '20px' }}>Sí, quiero centralizar</span>}
                            name="controlarEntradas"
                            value="si"
                            checked={centralizarEntradas === true}
                            onChange={handleCentralizarEntradasChange}
                            isInvalid={!!errors.centralizarEntradas}
                        />
                        <Form.Check
                            type="radio"
                            label={<span className="fw-light fs-5" style={{ marginLeft: '20px' }}>Quiero seguir usando mi ticketera</span>}
                            name="controlarEntradas"
                            value="no"
                            checked={centralizarEntradas === false}
                            onChange={handleCentralizarEntradasChange}
                            isInvalid={!!errors.centralizarEntradas}
                        />

                    </div>
                    <Form.Control.Feedback type="invalid">
                        {errors.centralizarEntradas}
                    </Form.Control.Feedback>
                </Form.Group>)}

                {centralizarEntradas === false && (

                    <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                        <Form.Label className='mt-2 fw-light fs-5' >¿Donde se pueden comprar las entradas?</Form.Label>
                        <Form.Control
                            type="text"
                            name="urlCompraEntradas"
                            value={formData.urlCompraEntradas}
                            onChange={handleChange}
                            isInvalid={!!errors.urlCompraEntradas}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.urlCompraEntradas}
                        </Form.Control.Feedback>
                    </Form.Group>

                )}



                {/* Lista de entradas ya creadas */}
                {entradas.map((entrada, index) => (
                    <div
                        key={index}
                        className="p-3 py-3 my-1 border rounded mx-4"
                        style={{ width: '95%', backgroundColor: '#FA7239', borderRadius: '50px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                    >
                        <div className="d-flex flex-column" style={{ flex: 1 }}>
                            <p className="mb-1 fs-4"><strong>{entrada.nombre}</strong></p>
                            <p className="mb-1 fw-light fs-6">{entrada.descripcion}</p>


                        </div>

                        <span className='fw-light fs-5'>Precio: ${entrada.precio} | Cantidad: {entrada.cantidad}</span>
                    </div>
                ))}

                {/* Botón para mostrar nuevo form */}
                {(centralizarEntradas === true && !mostrarNuevaEntrada) && (
                    <div
                        onClick={() => setMostrarNuevaEntrada(true)}
                        style={{
                            width: '80%',
                            height: '5rem',
                            lineHeight: '1.3',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            borderRadius: '10px',
                            border: !!errors.entradas ? '2px solid rgba(255, 0, 0, 0.5)' : '2px solid rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: '100px',
                            cursor: 'pointer',
                        }}

                    >
                        <i className="bi bi-plus-lg" style={{ color: !!errors.entradas ? 'rgba(255, 0, 0,1)' : 'inherit' }}></i>
                        <span style={{ color: !!errors.entradas ? 'rgba(255, 0, 0, 1)' : 'inherit' }}>Crear nueva entrada</span>

                    </div>
                )}

                {/* Formulario de nueva entrada */}
                {(centralizarEntradas === true && mostrarNuevaEntrada) && <CreadorEntradas onGuardar={guardarEntrada} />}

                {/* Lista de reservas ya creadas */}
                {reservas.map((reserva, index) => (
                    <div
                        key={index}
                        className="p-3 py-3 my-1 border rounded mx-4"
                        style={{ width: '95%', backgroundColor: '#FA7239', borderRadius: '50px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                    >
                        <div className="d-flex flex-column" style={{ flex: 3 }}>
                            <p className="mb-1 fs-4"><span className='fw-lighter fs-5' style={{ marginRight: '10px' }}>tipo de reserva: </span><strong>{reserva.tipoReserva}</strong></p>
                            <p className="mb-1 fw-lighter fs-5">cantidad: <span className='fw-light'>{reserva.cantidad}</span></p>
                        </div>

                        <div className="d-flex flex-column" style={{ flex: 2 }}>
                            <p className="mb-1 fw-light fs-6">Campos personalizados:</p>
                            <ul>
                                {reserva.campos.map((campo, idx) => (
                                    <li key={idx}>
                                        {campo.label}
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                ))}
    {/*
                <Modal show={showModalFreePlanes} onHide={() => setShowModalFreePlanes(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title> 😔 Sin planes gratuitos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Te quedaste sin más planes gratuitos para crear. <br />Compra un bono para continuar.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModalFreePlanes(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleRedirectToCompraBono}>
                            Comprar bono
                        </Button>
                    </Modal.Footer>
                </Modal> */}


                {/* Formulario de nueva reserva */}
                {(necesitaReserva && !mostrarNuevaReserva) && (
                    <div
                        onClick={() => setMostrarNuevaReserva(true)}
                        style={{
                            width: '80%',
                            height: '5rem',
                            lineHeight: '1.3',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            borderRadius: '10px',
                            border: !!errors.reservas ? '2px solid rgba(255, 0, 0, 0.5)' : '2px solid rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: '100px',
                            cursor: 'pointer',
                            marginTop:'1rem'
                        }}

                    >
                        <i className="bi bi-plus-lg" style={{ color: !!errors.reservas ? 'rgba(255, 0, 0, 1)' : 'inherit' }}></i>
                        <span style={{ color: !!errors.reservas ? 'rgba(255, 0, 0, 1)' : 'inherit' }}>Crear nuevo formulario de reserva</span>

                    </div>
                )}
                {/* Formulario de nueva entrada */}
                {(necesitaReserva === true && mostrarNuevaReserva) && <CreadorReservas onGuardar={guardarReserva} onCancelar={cancelarReserva} />}


                <button className='mt-3' onClick={submitCrearEvento} style={{ padding: '1rem 2rem', borderRadius: '20px', width:'window.innerWidth * 0.80', height:'5rem', position: 'absolute', right: '25px', backgroundColor:'#FA7239', fontSize:'50px', fontWeight:'lighter', display:'flex', justifyContent:'center', alignItems:'center' }} type="submit">
                    Crear tu evento
                </button>


            </div>


        </Form>

    </div>;
}