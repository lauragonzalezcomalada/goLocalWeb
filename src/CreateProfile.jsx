// LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from './constants'


export default function LoginPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({});


  const [email, setEmail] = useState('')

  const [error, setError] = useState(null)
  const { login } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!username) {
      newErrors.name = "El nombre es obligatorio.";
    }
    if (!email) {
      newErrors.email = "El email es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El formato del email no es válido.";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar la contraseña";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
      newErrors.password = "Las contraseñas no coinciden.";

    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Formulario válido ✅", { email, password });
      setErrors({});
      const response = await fetch(`${API_BASE_URL}/signIn/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, password: password, email: email }),
      })
      const ct = response.headers.get('content-type') || '';
      const body = await (ct.includes('application/json') ? response.json() : response.text());

      if (!response.ok) {
        if (body['name_error']) {

          const newErrors = {};
          newErrors.name = "Ya existe un perfil con este nombre..."
          setErrors(newErrors);

        }
        if (body['email_error']) {
          const newErrors = {};
          newErrors.email = "Ya existe un perfil con este email..."
          setErrors(newErrors);
        }
        throw new Error('Login inválido');
      }
      await login(username, password)
      navigate('/onBoarding')

    }
  };
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 18vh)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        boxSizing: 'border-box',
        flexDirection: 'column',
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
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>CREATE PROFILE</h3>

        <div className="mb-3">
          <label>Nombre:</label>
          <input value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          {errors.name && (
            <small style={{ color: "red" }}>{errors.name}</small>
          )}
        </div>
        <div className="mb-3">
          <label>Email:</label>
          <input value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          {errors.email && (
            <small style={{ color: "red" }}>{errors.email}</small>
          )}
        </div>

        <div className="mb-3">
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          {errors.password && (
            <small style={{ color: "red" }}>{errors.password}</small>
          )}
        </div>

        <div className="mb-3">
          <label>Confirma la contraseña:</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          {errors.confirmPassword && (
            <small style={{ color: "red" }}>{errors.confirmPassword}</small>
          )}
        </div>

        <button className="mt-3" type="submit" style={{ justifyContent: 'center', padding: '0.5rem' }} >CREA TU CUENTA</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}            </form>
    </div>


  )
}
