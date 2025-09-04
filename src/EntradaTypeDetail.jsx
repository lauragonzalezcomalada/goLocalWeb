import EditableEntradaCard from './EditableEntradaCard';
import { useLocation } from 'react-router-dom'


export default function EntradaTypeDetail() {


    const location = useLocation()
    const { evento_tipo, entrada_uuid, entrada_name, entrada_shortDesc, evento_image, evento_fecha, entrada_precio,
        entrada_disponibles, entrada_max_disp, entrada_vendidas, entrada_porcentajedeventas
        } = location.state || {}

    return <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ 
      
        width: '100%', 
        minHeight: 'calc(100vh - 56px - 170px)' // altura total menos el margin-top
      }}
    >
        <EditableEntradaCard initialData={{tipo:evento_tipo, uuid: entrada_uuid, nombre: entrada_name , descripcion: entrada_shortDesc, imagen : evento_image, fecha: evento_fecha, precio: entrada_precio, disponibles: entrada_disponibles, max_disponibilidad: entrada_max_disp, vendidas: entrada_vendidas, porcentaje_ventas:entrada_porcentajedeventas}} />
    </div>
}