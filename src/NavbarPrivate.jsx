import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

export default function NavbarPrivate({ name }) {

    const navigate = useNavigate()


    return (
        <>
            {/* 🎉 Frame superior fijo */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100px',
                    backgroundColor: '#ffcc00',
                    padding: '0.5rem',
                    textAlign: 'center',
                    zIndex: 1040,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px'// más alto que el Navbar
                }}
            >
                GOLOCAL            </div>

            <div
                className='flex'

                style={{
                    position: 'fixed',
                    top: 100,
                    left: 0,
                    width: '100%',
                    height: '70px',
                    backgroundColor: '#62ff00ff',
                    padding: '0.5rem',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '20px',
                    paddingRight: '0.5rem',
                    zIndex: 1040, // má alto que el Navbar
                }}
            >
                <span style={{ marginLeft: '5rem' }}>
                    <button type="button" class="btn btn-outline-secondary" style={{ width: '300px' }} onClick={() => navigate('/crearEventoFromScratch')}>
                        <i class="bi bi-plus-lg" style={{ paddingRight: '20px' }}></i>
                        Crear nuevo evento</button>

                </span>
                <span style={{ marginRight: '10rem', fontWeight:'lighter', fontSize:'30px'}}>
                    🎉 ¡Bienvenido <span onClick={() => navigate('/profileScreen')} style={{
                       
                       fontWeight:'bold',
                        cursor: 'pointer',
                    }}
                        onMouseOver={(e) => (e.target.style.color = 'red')}
                        onMouseOut={(e) => (e.target.style.color = 'black')}>{name} </span>!
                </span>

            </div>
            {/* Navbar justo debajo */}
            <Navbar
                expand="sm"
                fixed="top"
                style={{
                    top: '170px', // Altura del banner
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    zIndex: 1030,
                }}
                className="px-4"
            >
                <Container>
                    <Nav className="w-100 justify-content-between">
                        <Nav.Link as={Link} to="/mainlogged" className="text-black">
                            inicio
                        </Nav.Link>
                       {/* <Nav.Link as={Link} to="/mainlogged" className="text-black">
                            <i class="bi bi-bar-chart-line"></i>
                        </Nav.Link> */}
                        <Nav.Link as={Link} to="/entradas" className="text-black">
                            <i class="bi bi-ticket-perforated"></i>                        </Nav.Link>
                        <Nav.Link as={Link} to="/crearEventoChooseOption" className="text-black">
                            <i class="bi bi-patch-plus"></i>

                        </Nav.Link>

                        {/* Podés habilitar este cuando quieras */}
                        {/*
                        <Nav.Link as={Link} to="/login" className="text-black">
                            LoginPrivate
                        </Nav.Link>
                        */}
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}
