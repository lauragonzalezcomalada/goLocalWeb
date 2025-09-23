import { Navbar, Nav } from 'react-bootstrap'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import logo from './assets/golocaltitle.png';

export default function NavbarPublic() {
    return (
        <Navbar
            fixed="top"
            className="px-4"
            style={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                zIndex: 1030,
            }}
        >
            <Nav className="w-100 justify-content-between text-white">
                <Nav.Link as={Link} to="/" className="text-black">
                   <img src={logo} style={{height:'8vh', width:'auto'}} />
                </Nav.Link>
                <Nav.Link as={Link} to="/login" className="text-black">
                    Login
                </Nav.Link>
            </Nav>
        </Navbar>
    );
}