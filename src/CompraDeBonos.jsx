import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { API_BASE_URL } from './constants';
import DateCard from './DateCard';
import { useContext } from 'react'
import { AuthContext } from './AuthContext'


export default function CompraDeBonos() {

    const [bonos, setBonos] = useState(null)
    const [selectedBonoId, setSelectedBonoId] = useState(null);

    const handleChange = (id) => {
        setSelectedBonoId(id); // solo un checkbox activo a la vez
    };

    useEffect(() => {
        async function bonosOptions() {
            try {
                var response = await fetch(API_BASE_URL + '/bonos/', {
                })

                var data = await response.json();
                console.log('bonos: ', data);
                setBonos(data);



            } catch (e) {
                console.error('Error fetching activities for the week', e)
            }
        }
        bonosOptions()

    }, [])


    async function handleCompraDeBono() {
        console.log('handle compra de bono')
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
    return <div className="p-5" style={{ marginTop: '56px', width: '100%', height: 'calc(100vh - 56px - 170px)', backgroundColor: 'rgba(255,255,0,1)', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {bonos.map((bono) => (

            <div className="p-5" style={{ border: '1px solid rgba(0, 0, 0, 0.9)', borderRadius: '30px', height: '10rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className='fs-3 fw-light'> {bono.name}</span>
                <span className='fs-3 fw-light'> {'$' + Number(bono.price).toLocaleString('es-AR')}</span>
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
            <div style={{display:'flex', flexDirection:'row', justifyContent:'end', width:'100%'}}>

                <Button type="button" onClick={handleCompraDeBono} className="mt-2" style={{width:'12rem', height:'4rem', borderRadius
                    :'3rem', fontSize:'25px', fontWeight:'lighter'
                }}>
                    Comprar
                </Button>
            </div>

        </div>


    </div>
}
