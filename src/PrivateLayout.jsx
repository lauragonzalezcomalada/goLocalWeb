import { Outlet } from 'react-router-dom'
import NavbarPrivate from './NavbarPrivate'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export default function PrivateLayout() {

  const { userProfile } = useContext(AuthContext)
  
  return (
    <>
      <NavbarPrivate name={userProfile?.username || 'Usuario'}/>    {/* siempre presente */}
      <div
                style={{
                    minHeight: '100vh',
                    width: '100vw',
                    overflowY: 'auto',
                    backgroundColor: '#f8f9fa',
                    position: 'relative', // Para posicionar hijos de forma absoluta respecto a él
                    paddingTop: '170px', // Compensa altura de navbar + banner
                }}
            >
                <Outlet />
            </div>        {/* se reemplaza por la ruta hija actual */}
    </>
  )
}
