// LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { backgroundColor, logoColor } from './constants'

export default function LoginPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useContext(AuthContext)
  const [showPwd, setShowPwd] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      //aquest login es el login de authcontext
      await login(username, password)
      navigate('/mainlogged')
    } catch (e) {
      console.error(e)
      setError('Email o contraseña incorrectos.')
    }
  }

  return (
    <div
      style={{
        height: 'calc(100vh - 18vh)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '56px',
        boxSizing: 'border-box',
        flexDirection: 'column',
        backgroundColor: backgroundColor
      }}
    >
      <form onSubmit={handleSubmit} style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '40px', color: logoColor, fontWeight: 900 }}>LOGIN</h3>
        <div className="mb-3">
          <label style={{ color: logoColor, fontSize: '30px', fontWeight: 800 }}>USERNAME:</label>
          <input value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '0.5rem', fontSize: '20px', color: logoColor }} />
        </div>
        <div className="mb-3">
          <label style={{ color: logoColor, fontSize: '30px', fontWeight: 800, display: 'block' }}>PASSWORD:</label>
          <div style={{ position: 'relative', alignItems:'center' }}>



            <input type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: "0.5rem 3rem 0.5rem 0.5rem", fontSize: '20px', color: logoColor }} />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
              aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              title={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              style={{
                position: "absolute",
                right: "1rem",
                top:'1.5rem',
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
                lineHeight: 0
              }}
            >
              {showPwd ? <i class="bi bi-eye-slash fs-4" style={{color:logoColor}}></i> : <i class="bi bi-eye fs-4"  style={{color:logoColor}}></i>
              }
            </button>
          </div>
        </div>
        <button className="mt-3" type="submit" style={{ justifyContent: 'center', padding: '0.5rem', fontSize: '30px', color: 'white', fontWeight: 900, backgroundColor: logoColor, borderRadius: '20px', border: '2px solid' + logoColor }} >ENTRÁ!</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}            </form>
          <button className="mt-3" onClick={navigate('/recoverPwd')} style={{ justifyContent: 'center', padding: '0.5rem', fontSize: '20px', color: logoColor, fontWeight: 400, backgroundColor: backgroundColor, borderRadius:'20px'}}>¿Olvidaste tu contraseña?</button>

    </div>


  )
}


