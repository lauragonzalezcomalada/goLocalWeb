

import { API_BASE_URL, TOKEN_STORAGE_KEY,REFRESH_TOKEN_STORAGE_KEY } from './constants.js'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'

// auth.js
export async function refreshTokenIfNeeded() {

  const accessToken = localStorage.getItem(TOKEN_STORAGE_KEY)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)

  if (!accessToken || !refreshToken) return null

  // Opcional: chequeá expiración decodificando el JWT (puedo ayudarte)
  // Pero más simple: si falla una request con 401, entonces refrescás

  try {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) throw new Error('Refresh token inválido')

    const data = await response.json()
    localStorage.setItem('TOKEN_STORAGE_KEY', data.access)
    return data.access
  } catch (e) {
    console.error('Error refrescando token', e)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem('refresh')
    // Redirigir al login si querés
    return null
  }
}
