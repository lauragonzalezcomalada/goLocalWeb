import EditableEntradaCard from './EditableEntradaCard';
import { useLocation } from 'react-router-dom'


export default function EntradaTypeDetail() {


    const location = useLocation()
    console.log(location)
    const { evento_tipo, entrada_uuid, entrada_name, entrada_shortDesc, evento_image, evento_fecha, entrada_precio,
entrada_disponibles, entrada_max_disp, entrada_vendidas, entrada_porcentajedeventas
} = location.state || {}

    console.log(evento_tipo)
    console.log(entrada_uuid)

    return <div className="d-flex align-items-start" style={{ marginTop: '56px', width: '100%', 
overflowY: 'hidden', backgroundColor: 'rgba(255,255,0,1)' }}>



        <EditableEntradaCard initialData={{tipo:evento_tipo, uuid: entrada_uuid, nombre: entrada_name , descripcion: entrada_shortDesc, imagen : evento_image, fecha: evento_fecha, precio: entrada_precio, disponibles: entrada_disponibles, max_disponibilidad: entrada_max_disp, vendidas: entrada_vendidas, porcentaje_ventas:entrada_porcentajedeventas, precio:entrada_precio}} />



    </div>
}