import EditableEntradaCard from './EditableEntradaCard';
import { useLocation } from 'react-router-dom'
import { API_BASE_URL,backgroundColor } from './constants'

export default function EntradaTypeDetail() {


    const location = useLocation()
/*
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
                        const newAccessToken = await refreshTokenIfNeeded()
                        if (!newAccessToken) return
    
                        response = await fetch(`${API_BASE_URL}/user/profile/`, {
                            headers: {
                                Authorization: `Bearer ${newAccessToken}`
                            }
                        })
                        if (response.ok) {
                            data = await response.json()
                        }
                    }
    
                    setUserProfile(data)  
                } catch (e) {
                    console.error('Error fetching user profile', e)
                }
            }
            fetchUserProfile()
        }, [accessToken])
    */

        
    const { evento_tipo, entrada_uuid, entrada_name, entrada_shortDesc, evento_image, evento_fecha, entrada_precio,
        entrada_disponibles, entrada_max_disp, entrada_vendidas, entrada_porcentajedeventas
        } = location.state || {}

    return <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ 
        backgroundColor:backgroundColor,
        width: '100%', 
        minHeight: 'calc(100vh - 56px - 170px)' // altura total menos el margin-top
      }}
    >
        <EditableEntradaCard initialData={{tipo:evento_tipo, uuid: entrada_uuid, nombre: entrada_name , descripcion: entrada_shortDesc, imagen : evento_image, fecha: evento_fecha, precio: entrada_precio, disponibles: entrada_disponibles, max_disponibilidad: entrada_max_disp, vendidas: entrada_vendidas, porcentaje_ventas:entrada_porcentajedeventas}} />
    </div>
}