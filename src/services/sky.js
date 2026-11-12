// "¿Qué puedo ver esta noche?": cálculos astronómicos con Astronomy Engine.
// Es una librería que corre en el navegador: no usa internet ni necesita clave.
// https://github.com/cosinekitty/astronomy
import * as Astronomy from 'astronomy-engine'

export const BUENOS_AIRES = { lat: -34.6037, lon: -58.3816, label: 'Buenos Aires' }

const MIN_ALTITUDE = 10 // grados sobre el horizonte para considerarlo visible
const STEP_MINUTES = 10 // cada cuánto se revisa la posición durante la noche

const DIRECTIONS = ['Norte', 'Noreste', 'Este', 'Sureste', 'Sur', 'Suroeste', 'Oeste', 'Noroeste']
const direction = (azimuth) => DIRECTIONS[Math.round(azimuth / 45) % 8]

function heightLabel(altitude) {
  if (altitude < 20) return 'bajo, cerca del horizonte'
  if (altitude < 45) return 'a media altura'
  return 'alto en el cielo'
}

function altAz(body, date, observer) {
  const eq = Astronomy.Equator(body, date, observer, true, true)
  return Astronomy.Horizon(date, observer, eq.ra, eq.dec, 'normal')
}

// La noche "útil" va desde que el Sol baja 6° bajo el horizonte (fin del crepúsculo)
// hasta que vuelve a subir a -6°. Si ya es de noche, arranca ahora.
function nightWindow(observer, now) {
  const sunNow = altAz('Sun', now, observer).altitude
  const start = sunNow < -6
    ? now
    : Astronomy.SearchAltitude('Sun', observer, -1, now, 1, -6)?.date
  if (!start) return null
  const end = Astronomy.SearchAltitude('Sun', observer, +1, start, 1, -6)?.date
  if (!end) return null
  return { start, end, isNight: sunNow < -6 }
}

// Para un cuerpo, recorre la noche y busca el momento en que está más alto.
function bestMoment(body, observer, night) {
  let best = null
  let firstVisible = null
  let lastVisible = null
  for (let t = night.start.getTime(); t <= night.end.getTime(); t += STEP_MINUTES * 60000) {
    const date = new Date(t)
    const { altitude, azimuth } = altAz(body, date, observer)
    if (altitude >= MIN_ALTITUDE) {
      firstVisible ??= date
      lastVisible = date
      if (!best || altitude > best.altitude) best = { date, altitude, azimuth }
    }
  }
  if (!best) return null
  return {
    bestTime: best.date,
    from: firstVisible,
    until: lastVisible,
    altitude: Math.round(best.altitude),
    direction: direction(best.azimuth),
    height: heightLabel(best.altitude),
  }
}

export function moonPhase(date = new Date()) {
  const angle = Astronomy.MoonPhase(date) // 0 = nueva, 90 = cuarto creciente, 180 = llena, 270 = cuarto menguante
  const illuminated = Math.round(Astronomy.Illumination('Moon', date).phase_fraction * 100)
  let name
  if (angle < 10 || angle >= 350) name = 'Luna nueva'
  else if (angle < 80) name = 'Creciente'
  else if (angle < 100) name = 'Cuarto creciente'
  else if (angle < 170) name = 'Gibosa creciente'
  else if (angle < 190) name = 'Luna llena'
  else if (angle < 260) name = 'Gibosa menguante'
  else if (angle < 280) name = 'Cuarto menguante'
  else name = 'Menguante'

  const advice = illuminated > 70
    ? 'Mucha luz lunar: los planetas brillantes se ven bien, pero los objetos tenues cuestan.'
    : illuminated < 30
      ? 'Poca luz lunar: buena noche para buscar objetos tenues.'
      : 'Luz lunar moderada.'
  return { angle, name, illuminated, waxing: angle < 180, advice }
}

// Calcula, para cada cuerpo del catálogo, si se puede ver esta noche y cuándo.
// Devuelve un objeto { [bodyId]: resultado | null } más los datos de la noche.
export function computeTonight(catalog, location = BUENOS_AIRES, now = new Date()) {
  const observer = new Astronomy.Observer(location.lat, location.lon, 0)
  const night = nightWindow(observer, now)
  const byBody = {}
  const cache = {} // las lunas de Júpiter reutilizan el cálculo de Júpiter

  for (const b of catalog) {
    if (!b.sky || !night) {
      byBody[b.id] = null
      continue
    }
    cache[b.sky] ??= bestMoment(b.sky, observer, night)
    byBody[b.id] = cache[b.sky]
  }

  return { night, byBody, moon: moonPhase(now), location, computedAt: now }
}

export const formatTime = (date) =>
  date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })

// Texto del rango de visibilidad. Si se ve menos de media hora, se aclara.
export function rangeText(info) {
  const minutes = (info.until - info.from) / 60000
  return minutes < 30
    ? `solo un rato, cerca de las ${formatTime(info.bestTime)}`
    : `de ${formatTime(info.from)} a ${formatTime(info.until)}`
}
