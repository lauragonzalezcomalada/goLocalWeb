import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, logoColor, backgroundColor, orangeColor } from './constants.js'
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
import soloCarita from './assets/nopicture.png';




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
                    response = await fetch(API_BASE_URL + '/billing_status/', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        }
                    })
                    if (response.ok) {
                        data = await response.json()
                    }
                }
                console.log('data billing status: ', data);
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



    const _editProfileDate = async (editMode) => {
        console.log('edit o guardar ?', editMode);
        //EDIT MODE = FALSE ES QUE S'ACTIVA EL MODE 
        //EDIT MODE = TRUE ES QUE ES VOL GUARDAR
        if (editMode === true) {
            console.log(userData);
            const res = await fetch(`${API_BASE_URL}/actualizar_usuario/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_uuid: userData['uuid'],location: userData['location'],bio:userData['bio'],telefono:userData['telefono'],email:userData['email'] })
            }
            );
            const data = await res.json();
            console.log('data: ',data);


        }
        setEditMode(!editMode);

    }
    const handleVincular = async () => {
        const res = await fetch(`${API_BASE_URL}/generate_oauth_mp_link/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }

        );
        const data = await res.json();
        window.open(data.link, "_blank");
    }


    const handleCreateSplitPayment = async () => {
        const res = await fetch(`${API_BASE_URL}/create_split_payment/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }

        );
        const data = await res.json();
        window.open(data.sandbox_init_point, "_blank"); // Abrís el link generado por el backend
    }
    switch (infoDisplay) {
        case "0":
            content = <Container >
                <Form>
                    <Form.Group className="mb-3 d-flex align-items-center fs-4">
                        <Form.Label className='mt-2 fs-3' style={{color:logoColor, fontWeight:800}}>NOMBRE: </Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={userData.username}
                            readOnly={true}
                            style={{
                                fontWeight: 'lighter',
                                fontSize: '30px',
                                flex: 1,
                                marginLeft: "1rem",
                                backgroundColor: "transparent",
                                border: "none",
                                color:logoColor
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 d-flex align-items-center fs-4">
                        <Form.Label className='mt-2 fs-3' style={{color:logoColor, fontWeight:800}}>UBICACIÓN: </Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={userData.location}
                            onChange={handleChange}
                            readOnly={!editMode} style={{
                                fontWeight: 'lighter',
                                fontSize: '30px',
                                color:logoColor,
                                flex: 1,
                                marginLeft: "1rem",
                                backgroundColor: "transparent",
                                border: editMode ? "1px solid #000000ff" : "none"
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 d-flex align-items-center fs-4">
                        <Form.Label className='mt-2 fs-3' style={{color:logoColor, fontWeight:800}}>DESCRIPCIÓN: </Form.Label>
                        <Form.Control
                            as="textarea"
                            name="bio"
                            value={userData.bio}
                            rows={3}
                            onChange={handleChange}
                            readOnly={!editMode} style={{
                                fontWeight: 'lighter',
                                fontSize: '30px',
                                color:logoColor,
                                flex: 1,
                                marginLeft: "1rem",
                                backgroundColor: "transparent",
                                border: editMode ? "1px solid #000000ff" : "none"
                            }}
                        />
                    </Form.Group>
                    <div className="mt-4 mb-4" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >

                        <div style={{ flex: 1, height: '2px', backgroundColor: logoColor }}></div>
                        <span className='fs-3 fw-light ms-1 me-1' style={{color:logoColor, fontWeight:800}}> INFORMACIÓN DE CONTACTO</span>
                        <div style={{ flex: 6, height: '2px', backgroundColor: logoColor }}></div>


                    </div>

                    <Form.Group className="mb-3 d-flex align-items-center fs-4">
                        <Form.Label className='mt-2 fs-3' style={{color:logoColor, fontWeight:800}}>TELEFONO: </Form.Label>
                        <Form.Control
                            type="text"
                            name="telefono"
                            value={userData.telefono}
                            onChange={handleChange}
                            readOnly={!editMode} style={{
                                fontWeight: 'lighter',
                                fontSize: '30px',
                                color:logoColor,
                                flex: 1,
                                marginLeft: "1rem",
                                backgroundColor: "transparent",
                                border: editMode ? "1px solid #000000ff" : "none"
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center fs-4">
                        <Form.Label className='mt-2 fs-3' style={{color:logoColor, fontWeight:800}}>EMAIL: </Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            readOnly={!editMode} style={{
                                fontWeight: 'lighter',
                                fontSize: '30px',
                                color:logoColor,
                                flex: 1,
                                marginLeft: "1rem",
                                backgroundColor: "transparent",
                                border: editMode ? "1px solid #000000ff" : "none"
                            }}
                        />
                    </Form.Group>



                    <Button
                        variant={editMode ? "success" : "primary"}
                        onClick={() => _editProfileDate(editMode)}
                        style={{ position: 'absolute', right: '40%', bottom: '4vh', borderRadius: '30px', backgroundColor: logoColor, borderColor: 'transparent', lineHeight: 1 }}
                        className='px-5 py-3'
                    >
                        <span className='fs-3 fw-light'> {editMode ? "GUARDAR" : "EDITAR"}</span>
                    </Button>
                </Form>

                {/*
                <Button onClick={handleVincular}>
                    Vincular con Mercado Pago
                </Button>

                <Button onClick={handleCreateSplitPayment}>
                    Crear split payment
                </Button>
                */}

            </Container>
            break;
        case "1":
            content =
                <div style={{ width: '100%' }}>

                    <Form onSubmit={handleSubmitPwdChange} className="p-3">

                        <Form.Group className="mb-3 d-flex align-items-center fs-5">
                            <Form.Label className='mt-2 fs-4' style={{softWrap:false, fontWeight:800, color:logoColor}}>CONTRASEÑA ACTUAL: </Form.Label>
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
                                        backgroundColor: "transparent",
                                        border: "1px solid #000000ff",
                                    }}
                                />
                                <Button style={{ backgroundColor: 'transparent', borderLeft: '0px', color: 'black', borderTop: "1px solid #000000ff", borderBottom: "1px solid #000000ff", borderRight: "1px solid #000000ff", }} onClick={() => toggleShowPassword("current")}>
                                    {showPassword.current ? <i className="bi bi-eye-slash-fill"></i>
                                        : <i className="bi bi-eye-fill"></i>}
                                </Button>
                            </InputGroup>

                        </Form.Group>

                        <Form.Group className="mb-3 d-flex align-items-center fs-5">
                            <Form.Label className='mt-2 fs-4' style={{fontWeight:800, color:logoColor}}>NUEVA CONTRASEÑA: </Form.Label>
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
                                    {showPassword.new ? <i className="bi bi-eye-slash-fill"></i>
                                        : <i className="bi bi-eye-fill"></i>}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3 d-flex align-items-center fs-5">
                            <Form.Label className='mt-2 fs-4' style={{fontWeight:800, color:logoColor}}>CONFIRMAR NUEVA CONTRASEÑA: </Form.Label>
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
                                    {showPassword.confirm ? <i className="bi bi-eye-slash-fill"></i>
                                        : <i className="bi bi-eye-fill"></i>}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <Button type="submit" variant="primary" className="px-5 py-3 fs-3 fw-light" style={{ position: 'absolute', bottom: '10%', right: '40%', borderRadius: '30px', backgroundColor: logoColor, lineHeight:1,borderColor:'transparent' }}>ACTUALIZAR</Button>
                    </Form>

                </div>


            break;
        case "2":
            content =
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="mb-2" style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>

                        <span  style={{color:logoColor, fontSize:'30px', fontWeight:300}}> Tu planificación para: <strong className='fs-2' style={{fontWeight:900}}> {currentMonth}</strong></span>
                    </div>
                    {/*PLANES GRATUITOS */}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>

                        <span style={{color:logoColor, fontWeight:300, fontSize:'25px'}}> Planes gratuitos creados este mes: </span>


                        <div style={{ position: "relative", width: '22rem', marginLeft: '3rem' }}>

                            {/* Progress bar */}
                            <div
                                className="progress"
                                role="progressbar"
                                aria-valuenow={billingInfo.gratuitos}
                                aria-valuemin="0"
                                aria-valuemax={billingInfo.gratuitos_disponibles}
                                style={{ height: "30px",}}
                            >
                                <div
                                    className="progress-bar"
                                    style={{ width: `${(billingInfo.gratuitos / billingInfo.gratuitos_disponibles) * 100}%`, fontSize: '20px' , backgroundColor:orangeColor }}
                                >
                                    {billingInfo.gratuitos}
                                </div>
                            </div>
                            <div
                                style={{
                                    position: "absolute",
                                    top: "0px",
                                    left: `${(4 / billingInfo.gratuitos_disponibles) * 100}%`,
                                    transform: "translateX(-50%)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}
                            >
                                <div style={{ height: "30px", width: "2px", backgroundColor: "red" }} />
                                <span style={{ fontSize: "25px" }}>4</span>
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
                                <span style={{ fontSize: "25px" }}>{billingInfo.gratuitos_disponibles}</span>
                            </div>
                        </div>
                        <OverlayTrigger
                            placement="top" // puede ser: top, right, bottom, left
                            overlay={<Tooltip id="tooltip-top" style={{fontSize:'20px'}}>Compra más bonos de eventos gratuitos</Tooltip>}
                        >
                            <Button style={{ width: 'auto', height: '3rem', marginLeft: '5rem', borderRadius: '25px' ,backgroundColor:orangeColor , borderColor:'transparent'}} onClick={() => navigate("/comprarBono")}>
                                <i className="bi bi-bag-fill"></i>
                            </Button>
                        </OverlayTrigger>

                        <div style={{ width: '15rem', backgroundColor: 'red', display: 'flex', justifyContent: 'end' }}>



                        </div>



                    </div>
                    {/*Eventos pagos centralizados */}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>

                        <span style={{fontSize:'25px', color:logoColor, fontWeight:300}}> Planes de pago con entradas controladas por GoLocal creados este mes: </span>


                        <div style={{ position: "relative", width: '22rem', marginLeft: '2rem' ,fontSize:'30px' ,}}>
                            {/* Progress bar */}
                            <div
                                className="progress"
                                role="progressbar"
                                aria-valuenow={billingInfo.centralizados}
                                aria-valuemin="0"
                                aria-valuemax={billingInfo.range_centralizados.end_range}
                                style={{ height: "30px",fontSize:'30px' ,}}
                            >
                                <div
                                    className="progress-bar"
                                    style={{  width: `${((billingInfo.centralizados - billingInfo.range_centralizados.start_range + 0.4) / (billingInfo.range_centralizados.end_range - billingInfo.range_centralizados.start_range)) * 100}%`, fontSize: '20px', backgroundColor: orangeColor }}
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
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ height: "30px", width: "2px", backgroundColor: "red" }} />
                                    <span style={{ fontSize: "25px" }}>{billingInfo.range_centralizados.start_range}</span>
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
                                    alignItems: "center",
                                   
                                }}
                            >
                                <div style={{ height: "30px", width: "2px", backgroundColor: "red" }} />
                                <span style={{ fontSize: "25px" }}>{billingInfo.range_centralizados.end_range}</span>
                            </div>
                        </div>

                        <div style={{ width: '15rem', display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
                            <span style={{fontSize:'30px', color:logoColor, fontWeight:800}}><em> ...{Number(billingInfo.price_range_centralizados).toLocaleString('es-AR') + ' ARS'}</em> </span>
                            <OverlayTrigger
                                placement="top" // puede ser: top, right, bottom, left
                                overlay={<Tooltip id="tooltip-top" style={{fontSize:'20px'}}>Información sobre los tramos de precio</Tooltip>}
                            >
                                <i className="bi bi-info-circle ms-2"></i>

                            </OverlayTrigger>


                        </div>

                    </div>

                    {/*Button para extender rango de planes pagos */}
                    <div className="mt-5 mb-4" style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>

                        <Button className='p-1 px-4 py-2' style={{ borderRadius: '40px' , backgroundColor:orangeColor, borderColor:'transparent'}} onClick={() => navigate('/extendRangoPlanesPagos', { state: { end_range_actual: billingInfo.range_centralizados.end_range } })}>

                            <span style={{fontSize:'25px',fontWeight:300 }}>Ampliar rango de planes pagos </span>
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

                    <div className="mt-2 mb-2" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'center' }} >

                        <div style={{ flex: 1, height: '2px', backgroundColor: logoColor }}></div>
                        <span className='ms-2 me-1' style={{color:logoColor, fontSize:'30px', fontWeight:400}}>    Costo de uso de la plataforma: <strong>{Number(billingInfo.precio_total).toLocaleString('es-AR') + ' ARS'} </strong></span>


                    </div>
                    <div className=' ms-2 me-1 mt-5' style={{ display: 'flex', flexDirection: 'row',justifyContent:'space-between',alignItems:'center', fontSize:'30px', fontWeight:300, color:logoColor}}>
                        <div>
                            Estado: <b style={{marginLeft: '20px', fontWeight:800}}> {billingInfo.estado}</b>

                        </div>


                        <Button
                            className="ms-5"
                            onClick={async () => {
                                console.log('clicked descargar excel button');

                                const url = `${API_BASE_URL}/export-pagos-excel?current_month=${currentMonth}`;

                                const response = await fetch(url, {
                                    method: "GET",
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                });

                                const blob = await response.blob();
                                const downloadUrl = window.URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.href = downloadUrl;
                                link.download = `pagos_${currentMonth}.xlsx`;
                                link.click();
                            }}
                            style={{fontSize:'30px', borderRadius:'20px', padding:'0.5rem 2rem', backgroundColor: logoColor, borderColor:'transparent'}}
                        >
                            DESCARGAR EXCEL
                        </Button>



                    </div>
                    {billingInfo.mostrar_boton_planificacion === true && (<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', width: '100%' }}>
                        <Button className="ms-5" style={{ height: '5rem', width: '20rem', borderRadius: '40px' }} onClick={() => manageContentDisplay("3")}>
                            <span className='fs-4 fw-lighter'> Crear planificación para el mes que viene</span>
                        </Button>
                    </div>)}


                </div>


            break;
        case "3":
            content = <div >PREPARAR LA PLANIFICACIÓN PARA EL MES SIGUIENTE</div>
            break;



    }
    return <div style={{ marginTop: '40px', width: '100%', height: '100%', backgroundColor:backgroundColor}}>
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
                        <i className="bi bi-three-dots fs-4"></i>
                    </Button>

                    {/* Offcanvas Menu */}
                    <Offcanvas show={showMenu} onHide={handleCloseMenu} placement="start" style={{ height: '100%' }}>
                        <Offcanvas.Header closeButton style={{ backgroundColor:backgroundColor, fontSize:'30px'}}>
                        </Offcanvas.Header>
                        <Offcanvas.Body style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center', // Centra horizontalmente
                            justifyContent: 'center', // Centra verticalmente
                            padding: 0
                            ,backgroundColor:backgroundColor
                        }}>
                            <ListGroup variant="flush">
                                <ListGroup.Item action value="0" onClick={() => manageContentDisplay("0")} style={{ fontSize: '35px',  backgroundColor:'transparent' , color:logoColor}}>
                                    INFORMACIÓN GENERAL
                                </ListGroup.Item>
                                <ListGroup.Item action value="1" onClick={() => manageContentDisplay("1")} style={{ fontSize: '35px',  backgroundColor:'transparent' , color:logoColor}}>
                                    CAMBIAR CONTRASEÑA
                                </ListGroup.Item>
                                <ListGroup.Item action value="2" onClick={() => manageContentDisplay("2")} style={{ fontSize: '35px', backgroundColor:'transparent', color:logoColor }}>
                                    MI PLAN DE FACTURACIÓN
                                </ListGroup.Item>
                                <ListGroup.Item action value="3" onClick={() => { logout(); }} style={{ fontSize: '35px',  backgroundColor:'transparent' , color:logoColor}}>
                                    CERRAR SESIÓN
                                </ListGroup.Item>
                            </ListGroup>
                        </Offcanvas.Body>
                    </Offcanvas>
                </div>


                <div id="generalInfo" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>


                    {content}
                </div>



            </div>
            <div className="col-md-4" style={{ height: '100%', display:'flex', justifyContent:'center', alignItems:'center',}}>

                <img src={userData['image'] ? userData['image'] : soloCarita} style={{
                  
                    height: '500px',
                    width:'500px',
                    objectFit: userData['image'] ? 'cover' : 'scale-down', // rellena y recorta si es necesario
                    display: 'block'
                    ,
                    borderRadius:'500px',
                     border: '7px solid'+logoColor
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