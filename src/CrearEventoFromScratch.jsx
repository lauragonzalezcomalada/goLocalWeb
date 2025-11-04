


import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, backgroundColor, logoColor, orangeColor, orangeColorLight, cardColor } from './constants.js'
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

import ojitos_gif from './assets/ojitos.gif';
import soloCarita from './assets/solocarita.png';

export default function CrearEventoFromScratch() {

    const [isLoading, setIsLoading] = useState(false);

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
        imagen: null,
        aLaGorra: null,
        recommendedAmount: ''
    });

    if (uuid) {
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
                    console.log('data: ', data)
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
                        tipoEvento: data.tipoEvento.toString(),
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

                    if (data?.values?.reservas_forms?.length > 0) {
                        const nuevasReservas = data.values.reservas_forms.map((reserva_form) => ({
                            tipoReserva: reserva_form.tipoReserva,
                            cantidad: reserva_form.cantidad,
                            campos: reserva_form.campos?.map(campo => ({
                                uuid: campo.uuid,
                                label: campo.label
                            })) || []

                        }));

                        setReservas(nuevasReservas);
                    }
                    if (data?.values?.entradas_for_event?.length > 0) {
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

        if (name === 'tipoEvento' && value !== '0') {
            setEsGratis(true);
        }
        if (name === 'tipoEvento' && value === '2') {
            setNecesitaReserva(false);
        }
    }

    const handleEsGratisChange = (e) => {

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
        if (formData.tipoEvento === '1' && !formData.endTime) newErrors.endTime = 'Campo obligatorio';
        if (esGratis === null) newErrors.gratis = 'Campo obligatorio';
        if (esGratis === true && formData.aLaGorra === null) newErrors.aLaGorra = 'Campo obligatorio';
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
        console.log('new erors:', newErrors);

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
        formDataToSend.append('desc', formData.descripcion);
        formDataToSend.append('startDateandtime', `${formData.fecha}T${formData.startTime}`);
        formDataToSend.append('gratis', esGratis);
        formDataToSend.append('reserva', necesitaReserva);
        formDataToSend.append('centralizarEntradas', centralizarEntradas);
        formDataToSend.append('urlCompraEntradas', formData.urlCompraEntradas);
        formDataToSend.append('lat', ubicacion.lat);
        formDataToSend.append('lng', ubicacion.lng);
        formDataToSend.append('direccion', ubicacion.direccion);
        formDataToSend.append('aLaGorra', formData.aLaGorra);

        if (formData.recommendedAmount !== '' && formData.recommendedAmount !== null && formData.recommendedAmount !== undefined) {
            formDataToSend.append('recommendedAmount', formData.recommendedAmount);
        }


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
        try {

            setIsLoading(true);
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

                const newAccessToken = await refreshTokenIfNeeded()
                if (!newAccessToken) return

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
        } finally {
            setIsLoading(false);
        }


        if (createTemplate === true) {
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
                setIsLoading(true)
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
                    if (!newAccessToken) {
                        console.log('no se puede referscar el token');
                        return;
                    } // no se pudo refrescar

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
            } finally {
                setIsLoading(false);
            }
        }

        if (response.status === 201) {
            navigate('/eventDetail', { state: { uuid: result['uuid'], tipo: Number(formData.tipoEvento) } })
        }
    };


    return <div style={{ backgroundColor: backgroundColor, paddingTop: '56px', width: '100%', paddingBottom: '5vh', marginRight: '5vw', height: 'calc(100vh-56px)' }}>
        <Form /* onSubmit={handleSubmit} */ className="d-flex align-items-center w-100 px-0 mt-3 g-0" style={{ height: '100%' }}>
            <div className="w-50 " style={{ marginLeft: '5vw', paddingTop: '50px' }}>
                <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row' }}>
                    <Form.Label className='fs-4' style={{ color: logoColor, fontWeight: 800 }}>¿Qué tipo de evento es?</Form.Label>
                    <Form.Select name="tipoEvento" value={formData.tipoEvento} onChange={handleChange} isInvalid={!!errors.tipoEvento} className='fs-4' style={{ color: logoColor }}>
                        <option value="">Tipo de evento</option>
                        <option value="0">Plan</option>
                        <option value="1">Promo</option>
                        <option value="2">Plan Privado</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors.tipoEvento}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px', fontWeight: 800 }}>
                    <Form.Label className='mt-2 fs-4' style={{ color: logoColor }}>Título</Form.Label>
                    <Form.Control
                        className='fs-4' style={{ color: logoColor }}
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
                    <Form.Label className='mt-2 fs-4' style={{ color: logoColor, fontWeight: 800 }}>Descripción corta</Form.Label>
                    <Form.Control
                        className='fs-4' style={{ color: logoColor }}
                        type="text"
                        name="shortDesc"
                        value={formData.shortDesc}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <Form.Label className='mt-2 fs-4' style={{ color: logoColor, fontWeight: 800 }}>Descripción del evento</Form.Label>
                    <Form.Control
                        as="textarea"
                        className='fs-4' style={{ color: logoColor }}
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
                    <Form.Label className='fs-4' style={{ color: logoColor, fontWeight: 800 }}>Fecha del evento</Form.Label>
                    <Form.Control
                        type="date"
                        name="fecha"
                        className='fs-4' style={{ color: logoColor }}
                        value={formData.fecha}
                        onChange={handleChange}
                        isInvalid={!!errors.fecha}

                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.fecha}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <Form.Label className='fs-4' style={{ color: logoColor, fontWeight: 800 }}>Hora del evento</Form.Label>
                    <Form.Control
                        type="time"
                        name="startTime"
                        className='fs-4' style={{ color: logoColor }}
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
                        <Form.Label className='fs-4' style={{ color: logoColor, fontWeight: 800 }}>Hora de fin de la promo</Form.Label>
                        <Form.Control type="time" name="endTime" value={formData.endTime} className='fs-4' style={{ color: logoColor }} onChange={handleChange} isInvalid={!!errors.endTime} />
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
                            size="xl"

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
                            id="switchCheckDefault" style={{ fontSize: '25px', backgroundColor: orangeColor, borderColor: 'transparent' }}

                            checked={createTemplate}
                            onChange={handleCreateTemplateChange}
                        />
                        <label className="form-check-label fs-4" htmlFor="switchCheckDefault" style={{ color: logoColor }}>Crear plantilla de este evento</label>
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
                    <Form.Label className="fs-4" style={{ color: logoColor, fontWeight: 800 }}>Subí una imagen</Form.Label>
                    <Form.Control
                        type="file"
                        name="imagen"
                        className='fs-5' style={{ backgroundColor: backgroundColor, color: logoColor, maxWidth: '300px' }}

                        onChange={(e) =>
                            setFormData({ ...formData, imagen: e.target.files[0] })
                        }

                    />
                </Form.Group>
                {formData.tipoEvento === '0' && (
                    <Form.Group className="mb-3 w-100 mt-3 px-3" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                        <Form.Label className='mt-2 fs-4' style={{ color: logoColor, fontWeight: 800 }}>¿Es gratis o a la gorra?</Form.Label>
                        <div className="d-flex gap-5 align-items-center">
                            <Form.Check
                                type="radio"
                                label={<span className="fs-4" style={{ marginLeft: '10px', paddingTop: '3rem', color: logoColor }}>SÍ</span>}
                                name="gratis"
                                value="si"
                                checked={esGratis === true}
                                onChange={handleEsGratisChange}
                                isInvalid={!!errors.gratis}
                            />
                            <Form.Check
                                type="radio"
                                label={<span className="fs-4" style={{ marginLeft: '20px', paddingTop: '3rem', color: logoColor }}>NO</span>}
                                name="gratis"
                                value="pago"
                                checked={esGratis === false}

                                onChange={handleEsGratisChange}
                                isInvalid={!!errors.gratis}
                            />

                        </div>
                        {errors.gratis && (
                            <Form.Control.Feedback
                                type="invalid"
                                style={{ display: 'block', fontSize: '0.9rem' , marginLeft:'1rem'}}
                            >
                                {errors.gratis}
                            </Form.Control.Feedback>
                        )}

                    </Form.Group>)}
                {formData.tipoEvento === '0' && esGratis === true && (
                    <Form.Group className="mb-3 w-100 mt-3 px-3" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px', alignItems:'center' }}>
                        <Form.Label className='mt-2 fs-4' style={{ color: logoColor, fontWeight: 800 }}>¿A la gorra?</Form.Label>
                        <div className="d-flex gap-5 align-items-center">
                            <Form.Check
                                type="radio"
                                label={<span className="fs-4" style={{ marginLeft: '10px', paddingTop: '3rem', color: logoColor }}>SÍ</span>}
                                name="aLaGorra"
                                value='true'
                                checked={formData.aLaGorra === 'true'}
                                onChange={handleChange}
                                isInvalid={!!errors.aLaGorra}
                            />
                            <Form.Check
                                type="radio"
                                label={<span className="fs-4" style={{ marginLeft: '20px', paddingTop: '3rem', color: logoColor }}>NO</span>}
                                name="aLaGorra"
                                value="false"
                                checked={formData.aLaGorra === 'false'}
                                onChange={handleChange}
                                isInvalid={!!errors.aLaGorra}
                            />

                        </div>
                        {errors.aLaGorra && (
                            <Form.Control.Feedback
                                type="invalid"
                                style={{ display: 'block', fontSize: '0.9rem' , marginLeft:'1rem'}}
                            >
                                {errors.aLaGorra}
                            </Form.Control.Feedback>
                        )}

                    </Form.Group>)}
                {formData.tipoEvento === '0' && esGratis === true && formData.aLaGorra == 'true' && (
                    <Form.Group className="mb-3 px-3 w-100" style={{ lineHeight: '1', display: 'flex', justifyContent:'space-between', gap: '20px', fontWeight: 800 }}>
                        <Form.Label className='mt-2 fs-4' style={{ color: logoColor }}>¿Algún valor recomendado?</Form.Label>
                        <Form.Control
                            className='fs-4' style={{ color: logoColor , width: '20vw'}}
                            type="number"
                            name="recommendedAmount"
                            value={formData.recommendedAmount}
                            onChange={handleChange}
                            isInvalid={!!errors.recommendedAmount}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.recommendedAmount}
                        </Form.Control.Feedback>
                    </Form.Group>

                )}



                {esGratis === true && formData.tipoEvento !== '2' && (<Form.Group className="mb-3 w-100 mt-3 px-3" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px' , alignItems:'center'}}>
                    <Form.Label className='mt-2 fs-4' style={{ fontWeight: 800, color: logoColor }}>¿Se necesita hacer una reserva?</Form.Label>
                    <div className="d-flex gap-5 align-items-center">
                        <Form.Check
                            type="radio"
                            label={<span className="fs-4" style={{ marginLeft: '20px', color: logoColor }}>SÍ</span>}
                            name="reserva"
                            value="conReserva"
                            checked={necesitaReserva === true}
                            onChange={handleReservaChange}
                            isInvalid={!!errors.necesitaReserva}
                        />
                        <Form.Check
                            type="radio"
                            label={<span className="fs-4" style={{ marginLeft: '20px', color: logoColor }}>NO</span>}
                            name="reseva"
                            value="sinReserva"
                            checked={necesitaReserva === false}
                            onChange={handleReservaChange}
                            isInvalid={!!errors.necesitaReserva}
                        />

                    </div>
                   {errors.necesitaReserva && (
                            <Form.Control.Feedback
                                type="invalid"
                                style={{ display: 'block', fontSize: '0.9rem' , marginLeft:'1rem'}}
                            >
                                {errors.necesitaReserva}
                            </Form.Control.Feedback>
                        )}
                </Form.Group>


                )}
                {esGratis === false && (<Form.Group className="mb-3 w-100 mt-3 px-3" style={{ lineHeight: '1', display: 'flex', flexDirection: 'row', gap: '20px', alignItems:'center' }}>
                    <Form.Label className='mt-2 fs-4' style={{ fontWeight: 800, color: logoColor }} >¿Quieres centralizar las entradas con GoLocal?</Form.Label>
                    <div className="d-flex gap-5 align-items-center">
                        <Form.Check
                            type="radio"
                            label={<span className="fs-4" style={{ marginLeft: '20px', color: logoColor }}>SÍ, quiero centralizar</span>}
                            name="controlarEntradas"
                            value="si"
                            checked={centralizarEntradas === true}
                            onChange={handleCentralizarEntradasChange}
                            isInvalid={!!errors.centralizarEntradas}
                        />
                        <Form.Check
                            type="radio"
                            label={<span className="fs-4" style={{ marginLeft: '20px', color: logoColor }}>NO, quiero seguir usando mi ticketera</span>}
                            name="controlarEntradas"
                            value="no"
                            checked={centralizarEntradas === false}
                            onChange={handleCentralizarEntradasChange}
                            isInvalid={!!errors.centralizarEntradas}
                        />

                    </div>
                    {errors.centralizarEntradas && (
                            <Form.Control.Feedback
                                type="invalid"
                                style={{ display: 'block', fontSize: '0.9rem' , marginLeft:'1rem'}}
                            >
                                {errors.centralizarEntradas}
                            </Form.Control.Feedback>
                        )}
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
                        className="p-3 py-3 my-1 border mx-4"
                        style={{ width: '95%', backgroundColor: orangeColorLight, borderRadius: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                    >
                        <div className="d-flex flex-column" style={{ flex: 1 }}>
                            <p className="mb-1" style={{ fontSize: '30px', fontWeight: 800, color: logoColor }}> <strong>{entrada.nombre.toUpperCase()}</strong></p>
                            <p className="mb-1" style={{ fontSize: '25px', color: logoColor, fontWeight: 300 }}>{entrada.descripcion}</p>


                        </div>

                        <span style={{ fontSize: '30px', color: logoColor, fontWeight: 300 }}>Precio: <span style={{ fontWeight: 800 }}> ${entrada.precio}</span> | Cantidad:<span style={{ fontWeight: 800 }}>  {entrada.cantidad}</span></span>
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
                            border: !!errors.entradas ? '2px solid black' : '2px solid ' + logoColor,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: '100px',
                            cursor: 'pointer',
                        }}

                    >
                        <i className="bi bi-plus-lg" style={{ color: !!errors.entradas ? 'black' : logoColor }}></i>
                        <span style={{ color: !!errors.entradas ? 'black' : logoColor, fontSize: '25px', fontWeight: 800 }}>CREAR NUEVA ENTRADA</span>

                    </div>
                )}

                {/* Formulario de nueva entrada */}
                {(centralizarEntradas === true && mostrarNuevaEntrada) && <CreadorEntradas onGuardar={guardarEntrada} />}

                {/* Lista de reservas ya creadas */}
                {reservas.map((reserva, index) => (
                    <div
                        key={index}
                        className="p-3 py-3 my-1 mx-4"
                        style={{ width: '95%', backgroundColor: orangeColorLight, borderRadius: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                    >
                        <div className="d-flex flex-column" style={{ flex: 3 }}>
                            <p className="mb-1"><span style={{ marginRight: '10px', color: logoColor, fontSize: '20px', fontWeight: 400 }}>TIPO DE RESERVA: </span><span style={{ color: logoColor, fontWeight: 800, fontSize: '30px' }}>{reserva.tipoReserva.toUpperCase()}</span></p>
                            <p className="mb-1" style={{ fontWeight: 400, fontSize: '20px', color: logoColor }}>CANTIDAD: <span style={{ color: logoColor, fontWeight: 800, fontSize: '25px' }}>{reserva.cantidad}</span></p>
                        </div>

                        <div className="d-flex flex-column" style={{ flex: 2 }}>
                            <p className="mb-1" style={{ fontWeight: 400, fontSize: '20px', color: logoColor }}>CAMPOS PERSONALIZADOS:</p>
                            <ul>
                                {reserva.campos.map((campo, idx) => (
                                    <li key={idx} style={{ fontSize: '18px', color: logoColor, fontWeight: 800 }}>
                                        {campo.label.toUpperCase()}
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
                            border: !!errors.reservas ? '2px solid black' : '2px solid ' + logoColor,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: '100px',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}

                    >
                        <i className="bi bi-plus-lg" style={{ color: !!errors.reservas ? 'black' : logoColor }}></i>
                        <span style={{ color: !!errors.reservas ? 'black' : logoColor, fontSize: '25px', fontWeight: 800 }}>CREAR NUEVO FORMULARIO DE RESERVA</span>

                    </div>
                )}
                {/* Formulario de nueva entrada */}
                {(necesitaReserva === true && mostrarNuevaReserva) && <CreadorReservas onGuardar={guardarReserva} onCancelar={cancelarReserva} />}

                {/* <div style={{marginLeft:'5vw', overflow:'hidden', borderRadius:'20px', width:'80%', border:'2px solid red', height:'35vh', display: 'flex', flexDirection:'column'}}>

                <div style={{flex:1, height:'18vh'}}>
                     {formData.imagen != null && (
                        <img src={formData.imagen} style={{width:'100%', height:'auto', boxFit:'cover', justifyContent:'center'}}></img>
                     )}
                     {formData.imagen == null && (
                        <img src={soloCarita}></img>
                     )}
                </div>
                <div style={{flex:1,backgroundColor:logoColor, height:'100% '}}>parte inferior </div>

                </div> */}

                <div
                    style={{
                        width: "80%",
                        minHeight: "22vh",
                        margin: "1rem auto",
                        display: "flex",
                        borderRadius: '20px',
                        flexDirection: "column",
                    }}
                >
                    <div style={{ position: "relative" }}>
                        <div
                            style={{
                                height: "11vh",
                                width: "100%",
                                borderTopLeftRadius: "20px",
                                borderTopRightRadius: "20px",
                                overflow: "hidden",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        ><img
                                src={
                                    formData.imagen
                                        ? typeof formData.imagen === "string"
                                            ? formData.imagen // si viene del backend (URL)
                                            : URL.createObjectURL(formData.imagen) // si es File recién cargado
                                        : soloCarita // fallback por defecto
                                }
                                alt="plan"
                                style={{
                                    width: formData.imagen
                                        ? "100%" : 'auto',
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                    alignSelf: 'center'
                                }}
                            />

                        </div>

                        {/* Etiqueta “GRATIS” */}
                        {esGratis && formData.tipoEvento !== "2" && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    padding: "2px 8px",
                                    backgroundColor: "rgba(255,255,255,0.7)",
                                    border: `2px solid ${logoColor}`,
                                    borderRadius: "12px",
                                }}
                            >
                                <span style={{ fontSize: "15px" }}>GRATIS</span>
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            backgroundColor: cardColor,
                            borderBottomLeftRadius: "20px",
                            borderBottomRightRadius: "20px",
                            minHeight: "11vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "8px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >


                            {formData.fecha ? (
                                <div
                                    style={{
                                        width: "70px",
                                        height: "90px",
                                        borderRadius: "16px",
                                        backgroundColor: "rgba(0,0,0,0.5)",
                                        color: "white",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: "8px",
                                        lineHeight: 1,
                                    }}
                                >
                                    <span style={{ fontSize: "30px", fontWeight: 500 }}>
                                        {new Date(`${formData.fecha}T${formData.startTime || new Date().toTimeString().slice(0, 5)}:00`).toLocaleDateString("es-AR", {
                                            day: "2-digit",
                                        })}
                                    </span>
                                    <span style={{ fontSize: "20px", fontWeight: 600 }}>
                                        {new Date(`${formData.fecha}T${formData.startTime || new Date().toTimeString().slice(0, 5)}:00`).toLocaleDateString("es-AR", {
                                            month: "short",
                                        }).toUpperCase()}
                                    </span>
                                    <span style={{ fontSize: "20px", fontWeight: 600 }}>
                                        {new Date(`${formData.fecha}T${formData.startTime || new Date().toTimeString().slice(0, 5)}:00`).toLocaleTimeString("es-AR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false
                                        })}
                                    </span>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        width: "70px",
                                        height: "90px",
                                        borderRadius: "16px",
                                        backgroundColor: "rgba(0,0,0,0.5)",
                                        color: "white",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: "8px",
                                        lineHeight: 1,
                                    }}
                                >
                                    <span style={{ fontSize: "30px" }}>DIA</span>
                                    <span style={{ fontSize: "20px" }}>MES</span>
                                    <span style={{ fontSize: "20px" }}>HORA</span>
                                </div>
                            )}

                            {/* 📝 Texto del plan */}
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontSize: "25px",
                                        fontWeight: 700,
                                        overflowWrap: "break-word",
                                    }}
                                >
                                    {formData.titulo || "Título del plan"}
                                </div>
                                <div style={{ fontSize: "20px", fontWeight: 400 }}>
                                    {formData.shortDesc || "Descripción breve"}
                                </div>

                                {selectedTags && selectedTags.length > 0 && (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "4px",
                                            marginTop: "5px",
                                        }}
                                    >
                                        {tags
                                            ?.filter((tag) => selectedTags.includes(tag.id))
                                            .map((tag, i) => (
                                                <div
                                                    key={i}
                                                    style={{
                                                        padding: "2px 6px",
                                                        backgroundColor: "rgba(255,255,255,0.8)",
                                                        border: `1.5px solid ${logoColor}`,
                                                        borderRadius: "10px",
                                                        fontSize: "12px",
                                                        color: logoColor,
                                                    }}
                                                >
                                                    {tag.name}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <button className='mt-3' onClick={submitCrearEvento} style={{ padding: '1rem 2rem', borderRadius: '20px', width: 'window.innerWidth * 0.80', height: '5rem', position: 'absolute', right: '25px', backgroundColor: logoColor, fontSize: '40px', fontWeight: 300, display: 'flex', color: backgroundColor, justifyContent: 'center', alignItems: 'center' }} type="submit">
                    CREAR TU EVENTO
                </button>


            </div>


        </Form >
        {isLoading && (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999
                }}
            >
                <img src={ojitos_gif} style={{ width: '150px', height: '150px' }} />
            </div>
        )
        }

    </div >;
}