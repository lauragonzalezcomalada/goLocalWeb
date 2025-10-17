import React, { useState, useEffect } from 'react';

import { IDLE_BLOCKER, useLocation } from 'react-router-dom'
import { Card, Button, Form } from 'react-bootstrap';
import { API_BASE_URL, backgroundColor, logoColor } from './constants';
import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { startOfDay } from 'date-fns';

import ojitos_gif from './assets/ojitos.gif';

export default function ExtenderRangoPlanesPagos() {


    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation()
    const { accessToken, userProfile, refreshTokenIfNeeded } = useContext(AuthContext)
    const [rangos, setRangos] = useState(null)

    const [selectedAmpliacionId, setSelectedAmpliacionId] = useState(null);

    const handleChange = (id) => {
        setSelectedAmpliacionId(id); // solo un checkbox activo a la vez
    };

    async function handleCompraAmpliacionRango() {
        let rango_seleccionado = rangos.find(r => r.id === selectedAmpliacionId)
        let precio_a_pagar = rango_seleccionado.price - precioPagado;
        try {
            setIsLoading(true);
            var response = await fetch(API_BASE_URL + '/crear_compra_simple/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
                body: JSON.stringify({ type: 'extend_rango', uuid: rango_seleccionado['uuid'] }),
            })

            if (response.status === 401) {
                const newAccessToken = await refreshTokenIfNeeded()
                if (!newAccessToken) return

                var response = await fetch(API_BASE_URL + '/crear_compra_simple/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken,
                    },
                    body: JSON.stringify({ type: 'extend_rango', uuid: rango_seleccionado['uuid'] }),
                })
            }

            if (response.ok) {
                var data = await response.json();
                console.log('l init point es: ', data.init_point);
                window.open(data.init_point, "_blank");
            } else {
                const errorData = await response.json();
                console.error('Error extendiendo el rango de planes pagos, status:', response.status, errorData);
                alert('Error extendiendo el rango de planes pagos, ' + (errorData.detail || 'Error desconocido'));
            }
        } catch (e) {
            console.error('Error extendiendo el rango de planes pagos', e)
            alert('Error extendiendo el rango de planes pagos: ' + e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        async function rangosEventosPagos() {
            try {
                var response = await fetch(API_BASE_URL + '/payment_events_ranges/', {
                })

                var data = await response.json();
                setRangos(data)

            } catch (e) {
                console.error('Error fetching activities for the week', e)
            }
        }
        rangosEventosPagos()
    }, [])


    if (!rangos) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '56px', height: '100vh' }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    var precioPagado = 0;
    return <div className="p-5" style={{ marginTop: '56px', width: '100%', backgroundColor: backgroundColor, minHeight: 'calc(100vh - 56px - 170px)', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {rangos.map((rango) => {
            // mostrar solo si end_range_actual es menor al end_range del rango

            if (rango?.end_range !== null && userProfile?.payment_events_range !== null && userProfile?.payment_events_range.end_range >= rango?.end_range) {
                precioPagado = rango.price;
                return null; // no renderiza nada
            }
            return (
                <div key={rango.id} className="p-5" style={{
                    border: '3px solid ' + logoColor,
                    borderRadius: '30px',
                    height: '10rem',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', color: logoColor, fontWeight: 400 }}>
                        {rango.end_range ? <span className='fs-3'>
                            Mejora tu plan hasta <strong> {rango.end_range} </strong>eventos
                        </span> : <span className='fs-3 '> Mejora tu plan y obtén eventos <strong>ilimitados</strong></span>}


                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div className='mx-1' style={{ display: 'flex', fontWeight: 800, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: logoColor }}>

                            {userProfile.payment_events_range !== null && (<s>  {"$" + Number(rango.price).toLocaleString('es-AR')} </s>)}

                            {userProfile.payment_events_range === null && (<p className="fs-3 fw-light"> {"$" + Number(rango.price).toLocaleString('es-AR')} </p>)}
                            <span className='fs-4 fw-light'>

                            </span>
                            {userProfile.payment_events_range !== null && (<span className='fs-2' style={{ fontWeight: 900 }}>
                                {"$" + Number(rango.price - precioPagado).toLocaleString('es-AR')}
                            </span>)}

                        </div>
                        {userProfile.payment_events_range !== null && (
                            <span className='fw-bolder mt-1' style={{ fontSize: '15px', color: logoColor }}> *Ya pagaste {"$" + Number(precioPagado).toLocaleString('es-AR')} </span>
                        )}
                    </div>


                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedAmpliacionId === rango.id}
                                onChange={() => handleChange(rango.id)}
                                style={{ width: "30px", height: "30px" }}
                            />
                        </label>
                    </div>
                </div>
            );
        })}

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', width: '100%' }}>
            <Button
                type="button"
                onClick={handleCompraAmpliacionRango}
                className="mt-2"
                style={{ width: '12rem', height: '4rem', borderRadius: '3rem', fontSize: '30px', fontWeight: 400, backgroundColor: logoColor, borderColor: 'transparent' }}
            >
                COMPRAR
            </Button>
        </div>
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
        )}

    </div>
}
