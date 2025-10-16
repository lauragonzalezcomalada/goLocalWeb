import React, { createContext, useState, useEffect } from 'react'
import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from './constants'

export const AuthContext = createContext()

// Centralitzar tota la part de autentificació, login, logout... aquí

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY))
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY))
  const [userProfile, setUserProfile] = useState(null)

  const fetchUserInfo = async (token) => {
    try {
      let response = await fetch(`${API_BASE_URL}/user/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Si está expirado o inválido
      if (response.status === 401) {
        console.log('response 401');
        const newAccessToken = await refreshTokenIfNeeded()
        if (!newAccessToken) return

        // Reintenta con el nuevo token
        response = await fetch(`${API_BASE_URL}/user/profile/`, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`
          }
        })
      }

      if (response.ok) {
        const data = await response.json()
        setUserProfile(data)
      } else {
        console.error('No se pudo obtener perfil del usuario, status:', response.status)
      }

    } catch (e) {
      console.error('Error al obtener info del usuario:', e)
    }
  }



  const refreshTokenIfNeeded = async () => {
    if (!refreshToken) return null

    try {
      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (!response.ok) return null

      const data = await response.json()
      localStorage.setItem(TOKEN_STORAGE_KEY, data.access)
      setAccessToken(data.access)
      return data.access
    } catch (e) {
      console.error('Error al refrescar token', e)
      return null
    }
  }

  //FUNCIÓ DE LOGIN QUE POT SER REUTILITZADA
  const login = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    if (!response.ok) throw new Error('Login inválido')

    const data = await response.json()
    localStorage.setItem(TOKEN_STORAGE_KEY, data.access)
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, data.refresh)

    setAccessToken(data.access)
    setRefreshToken(data.refresh)
    await fetchUserInfo(data.access)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
    setAccessToken(null)
    setRefreshToken(null)
    setUserProfile(null)
  }

  useEffect(() => {
    if (accessToken && !userProfile) {
      fetchUserInfo(accessToken)
    }
  }, [accessToken])

  useEffect(() => {
    if (accessToken) {
      // solo pide al backend si no tenemos cacheado userProfile
      fetchUserInfo(accessToken)
    }
  }, [accessToken])


  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, refreshTokenIfNeeded, login, logout, userProfile, setRefreshToken, isAuthenticated: !!accessToken }}>
      {children}
    </AuthContext.Provider>
  )
}
