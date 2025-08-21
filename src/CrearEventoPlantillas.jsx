import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from './constants.js'
import { useState, useEffect } from 'react'
import WeekCalendar from './WeekCalendar.jsx'
import { Container, Card } from 'react-bootstrap';
import { useContext } from 'react'
import { AuthContext } from './AuthContext.jsx'
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';


export default function CrearEventoPlantillas() {


    const navigate = useNavigate()

    return <div style={{ marginTop: '56px', width: '100%', height: '100%', backgroundColor: 'rgba(255,255,0,1)' }}>
            plantillas
        </div>;}