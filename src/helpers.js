export function formatDate(dateInput) {
  if (!dateInput) {
    return { fecha: 'Fecha inválida', hora: 'Hora inválida' }
  }

  const date = new Date(dateInput)

  if (isNaN(date.getTime())) {
    return { fecha: 'Fecha inválida', hora: 'Hora inválida' }
  }

  const fechaFormateada = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)

  const horaFormateada = date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const dia = date.getUTCDate();
  const mes = new Intl.DateTimeFormat('es-AR', { month: 'short', timeZone: 'UTC' }).format(date).toUpperCase(); // "AGO"
  

  return { fecha: fechaFormateada, hora: horaFormateada, dia: dia , mes:mes  }
}

export function shortFormatDate(){

  const date = new Date()

  const fechaFormateada = new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month:'long'
  }).format(date).toUpperCase()
  return fechaFormateada;
}


export function obtenerLunes(fecha) {
  const d = new Date(fecha)
  const dia = d.getDay()
  const diff = d.getDate() - ((dia + 6) % 7) // lunes es 0 en esta lógica
  const lunes = new Date(d.setDate(diff))
  lunes.setHours(0, 0, 0, 0)
  return lunes
}

