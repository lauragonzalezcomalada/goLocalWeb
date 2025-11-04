import { Container, Row, Col, Card } from 'react-bootstrap'
import EventCard from './EventCard'
import React, { useMemo, useEffect } from 'react'
import { logoColor } from './constants'

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

const WeekCalendar = React.memo(function WeekCalendar({ esteLunes, eventos }) {
    const fechas =  useMemo(() => obtenerFechasSemanaActual(esteLunes));

    return (

        <div
            style={{
                minWidth: '95vw',
                height: '85vh',
                boxSizing: 'border-box',
                overflowX: 'auto',
                margin: '0 auto',
                color: logoColor
            }}
        >
            <Container fluid style={{ minHeight: '40vh' }}>
                <Row >
                    {fechas.map((day,index) => (

                        <Col
                            key={day}
                            className="d-flex flex-column align-items-center"
                            style={{ padding: '0.5rem', 
                                color:'black',
                                 borderLeft: index === 0 ? 'none' : '1px solid '+logoColor,
        borderRight: index === fechas.length - 1 ? 'none' : '1px solid '+logoColor, }}
                        >
                            <div className="mb-2" style={{ color: logoColor, fontWeight:400, fontSize:'30px' }}>{day}</div>
                          
                            {(eventos[day] || []).map((evento, index) => {
                              
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
                      {Object.values(eventos).every(arr => arr.length === 0) && (
                                <Card className="text-center mt-5"  style={{ width: '100%', height: '100%', backgroundColor:'transparent', color: logoColor, fontWeight:800, fontSize:'30px' }}>
                                    <Card.Body>
                                        <Card.Text>NO HAY EVENTOS CREADOS PARA ESTA SEMANA</Card.Text>
                                    </Card.Body>
                                </Card>
                            )}
                </Row>
            </Container>
        </div>
    )
})
export default WeekCalendar