// LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useContext(AuthContext)

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
        height: '100vh',        // altura total de la ventana
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '56px',     // para que no quede tapado si tenés navbar fijo
        boxSizing: 'border-box',
        flexDirection: 'column', // para que los hijos vayan en columna
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
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Login</h3>
        <div className="mb-3">
          <label>Username:</label>
          <input value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <div className="mb-3">
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <button className="mt-3" type="submit" style={{ justifyContent: 'center', padding: '0.5rem' }} >Registra't</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}            </form>
    </div>


  )
}
