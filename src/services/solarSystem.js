// Datos científicos de cada cuerpo desde Le Système Solaire API.
// https://api.le-systeme-solaire.net — gratuita, requiere un token.
// El pedido pasa por /api/body (función serverless en Vercel, proxy de Vite en desarrollo),
// porque la API no acepta pedidos con token directo desde el navegador.

const cache = new Map() // evita pedir dos veces el mismo cuerpo

export async function getBody(id) {
  if (cache.has(id)) return cache.get(id)
  const res = await fetch(`/api/body?id=${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error(`La API respondió ${res.status}`)
  const b = await res.json()
  // La API usa 0 cuando no tiene el dato: se convierte en null para no mostrarlo
  const data = {
    gravity: b.gravity || null, // m/s²
    meanRadius: b.meanRadius || null, // km
    avgTempC: b.avgTemp ? Math.round(b.avgTemp - 273.15) : null, // viene en Kelvin
    dayHours: b.sideralRotation ? Math.abs(b.sideralRotation) : null, // horas
    yearDays: b.sideralOrbit || null, // días
    distanceKm: b.semimajorAxis || null, // al Sol, o a su planeta si es una luna
    moons: b.moons ? b.moons.length : 0,
    mass: b.mass ? `${b.mass.massValue} × 10^${b.mass.massExponent} kg` : null,
    discoveredBy: b.discoveredBy || null,
    discoveryDate: b.discoveryDate || null,
    aroundPlanet: b.aroundPlanet?.planet ?? null,
  }
  cache.set(id, data)
  return data
}
