import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from './constants.js'
import { useState, useEffect } from 'react'
import WeekCalendar from './WeekCalendar.jsx'
import { Container, Form, Offcanvas, ListGroup, Toast, ToastContainer, InputGroup, ProgressBar } from 'react-bootstrap';
import { useContext } from 'react'
import { AuthContext } from './AuthContext.jsx'
import { format, intlFormat, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Input } from 'postcss';
import { Doughnut } from "react-chartjs-2";

import { shortFormatDate } from './helpers.js'


import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, ChartTooltip, Legend);


import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";



export default function ProfileScreen() {

    const { accessToken, refreshTokenIfNeeded, setAccessToken, logout } = useContext(AuthContext)
    const [infoDisplay, setInfoDisplay] = useState("0")
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate()


    let content;

    let currentMonth = shortFormatDate();

    const value = 6; // lo que llega del backend
    const max = 12;  // lo que llega del backend
    const markValue = 10; // marca fija

    const valuePercent = (value / max) * 100;
    const markPercent = (markValue / max) * 100;


    //const monthData =  new shortFormatDate();
    //Información general
    const [userData, setUserData] = useState({ "username": "", "location": "", "bio": "", "telefono": "", "email": "" })
    const [editMode, setEditMode] = useState(false);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    //Contrasenya 
    const [formDataPwd, setFormDataPwd] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [toast, setToast] = useState({
        show: false,
        message: '',
        bg: 'success'
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });


    //Billing info
    const [billingInfo, setBillingInfo] = useState(null)

    /* const dataChartNoCentralizados = {
         labels: ["0-24.999", "25.000-49.999", "50.000-99.999", "100.000+"],
         datasets: [
             {
                 label: "Eventos",
                 data: [
                     billingInfo?.sin_centralizar.por_rango["0-24999"],
                     billingInfo?.sin_centralizar.por_rango["25-49999"],
                     billingInfo?.sin_centralizar.por_rango["50000-99999"],
                     billingInfo?.sin_centralizar.por_rango["100+"],
                 ],
                 backgroundColor: ["#4e79a7", "#f28e2b", "#e15759", "#87e157ff"], // colores de los "cachos"
                 borderWidth: 1,
                 extraCostos: [
                     Number(billingInfo?.sin_centralizar_costos["0-24999"]).toLocaleString('es-AR'),
                     Number(billingInfo?.sin_centralizar_costos["25-49999"]).toLocaleString('es-AR'),
                     Number(billingInfo?.sin_centralizar_costos["50000-99999"]).toLocaleString('es-AR'),
                     Number(billingInfo?.sin_centralizar_costos["100"]).toLocaleString('es-AR'),
                 ],
                 costosTotalesPorRango: [
                     Number(billingInfo?.sin_centralizar_costos_por_rango["0-24999"]).toLocaleString('es-AR'),
                     Number(billingInfo?.sin_centralizar_costos_por_rango["25-49999"]).toLocaleString('es-AR'),
                     Number(billingInfo?.sin_centralizar_costos_por_rango["50000-99999"]).toLocaleString('es-AR'),
                     Number(billingInfo?.sin_centralizar_costos_por_rango["100"]).toLocaleString('es-AR'),
                 ]
             },
         ],
     };*/
    const handleChangePwd = (e) => {
        setFormDataPwd({ ...formDataPwd, [e.target.name]: e.target.value });
    };
    const toggleShowPassword = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmitPwdChange = async (e) => {
        e.preventDefault();

        try {
            var body = JSON.stringify({ current_pwd: formDataPwd.current_password, new_pwd: formDataPwd.new_password, confirm_pwd: formDataPwd.confirm_password })
            var response = await fetch(API_BASE_URL + '/update_pwd/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: body
            })
            if (response.status === 401) {
                // intentamos refrescar
                const newAccessToken = await refreshTokenIfNeeded()
                if (!newAccessToken) return // no se pudo refrescar

                // reintentamos con token nuevo
                response = await fetch(API_BASE_URL + '/update_pwd/', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ current_pwd: formDataPwd.current_password, new_pwd: formDataPwd.new_password, confirm_pwd: formDataPwd.confirm_password })
                })


            }
            if (response.ok) {
                setToast({ show: true, message: 'Contraseña actualizada correctamente!', bg: 'success' });
                setFormDataPwd({ current_password: "", new_password: "", confirm_password: "" });
            }

            else if (!response.ok) {
                setToast({
                    show: true,
                    message: error.response?.data?.error || 'Error al cambiar contraseña.',
                    bg: 'danger'
                });
            }

        } catch (error) {
            setToast({
                show: true,
                message: error.response?.data?.error || 'Error al cambiar contraseña.',
                bg: 'danger'
            });

        }
    }

    const handleCloseMenu = () => setShowMenu(false);
    const handleShowMenu = () => setShowMenu(true);

    function manageContentDisplay(value) {
        setInfoDisplay(value);
        handleCloseMenu();
    }

    useEffect(() => {
        if (!accessToken) return
        async function fetchUserProfile() {
            try {
                var response = await fetch(API_BASE_URL + '/user/profile/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })

                var data = await response.json()

                if (response.status === 401) {
                    console.log('response status = 401')
                    // intentamos refrescar
                    const newAccessToken = await refreshTokenIfNeeded()
                    if (!newAccessToken) return // no se pudo refrescar

                    // reintentamos con token nuevo
                    response = await fetch(`${API_BASE_URL}/user/profile/`, {
                        headers: {
                            Authorization: `Bearer ${newAccessToken}`
                        }
                    })
                    if (response.ok) {
                        data = await response.json()
                    }


                }


                // if (!response.ok) throw new Error('No autorizado o error')
                setUserData(data)  // Guarda el perfil en el estado
            } catch (e) {

                console.error('Error fetching user profile', e)
            }
        }
        fetchUserProfile()
    }, [accessToken])

    useEffect(() => {
        async function trackBillingStatus() {
            console.log('dins del get events')
            try {
                var response = await fetch(API_BASE_URL + '/billing_status/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                })

                var data = await response.json()

                if (response.status === 401) {
                    console.log('response status = 401')
                    // intentamos refrescar
                    const newAccessToken = await refreshTokenIfNeeded()
                    if (!newAccessToken) return // no se pudo refrescar

                    // reintentamos con token nuevo
                    response = await fetch(API_BASE_URL + '/events_for_the_week/?date=' + fechaISO, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        }
                    })
                    if (response.ok) {
                        data = await response.json()
                    }
                }
                console.log('billing status', data)
                setBillingInfo(data)


            } catch (e) {
                console.error('Error fetching activities for the week', e)
            }
        }

        trackBillingStatus()

    }, [accessToken])



    if (!userData) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }




    const handleVincular = async () => {
        const res = await fetch(`${API_BASE_URL}/generate_oauth_mp_link/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }

        );
        const data = await res.json();
        window.location.href = data.link; // Abrís el link generado por el backend
    }


    const handleCreateSplitPayment = async () => {
        const res = await fetch(`${API_BASE_URL}/create_split_payment/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }

        );
        const data = await res.json();
        window.open(data.init_point, "_blank"); // Abrís el link generado por el backend
    }
    switch (infoDisplay) {
        case "0":
            content = <Container className="mt-2">
                <Form>
                    <Form.Group className="mb-3 d-flex align-items-center fs-4">
                        <Form.Label className='mt-2  fs-4 fw-light'>Nombre: </Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            readOnly={!editMode}
                            style={{
                                fontWeight: 'lighter',
                                fontSize: '20px',
                                flex: 1,
                                marginLeft: "1rem",
                                backgroundColor: "transparent",
                                border: editMode ? "1px solid #000000ff" : "none"
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 d-flex align-items-center fs-4">
                        <Form.Label className='mt-2  fs-4 fw-light'>Ubicación: </Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={userData.location}
                            onChange={handleChange}
                            readOnly={!editMode} style={{
                                fontWeight: 'lighter',
                                fontSize: '20px',
                                flex: 1,
                                marginLeft: "1rem",
                                backgroundColor: "transparent",
                                border: editMode ? "1px solid #000000ff" : "none"
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 d-flex align-items-center fs-4">
                        <Form.Label className='mt-2  fs-4 fw-light'>Descripción: </Form.Label>
                        <Form.Control
                            as="textarea"
                            name="bio"
                            value={userData.bio}
                            rows={4}
                            onChange={handleChange}
                            readOnly={!editMode} style={{
                                fontWeight: 'lighter',
                                fontSize: '20px',
                                flex: 1,
                                marginLeft: "1rem",
                                backgroundColor: "transparent",
                                border: editMode ? "1px solid #000000ff" : "none"
                            }}
                        />
                    </Form.Group>
                    <div className="mt-4 mb-4" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >

                        <div style={{ flex: 1, height: '2px', backgroundColor: 'black' }}></div>
                        <span className='fs-4 fw-light ms-1 me-1'> Información de contacto</span>
                        <div style={{ flex: 6, height: '2px', backgroundColor: 'black' }}></div>


                    </div>

                    <Form.Group className="mb-3 d-flex align-items-center fs-4">
                        <Form.Label className='mt-2  fs-4 fw-light'>Telefono: </Form.Label>
                        <Form.Control
                            type="text"
                            name="telefono"
                            value={userData.telefono}
                            onChange={handleChange}
                            readOnly={!editMode} style={{
                                fontWeight: 'lighter',
                                fontSize: '20px',
                                flex: 1,
                                marginLeft: "1rem",
                                backgroundColor: "transparent",
                                border: editMode ? "1px solid #000000ff" : "none"
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center fs-4">
                        <Form.Label className='mt-2 fs-4 fw-light'>Email: </Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            readOnly={!editMode} style={{
                                fontWeight: 'lighter',
                                fontSize: '20px',
                                flex: 1,
                                marginLeft: "1rem",
                                backgroundColor: "transparent",
                                border: editMode ? "1px solid #000000ff" : "none"
                            }}
                        />
                    </Form.Group>



                    <Button
                        variant={editMode ? "success" : "primary"}
                        onClick={() => setEditMode(!editMode)}
                        style={{ position: 'fixed', right: '40%', borderRadius: '30px', backgroundColor: 'rgba(105, 105, 204, 0.9)' }}
                        className='px-5 py-3'
                    >
                        <span className='fs-4 fw-light'> {editMode ? "Guardar" : "Editar"}</span>
                    </Button>
                </Form>


                <Button onClick={handleVincular}>
                    Vincular con Mercado Pago
                </Button>

                <Button onClick={handleCreateSplitPayment}>
                    Crear split payment
                </Button>


            </Container>
            break;
        case "1":
            content =
                <div style={{ width: '100%' }}>

                    <Form onSubmit={handleSubmitPwdChange} className="p-3">

                        <Form.Group className="mb-3 d-flex align-items-center fs-5">
                            <Form.Label className='mt-2 fw-lighter fs-4'>Contraseña actual: </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type={showPassword.current ? "text" : "password"}
                                    name="current_password"
                                    value={formDataPwd.current_password}
                                    onChange={handleChangePwd}
                                    style={{
                                        fontWeight: 'lighter',
                                        fontSize: '20px',
                                        flex: 1,
                                        marginLeft: "1rem",
                                        backgroundColor: "transparent",
                                        border: "1px solid #000000ff",
                                    }}
                                />
                                <Button style={{ backgroundColor: 'transparent', borderLeft: '0px', color: 'black', borderTop: "1px solid #000000ff", borderBottom: "1px solid #000000ff", borderRight: "1px solid #000000ff", }} onClick={() => toggleShowPassword("current")}>
                                    {showPassword.current ? <i class="bi bi-eye-slash-fill"></i>
                                        : <i class="bi bi-eye-fill"></i>}
                                </Button>
                            </InputGroup>

                        </Form.Group>

                        <Form.Group className="mb-3 d-flex align-items-center fs-5">
                            <Form.Label className='mt-2 fw-lighter fs-4'>Nueva contraseña: </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword.new ? "text" : "password"}
                                    name="new_password"

                                    onChange={handleChangePwd}
                                    style={{
                                        fontWeight: 'lighter',
                                        fontSize: '20px',
                                        flex: 1,
                                        marginLeft: "1rem",
                                        backgroundColor: "transparent",
                                        border: "1px solid #000000ff"
                                    }}
                                />  <Button style={{ backgroundColor: 'transparent', borderLeft: '0px', color: 'black', borderTop: "1px solid #000000ff", borderBottom: "1px solid #000000ff", borderRight: "1px solid #000000ff", }} onClick={() => toggleShowPassword("new")}>
                                    {showPassword.new ? <i class="bi bi-eye-slash-fill"></i>
                                        : <i class="bi bi-eye-fill"></i>}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3 d-flex align-items-center fs-5">
                            <Form.Label className='mt-2 fw-lighter fs-4'>Confirmar nueva contraseña: </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="confirm_password"

                                    onChange={handleChangePwd}
                                    style={{
                                        fontWeight: 'lighter',
                                        fontSize: '20px',
                                        flex: 1,
                                        marginLeft: "1rem",
                                        backgroundColor: "transparent",
                                        border: "1px solid #000000ff"
                                    }}
                                /> <Button style={{ backgroundColor: 'transparent', borderLeft: '0px', color: 'black', borderTop: "1px solid #000000ff", borderBottom: "1px solid #000000ff", borderRight: "1px solid #000000ff", }} onClick={() => toggleShowPassword("confirm")}>
                                    {showPassword.confirm ? <i class="bi bi-eye-slash-fill"></i>
                                        : <i class="bi bi-eye-fill"></i>}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <Button type="submit" variant="primary" className="px-5 py-3 fs-4 fw-light" style={{ position: 'absolute', bottom: '10%', right: '40%', borderRadius: '30px', backgroundColor: 'rgba(105, 105, 204, 0.9)' }}>Actualizar</Button>
                    </Form>

                </div>


            break;
        case "2":
            content =
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="mb-2" style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>

                        <span className='fs-3 fw-lighter'> Tu planificación para: <strong className='fs-2'> {currentMonth}</strong></span>
                    </div>
                    {/*PLANES GRATUITOS */}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>

                        <span className='fs-4 fw-lighter'> Planes gratuitos creados este mes: </span>


                        <div style={{ position: "relative", width: '22rem', marginLeft: '2rem' }}>

                            {/* Progress bar */}
                            <div
                                className="progress"
                                role="progressbar"
                                aria-valuenow={billingInfo.gratuitos}
                                aria-valuemin="0"
                                aria-valuemax={billingInfo.gratuitos_disponibles}
                                style={{ height: "30px" }}
                            >
                                <div
                                    className="progress-bar"
                                    style={{ width: `${(billingInfo.gratuitos / billingInfo.gratuitos_disponibles) * 100}%`, fontSize: '20px' }}
                                >
                                    {billingInfo.gratuitos}
                                </div>
                            </div>

                            {/* Marca intermedia (8) */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "0px",  // 👈 sube el texto arriba de la barra
                                    left: `${(8 / billingInfo.gratuitos_disponibles) * 100}%`,
                                    transform: "translateX(-50%)", // centra el número en la línea
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}
                            >
                                <div style={{ height: "30px", width: "2px", backgroundColor: "red" }} />
                                <span style={{ fontSize: "20px" }}>8</span>
                            </div>

                            {/* Marca del máximo */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "0px",
                                    left: "100%",
                                    transform: "translateX(-50%)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}
                            >
                                <div style={{ height: "30px", width: "2px", backgroundColor: "red" }} />
                                <span style={{ fontSize: "20px" }}>{billingInfo.gratuitos_disponibles}</span>
                            </div>
                        </div>
                        <OverlayTrigger
                            placement="top" // puede ser: top, right, bottom, left
                            overlay={<Tooltip id="tooltip-top">Compra más bonos de eventos gratuitos</Tooltip>}
                        >
                            <Button style={{ width: '3rem', height: '3rem', marginLeft: '5rem', borderRadius: '25px' }} onClick={() => navigate("/comprarBono")}>
                                <i class="bi bi-bag-fill"></i>
                            </Button>
                        </OverlayTrigger>

                        <div style={{ width: '15rem', backgroundColor: 'red', display: 'flex', justifyContent: 'end' }}>



                        </div>



                    </div>
                    {/*Eventos pagos centralizados */}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>

                        <span className='fs-4 fw-lighter'> Planes de pago con entradas controladas por GoLocal creados este mes: </span>


                        <div style={{ position: "relative", width: '22rem', marginLeft: '2rem' }}>
                            {console.log('billing_end_range: ', billingInfo.range_centralizados.end_range)}
                            {console.log('billininforcentralizados: ', billingInfo.centralizados)}

                            {console.log((billingInfo.centralizados - billingInfo.range_centralizados.start_range) / (billingInfo.range_centralizados.end_range - billingInfo.range_centralizados.start_range))}
                            {/* Progress bar */}
                            <div
                                className="progress"
                                role="progressbar"
                                aria-valuenow={billingInfo.centralizados}
                                aria-valuemin="0"
                                aria-valuemax={billingInfo.range_centralizados.end_range}
                                style={{ height: "30px" }}
                            >
                                <div
                                    className="progress-bar"
                                    style={{ width: `${((billingInfo.centralizados - billingInfo.range_centralizados.start_range + 0.4) / (billingInfo.range_centralizados.end_range - billingInfo.range_centralizados.start_range)) * 100}%`, fontSize: '20px' }}
                                >
                                    {billingInfo.centralizados}
                                </div>
                            </div>
                            {billingInfo.range_centralizados.start_range != null && (
                                //MIN RANGE
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "0px",
                                        right: "90%",
                                        transform: "translateX(-50%)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center"
                                    }}
                                >
                                    <div style={{ height: "30px", width: "2px", backgroundColor: "red" }} />
                                    <span style={{ fontSize: "20px" }}>{billingInfo.range_centralizados.start_range}</span>
                                </div>

                            )}



                            {/* Marca del máximo */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "0px",
                                    left: "100%",
                                    transform: "translateX(-50%)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}
                            >
                                <div style={{ height: "30px", width: "2px", backgroundColor: "red" }} />
                                <span style={{ fontSize: "20px" }}>{billingInfo.range_centralizados.end_range}</span>
                            </div>
                        </div>

                        <div style={{ width: '15rem', display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
                            <span className='fs-5 fw-light'><em> ...{Number(billingInfo.price_range_centralizados).toLocaleString('es-AR') + ' ARS'}</em> </span>
                            <OverlayTrigger
                                placement="top" // puede ser: top, right, bottom, left
                                overlay={<Tooltip id="tooltip-top">Información sobre los tramos de precio</Tooltip>}
                            >
                                <i class="bi bi-info-circle ms-2"></i>

                            </OverlayTrigger>


                        </div>

                    </div>

                    {/*Button para extender rango de planes pagos */}
                    <div className="mt-2" style={{ width: '100%', display: 'flex', justifyContent: 'start' }}>

                        <Button className='p-1 px-4 py-2' style={{ borderRadius: '40px' }} onClick={() => navigate('/extendRangoPlanesPagos', { state: { end_range_actual: billingInfo.range_centralizados.end_range } })}>

                            <span className='fs-5 fw-lighter'>Ampliar rango de planes pagos </span>
                        </Button>
                    </div>

                    {/*Eventos pagos sin centralizar */}
                    {/*   <div style={{ width: "100%", margin: "auto", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                            <span className="fw-lighter fs-4" style={{ align: 'start' }} >Planes de pago con entradas gestionadas externamente: </span>
                            <span className="fw-lighter fs-5" >Eventos ordenados por precio de entrada</span>

                        </div>
                        <div style={{ width: '40%' }}>

                            <Doughnut
                                data={dataChartNoCentralizados}
                                options={{
                                    plugins: {
                                        tooltip: {
                                            callbacks: {
                                                title: function (context) {
                                                    // index del segmento
                                                    const index = context[0].dataIndex;
                                                    const valueEventos = context[0].chart.data.datasets[0].data[index];
                                                    return `Cantidad de eventos: ${valueEventos}`;
                                                },
                                                label: function (context) {
                                                    const index = context.dataIndex;
                                                    const valueCostos = context.dataset.extraCostos[index];
                                                    const totalRangeCosto = context.dataset.costosTotalesPorRango[index];
                                                    return [`Precio por evento: ${valueCostos}`,
                                                    `Total: ${totalRangeCosto}`
                                                    ];
                                                },
                                            },
                                        },
                                    },
                                }}
                            />;




                        </div>

                        <div style={{ width: '15rem', backgroundColor: 'red', display: 'flex', justifyContent: 'end' }}>
                            <span className='fs-5 fw-light'><em> ...{Number(billingInfo.price_external_eventos).toLocaleString('es-AR') + ' ARS'}</em> </span>



                        </div>
                    </div> */}

                    <div className="mt-2 mb-2" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >

                        <div style={{ flex: 1, height: '2px', backgroundColor: 'black' }}></div>
                        <span className='fs-4 fw-lighter ms-2 me-1'>    Costo de uso de la plataforma: <strong>{Number(billingInfo.precio_total).toLocaleString('es-AR') + ' ARS'} </strong></span>


                    </div>
                    <div className='fs-5 fw-lighter ms-2 me-1 mt-5' style={{ display: 'flex', flexDirection: 'row' }}>

                        Estado: <em> {billingInfo.estado}</em>

                      
                        <Button className ="ms-5" onClick={() => window.open(`${API_BASE_URL}/export-pagos-excel?current_month=${currentMonth}`, "_blank")}>
                            Descargar Excel
                        </Button>

                       

                    </div>
                    {billingInfo.mostrar_boton_planificacion === true && (<div style={{display:'flex', flexDirection:'row', justifyContent:'end', width:'100%'}}>
                         <Button className ="ms-5" style={{height:'5rem', width:'20rem', borderRadius:'40px'}} onClick={() => manageContentDisplay("3")}>
                            <span className='fs-4 fw-lighter'> Crear planificación para el mes que viene</span>
                        </Button>
                    </div>)}
                    

                </div>


            break;
        case "3":
            content = <div >PREPARAR LA PLANIFICACIÓN PARA EL MES SIGUIENTE</div>
            break;



    }
    return <div style={{ marginTop: '56px', width: '100%', height: '100%', }}>
        <div
            style={{
                height: 'calc(100vh - 56px - 170px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
            }}
        >
            <div className='col-md-8 p-5' style={
                { height: '100%', }
            }>
                <div style={
                    {
                        height: '2rem', width: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }
                }>
                    {/* Botón hamburguesa */}
                    <Button
                        variant="light"
                        onClick={handleShowMenu}
                        style={{ border: "none", background: "transparent" }}
                    >
                        {/* <FaBars size={24} /> ç*/}
                        <i class="bi bi-three-dots fs-4"></i>
                    </Button>

                    {/* Offcanvas Menu */}
                    <Offcanvas show={showMenu} onHide={handleCloseMenu} placement="start" style={{ height: '100%' }}>
                        <Offcanvas.Header closeButton>
                        </Offcanvas.Header>
                        <Offcanvas.Body style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center', // Centra horizontalmente
                            justifyContent: 'center', // Centra verticalmente
                            padding: 0
                        }}>
                            <ListGroup variant="flush">
                                <ListGroup.Item action value="0" onClick={() => manageContentDisplay("0")} style={{ fontSize: '30px', fontWeight: 'lighter' }}>
                                    Información general
                                </ListGroup.Item>
                                <ListGroup.Item action value="1" onClick={() => manageContentDisplay("1")} style={{ fontSize: '30px', fontWeight: 'lighter' }}>
                                    Cambiar contraseña
                                </ListGroup.Item>
                                <ListGroup.Item action value="2" onClick={() => manageContentDisplay("2")} style={{ fontSize: '30px', fontWeight: 'lighter' }}>
                                    Mi plan de facturación
                                </ListGroup.Item>
                                <ListGroup.Item action value="3" onClick={() => { logout(); }} style={{ fontSize: '30px', fontWeight: 'lighter' }}>
                                    Cerrar sesión
                                </ListGroup.Item>
                            </ListGroup>
                        </Offcanvas.Body>
                    </Offcanvas>
                </div>


                <div id="generalInfo" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>


                    {content}
                </div>



            </div>
            <div className="col-md-4" style={{ backgroundColor: 'rgba(167, 40, 235, 0.5)', height: '100%' }}>

                <img src={userData['image']} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // rellena y recorta si es necesario
                    display: 'block'
                }} />

            </div>
            {/* Toast Container fijo arriba */}
            <ToastContainer
                position="top-center"
                className="p-3"
                style={{ zIndex: 9999 }}
            >
                <Toast
                    bg={toast.bg}
                    show={toast.show}
                    onClose={() => setToast({ ...toast, show: false })}
                    delay={3000} // 3 segundos
                    autohide
                >
                    <Toast.Body className="text-white text-center fs-6">
                        {toast.message}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    </div>



}