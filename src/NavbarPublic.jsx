import { Navbar, Nav } from 'react-bootstrap'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import logo from './assets/goLocaltitle.png';
import { logoColor, orangeColor } from './constants';


export default function NavbarPublic() {
      const location = useLocation(); 


      const isMainPage = location.pathname === '/'; 
    return (
        <Navbar
            fixed="top"
            className="px-4 position-relative"
            style={{
                backgroundColor: orangeColor,
                boxShadow: 'none',
                color: 'white',
                zIndex: 1030,
                height: '18vh',
  
             

                
            }}
        >
            <Nav className="w-100" style={{justifyContent:'space-between', paddingLeft:'5vw', paddingRight:'5vw'}}>
               
             {isMainPage && ( <Nav.Link as={Link} to="/create_profile" style={{ fontSize: '30px', color: logoColor, fontWeight: 400, borderRadius: '20px', border: '3px solid #FA5039', backgroundColor: '#FEEDEB' , padding: '8px 20px',    
    display: 'inline-block'}}>
                    CREATE UNA CUENTA!                
                    
                    </Nav.Link>)}
                <Nav.Link as={Link} to="/"  className="position-absolute top-50 start-50 translate-middle"  style={{ lineHeight: 0 }} >
                    <img src={logo} style={{ height: '15vh', width: 'auto' }} />
                </Nav.Link>
                
                    
               {isMainPage && (  <Nav.Link as={Link} to="/login" style={{ fontSize: '30px', color: logoColor, fontWeight: 400, borderRadius: '20px', border: '3px solid #FA5039', backgroundColor: '#FEEDEB' , padding: '8px 20px',    
    display: 'inline-block'}}>
                    ENTRÁ!                
                    
                    </Nav.Link> )}
           
            </Nav>
        </Navbar>
    );
}