import React, { useState, useEffect } from 'react';

import { IDLE_BLOCKER, useLocation } from 'react-router-dom'
import { Card, Button, Form } from 'react-bootstrap';
import { API_BASE_URL } from './constants';
import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { startOfDay } from 'date-fns';


export default function ExtenderRangoPlanesPagos() {



    const location = useLocation()
    const { accessToken, userProfile, isAuthenticated, logout } = useContext(AuthContext)
    const [rangos, setRangos] = useState(null)

    const [selectedAmpliacionId, setSelectedAmpliacionId] = useState(null);

    const handleChange = (id) => {
        setSelectedAmpliacionId(id); // solo un checkbox activo a la vez
    };

    async function handleCompraAmpliacionRango() {
        console.log('handle compra de bono')
        console.log(selectedAmpliacionId)
        let rango_seleccionado = rangos.find(r => r.id === selectedAmpliacionId)
        console.log(rango_seleccionado)
        let precio_a_pagar = rango_seleccionado.price - precioPagado;
        console.log('pecio a pagar: ', precio_a_pagar)
        const res = await fetch(`${API_BASE_URL}/create_test_payment/`, {
            method: 'POST',
            headers: {  Authorization: `Bearer ${accessToken}`,'Content-Type': 'application/json' },
            body: JSON.stringify({ 'title': `Mejora plan planes pagos a ${rango_seleccionado.name}`,
                'amount': precio_a_pagar, 'tipo_transaccion': 'mejora_planes_pagos'
             }),
        }
        )
        const data = await res.json()
        console.log('data: ', data)
        window.open(data.sandbox_init_point, "_blank")

    }

    useEffect(() => {
        async function rangosEventosPagos() {
            try {
                var response = await fetch(API_BASE_URL + '/payment_events_ranges/', {
                })

                var data = await response.json();
                console.log('rangos: ', data);
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
    console.log('rangos: ', rangos)
    var precioPagado = 0;
    return <div className="p-5" style={{ marginTop: '56px', width: '100%', height: 'calc(100vh - 56px - 170px)', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {rangos.map((rango) => {
            // mostrar solo si end_range_actual es menor al end_range del rango

            if (rango?.end_range !== null && userProfile?.payment_events_range.end_range >= rango?.end_range) {
                precioPagado = rango.price;
                return null; // no renderiza nada
            }
            console.log('prcio pagado actualizado: ', precioPagado)
            return (
                <div key={rango.id} className="p-5" style={{
                    border: '1px solid rgba(0, 0, 0, 0.9)',
                    borderRadius: '30px',
                    height: '8rem',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                        {rango.end_range ? <span className='fs-3 fw-lighter'>
                            Mejora tu plan hasta <strong> {rango.end_range} </strong>eventos
                        </span> : <span className='fs-3 fw-lighter'> Mejora tu plan y obtén eventos <strong>ilimitados</strong></span>}


                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div className='mx-1' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <span className='fs-4 fw-light'>
                                <s>  {"$" + Number(rango.price).toLocaleString('es-AR')}</s>
                            </span>
                            <span className='fs-3 fw-light'>
                                {"$" + Number(rango.price - precioPagado).toLocaleString('es-AR')}
                            </span>
                        </div>
                        <span className='fw-bolder mt-1' style={{ fontSize: '12px' }}> *Ya pagaste {"$" + Number(precioPagado).toLocaleString('es-AR')} </span>
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
                style={{ width: '12rem', height: '4rem', borderRadius: '3rem', fontSize: '25px', fontWeight: 'lighter' }}
            >
                Comprar
            </Button>
        </div>

    </div>
}
