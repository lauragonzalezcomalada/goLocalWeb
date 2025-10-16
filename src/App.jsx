import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import HomePage from './HomePage'
import LoginPage from './LoginPage'
import MainLoggedPage from './MainLoggedPage'
import CreateProfile from './CreateProfile'
import OnBoarding from './OnBoarding'
import PrivateLayout from './PrivateLayout'
import PublicLayout from './PublicLayout'
import EventDetailPage from './EventDetailPage'
import EntradasPage from './EntradasPage'
import EntradaTypeDetail from './EntradaTypeDetail'
import CrearEventoFromScratch from './CrearEventoFromScratch'
import CrearEventoPlantillas from './CrearEventoPlantillas'
import CrearEventoPageChooseOption from './CrearEventoPageChooseOption'
import ProfileScreen from './ProfileScreen'
import ReservaTypeDetail from './ReservaTypeDetail'
import ExternalLinkDetail from './ExternalLinkDetail'
import CompraDeBonos from './CompraDeBonos'
import Transacciones from './Transacciones'
import ExtenderRangoPlanesPagos from './ExtenderRangoPlanesPagos'
import ToMobileApp from './ToMobileApp'
import RecoverPwd from './RecoverPwd'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'


export default function App() {

  const { accessToken } = useContext(AuthContext)
  const isLoggedIn = !!accessToken

  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create_profile" element={<CreateProfile />} />
          <Route path="/toMobileApp" element={<ToMobileApp />} />
          <Route path="/recoverPwd" element={<RecoverPwd />} />

          


        </Route>
        {/* Páginas privadas */}

        <Route path="/onBoarding" element={<OnBoarding /> } />

        {isLoggedIn && (
          <Route element={<PrivateLayout />}>
            <Route path="/mainlogged" element={<MainLoggedPage />} />
            <Route path="/eventDetail" element={<EventDetailPage />} />
            <Route path="/entradas" element={<EntradasPage />} />
            <Route path="/entradaDetail" element={<EntradaTypeDetail />} />
            <Route path="/crearEventoChooseOption" element={<CrearEventoPageChooseOption />} />
            <Route path="/crearEventoFromScratch" element={<CrearEventoFromScratch />} />
            <Route path="/crearEventoPlantillas" element={<CrearEventoPlantillas />} />
            <Route path="/profileScreen" element={<ProfileScreen />} />
            <Route path="/reservaDetail" element={<ReservaTypeDetail /> } />
            <Route path="/externalLinkDetail" element={<ExternalLinkDetail /> } />
            <Route path="/comprarBono" element={<CompraDeBonos /> } />
            <Route path="/extendRangoPlanesPagos" element={<ExtenderRangoPlanesPagos /> } />
            <Route path="/transacciones" element={<Transacciones /> } />

         

            

          </Route>
        )}

        {/* 🔒 Protegido: si no logueado → login */}
        {!isLoggedIn && (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>





    </BrowserRouter>
  )
}
