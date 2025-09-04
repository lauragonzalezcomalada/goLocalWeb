import EditableReservaCard from './EditableReservaCard';
import { useLocation } from 'react-router-dom'


export default function ReservaTypeDetail() {


    const location = useLocation()
    console.log(location)
    const { evento_tipo, reserva_uuid, reserva_nombre, evento_image, evento_fecha,
        reserva_confirmadas, reserva_max_disponibilidad, reserva_porcentaje_reservado, reserva_campos
    } = location.state || {}


    return <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ 
        width: '100%', 
        minHeight: 'calc(100vh - 56px - 170px)' // altura total menos el margin-top
      }}
    >
        <EditableReservaCard initialData={{ tipo: evento_tipo, uuid: reserva_uuid, nombre: reserva_nombre, imagen: evento_image, fecha: evento_fecha, confirmadas: reserva_confirmadas, max_disponibilidad: reserva_max_disponibilidad, porcentaje_ventas: reserva_porcentaje_reservado, campos: reserva_campos }} />
    </div>
}