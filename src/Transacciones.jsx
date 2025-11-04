import screenshot from './assets/videopresentacio.mov';
import caritaVino from './assets/vinitopainted.png';
import solocarita from './assets/cine_chatgpt.png';
import caritaDeportista from './assets/deportista_chatgpt.png';
import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from './constants'
import { format, parseISO } from 'date-fns';

import { useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import icon from './assets/icon.png'
import { AuthContext } from './AuthContext'

import { logoColor, backgroundColor } from './constants';

export default function Transacciones() {

    const navigate = useNavigate();
    const { accessToken, refreshTokenIfNeeded } = useContext(AuthContext)
    const [transactionsData, setTransactionsData] = useState({});
    const [appPayments, setAppPayments] = useState({});
    const [totalAmounts, setTotalAmounts] = useState({});

    useEffect(() => {
        async function getTransactionsData() {
            try {
                var response = await fetch(API_BASE_URL + '/transactions/', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })

                var data = await response.json();
                if (response.status === 401) {
                    console.log('response status = 401')
                    // intentamos refrescar
                    const newAccessToken = await refreshTokenIfNeeded()
                    if (!newAccessToken) return // no se pudo refrescar

                    // reintentamos con token nuevo
                    response = await fetch(`${API_BASE_URL}/transactions/`, {
                        headers: {
                            Authorization: `Bearer ${newAccessToken}`
                        }
                    })
                    if (response.ok) {
                        data = await response.json()
                    }
                }

                console.log('data del transactions: ', data);

                setTransactionsData(data['payments']);
                setTotalAmounts(data['total_amounts'])
                setAppPayments(data['app_service_payments'])


            } catch (e) {
                console.error('Error fetching activities for the week', e)
            }
        }
        getTransactionsData()

    }, []);


    if (transactionsData == null) {
        return <div> thinkinggg....</div>
    }
    console.log('total_amounts: ', totalAmounts);
    return (
        <div
            style={{
                minHeight: '100vh',
                marginTop: '62px', 
                padding: '2rem',
                width: '100vw',
                overflowY: 'auto',
                color: 'white',
              
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: backgroundColor,
                position: 'relative',
                flexDirection: 'column',


            }}
        >
        <div style={{display:'flex', flexDirection:'row', alignItems:'center',justifyContent:'space-between', marginRight: '10vw', marginLeft:'10vw'}}>

            <div style={{border:'3px solid '+logoColor, backgroundColor: backgroundColor,borderRadius:'20px', width:'35vw', height:'200px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>

                <div style={{fontSize:'30px', color: logoColor, fontWeight:300}}> Próxima fecha de pago: <span style={{fontWeight:800, fontSize:'40px'}}>{totalAmounts?.next_due_date
        ? format(parseISO(totalAmounts.next_due_date), "dd/MM/yyyy")
        : '—'} </span></div>
                <div style={{fontSize:'30px', color: logoColor, fontWeight:300}}> Monto: <span style={{fontWeight:800, fontSize:'40px'}}>{Intl.NumberFormat('es-ES').format(totalAmounts['due_date_amount'])}  ARS</span></div>

            </div>
              <div style={{  width: '350px', height: '350px', border: '3px solid' + logoColor, backgroundColor: logoColor, borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                <div style={{ fontSize: '40px', fontWeight: 300 }}>Ventas:<span style={{ fontWeight: 800, fontSize: '50px' }}> {Intl.NumberFormat('es-ES').format(totalAmounts['total_amount'])} ARS</span> </div>
                <div style={{ fontSize: '20px', fontWeight: 300 }}>Transferidos:<span style={{ fontWeight: 800, fontSize: '30px' }}> {Intl.NumberFormat('es-ES').format(totalAmounts['payed_amount'])} ARS</span> </div>
                <div style={{ fontSize: '20px', fontWeight: 300 }}>Pendientes:<span style={{ fontWeight: 800, fontSize: '30px' }}> {Intl.NumberFormat('es-ES').format(totalAmounts['pending_amount'])} ARS</span> </div>
                <div style={{ fontSize: '20px', fontWeight: 300 }}>Gastos de uso de GoLocal:<span style={{ fontWeight: 800, fontSize: '30px' }}> {Intl.NumberFormat('es-ES').format(totalAmounts['app_service_payments'])} ARS</span> </div>

            </div>
        </div>
          
            {Object.values(transactionsData).reverse().map((transactionSet, index) => {
                const value = transactionsData[transactionSet];
                return <div key={index} style={{ color: 'black', width: '100%' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '2rem 0rem'
                    }}>
                        <div style={{ flex: 1, height: '2px', backgroundColor: '#FA7239' }}></div>
                        <span style={{ whiteSpace: 'nowrap', color: '#FA7239', fontSize: '30px', fontWeight: 400 }}>{index === 0 ? 'Pendiente de pago' : 'Pagado'}</span>
                    </div>

                    {Object.values(transactionSet).map((transaction, subIndex) => (
                        <div key={subIndex} className="card mx-3 mb-1" style={{ padding: '20px', color: 'black', display: 'flex', flexDirection: 'row', height: '20vh', border: '3px solid black', borderRadius: '20px', borderColor: logoColor, marginBottom: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start' }}>
                                <z style={{ fontSize: '25px', fontWeight: 300, lineHeight:1 }}>  Evento:  </z>

                                <div style={{ fontSize: '25px', fontWeight: 400 }}>  {transaction['activity']['name']}  </div>
                                <div style={{ fontSize: '20px', fontWeight: 300 }}>  {format(parseISO(transaction['activity']['startDateandtime']), "dd/MM/yyyy HH:mm")}  </div>
                            </div>
                            <div style={{ fontSize: '30px' }}>
                                ARS   {Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true
  }).format(transaction['total_amount'])}
                            </div>

                            <div style={{ fontSize: '20px' }}>
                                Fecha de pago: {format(parseISO(transaction['due_date']), "dd/MM/yyyy")}
                            </div>
                        </div>
                    ))}
                </div>
            })}
               <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '2rem',
                        width:'100%',
                        paddingLeft:'2rem'
                    }}>
                        <div style={{ flex: 1, height: '2px', backgroundColor: '#FA7239' }}></div>
                        <span style={{ margin: '0 1rem', whiteSpace: 'nowrap', color: '#FA7239', fontSize: '30px', fontWeight: 400 }}>Pagos de uso de GoLocal</span>
                    </div>
                    {
                
                Object.values(appPayments).map((payment) => (
                    <div style={{width:'100%'}}>
                        <div  className="card mx-3 mb-1" style={{ padding: '20px', margin:'1rem', color: 'black', display: 'flex', flexDirection: 'row',  border: '3px solid black', borderRadius: '20px', borderColor: logoColor, justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{fontSize:'20px', fontWeight:400}}>{payment['descripcion'] ? payment['descripcion']: 'No especificado'} </div>  
                        <div style={{fontSize:'20px', fontWeight:300}}>Fecha de pago: {format(parseISO(payment['updated_at']), "dd/MM/yyyy HH:mm")} </div>  
                        <div style={{fontSize:'20px', fontWeight:300}}>Transacción nº: <span style={{fontWeight:400}}>{payment['payment_id']} </span>  </div>  
                        <div style={{fontSize:'20px', fontWeight:300}}>Estado: <span style={{fontWeight:400}}>{payment['status'] === 'approved' ? 'Pagado':'Pendiente'} </span>  </div>  


                    </div>
                    </div>
                ))

            }


        </div>


    );
}
