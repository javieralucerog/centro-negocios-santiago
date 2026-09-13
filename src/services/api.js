const API_URL = 'http://127.0.0.1:8888/centro-negocios-api'

export async function getServices(signal) {
  const response = await fetch(`${API_URL}/servicios.php`, {
    signal,
  })

  if (!response.ok) {
    throw new Error('No fue posible consultar los servicios.')
  }

  const data = await response.json()

  const isValid =
    Array.isArray(data) &&
    data.every(
      (service) =>
        service !== null &&
        typeof service === 'object' &&
        typeof service.id === 'string' &&
        typeof service.title === 'string' &&
        typeof service.description === 'string' &&
        typeof service.image === 'string' &&
        service.image.startsWith('/images/')
    ) &&
    new Set(data.map((service) => service.id)).size === data.length

  if (!isValid) {
    throw new Error('La respuesta de servicios no tiene el formato esperado.')
  }

  return data
}

export async function getAbout(signal) {
  const response = await fetch(`${API_URL}/nosotros.php`, {
    signal,
  })

  if (!response.ok) {
    throw new Error('No fue posible consultar la información del centro.')
  }

  const data = await response.json()

  if (
    data === null ||
    typeof data !== 'object' ||
    Array.isArray(data) ||
    typeof data.title !== 'string' ||
    typeof data.description !== 'string' ||
    typeof data.detail !== 'string'
  ) {
    throw new Error('La información del centro no tiene el formato esperado.')
  }

  return data
}

export async function getQuestions(signal) {
  const response = await fetch(`${API_URL}/preguntas.php`, {
    signal,
  })

  if (!response.ok) {
    throw new Error('No fue posible consultar las preguntas.')
  }

  const data = await response.json()

  const isValid =
    Array.isArray(data) &&
    data.every(
      (item) =>
        item !== null &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.question === 'string' &&
        typeof item.answer === 'string'
    ) &&
    new Set(data.map((item) => item.id)).size === data.length

  if (!isValid) {
    throw new Error('Las preguntas no tienen el formato esperado.')
  }

  return data
}