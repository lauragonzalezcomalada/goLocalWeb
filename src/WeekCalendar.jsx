import { Container, Row, Col, Card } from 'react-bootstrap'
import EventCard from './EventCard'


function obtenerFechasSemanaActual(esteLunes) {
    const hoy = new Date(esteLunes)
    const diaSemana = hoy.getDay() // 0: domingo, 1: lunes...
    const lunes = new Date(hoy)
    lunes.setDate(hoy.getDate() - ((diaSemana + 6) % 7)) // ir al lunes

    const fechas = []
    for (let i = 0; i < 7; i++) {
        const actual = new Date(lunes)
        actual.setDate(lunes.getDate() + i)
        const dia = String(actual.getDate()).padStart(2, '0')
        const mes = String(actual.getMonth() + 1).padStart(2, '0')
        fechas.push(`${dia}/${mes}`)
    }

    return fechas // ['22/07', '23/07', ...]
}

export default function WeekCalendar({ esteLunes, eventos }) {
    const fechas = obtenerFechasSemanaActual(esteLunes)

   
    return (

        <div
            style={{
                minWidth: '95vw',
                height: '85vh',
                boxSizing: 'border-box',
                overflowX: 'auto',
                margin: '0 auto'
            }}
        >
            <Container fluid style={{ minHeight: '40vh' }}>
                <Row >
                    {fechas.map((day,index) => (

                        <Col
                            key={day}
                            className="d-flex flex-column align-items-center"
                            style={{ padding: '0.5rem', 
                                
                                 borderLeft: index === 0 ? 'none' : '0.5px solid black',
        borderRight: index === fechas.length - 1 ? 'none' : '0.5px solid black', }}
                        >
                            <div className="fw-lighter mb-2 fs-2" style={{ color: 'black' }}>{day}</div>
                          
                            {(eventos[day] || []).map((evento, index) => {
                                console.log(evento)
                                return (
                                    <EventCard
                                        tipo={evento.tipo}
                                        uuid={evento.uuid}
                                        name={evento.name}
                                        imageUrl={evento.image}
                                        gratis={evento.gratis}
                                        shortDesc={evento.shortDesc}
                                        tags={evento.tag_detail}
                                        asistentes={evento.asistentes.length}
                                        activo={evento.active}
                                    />
                                )

                            })}

                            

                            {/* Acá se podrán insertar eventos más adelante */}
                        </Col>
                    ))}
                      {Object.keys(eventos).length === 0 && (
                                <Card className="text-center mt-5"  style={{ width: '100%', height: '100%', backgroundColor:'transparent' }}>
                                    <Card.Body>
                                        <Card.Text>No hay eventos para esta semana</Card.Text>
                                    </Card.Body>
                                </Card>
                            )}
                </Row>
            </Container>
        </div>
    )
}
