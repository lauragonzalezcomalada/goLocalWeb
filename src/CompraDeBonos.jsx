import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { API_BASE_URL, backgroundColor, logoColor } from './constants';
import DateCard from './DateCard';
import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import ojitos_gif from './assets/ojitos.gif';

export default function CompraDeBonos() {
    
    const [isLoading, setIsLoading] = useState(false);
    
    const [bonos, setBonos] = useState(null)
    const [selectedBonoId, setSelectedBonoId] = useState(null);
    const { accessToken, refreshTokenIfNeeded } = useContext(AuthContext)

    const handleChange = (id) => {
        setSelectedBonoId(id);
    };

    useEffect(() => {
        async function bonosOptions() {
            try {
                var response = await fetch(API_BASE_URL + '/bonos/', {
                })

                var data = await response.json();
                setBonos(data);

            } catch (e) {
                console.error('Error fetching activities for the week', e)
            }
        }
        bonosOptions()

    }, [])


    async function handleCompraDeBono() {
        if (!selectedBonoId) {
            alert('Por favor, seleccione un bono para comprar.');
            return;
        }
        try {
            
            setIsLoading(true); 

            var response = await fetch(API_BASE_URL + '/crear_compra_simple/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
                body: JSON.stringify({ type: 'compra_bono', uuid: bonos[selectedBonoId - 1].uuid }),
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
                    body: JSON.stringify({ type: 'compra_bono', uuid: bonos[selectedBonoId - 1].uuid }),
                })
            }

            if (response.ok) {
                var data = await response.json();
                console.log('l init point es: ', data.init_point);
                window.open(data.init_point, "_blank");
            } else {
                const errorData = await response.json();
                console.error('Error comprando el bono, status:', response.status, errorData);
                alert('Error comprando el bono: ' + (errorData.detail || 'Error desconocido'));
            }
        } catch (e) {
            console.error('Error comprando el bono', e)
            alert('Error comprando el bono: ' + e.message);
        }finally {
    setIsLoading(false); 
  }
    }

    if (!bonos) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '56px', height: '100vh' }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    return <div className="p-5" style={{ marginTop: '56px', width: '100%', height: 'calc(100vh - 56px - 170px)', backgroundColor: backgroundColor, justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {bonos.map((bono) => (

            <div className="p-5" style={{ border: '3px solid '+logoColor, borderRadius: '30px', height: '10rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', color:logoColor }}>
                <span className='fs-3' style={{fontWeight:400}}> {bono.name}</span>
                <span className='fs-3' style={{fontWeight:800}}> {'$' + Number(bono.price).toLocaleString('es-AR')}</span>
                <div key={bono.id}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedBonoId === bono.id}
                            onChange={() => handleChange(bono.id)}
                            style={{ width: "30px", height: "30px" }}
                        />

                    </label>
                </div>

            </div>

        )
        )}
        <div >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', width: '100%' }}>

                <Button type="button" onClick={handleCompraDeBono} className="mt-2" style={{
                    width: '12rem', height: '4rem', borderRadius
                        : '3rem', fontSize: '30px', fontWeight: 300, backgroundColor:logoColor, borderColor:'transparent'
                }}>
                    Comprar
                </Button>
            </div>

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
