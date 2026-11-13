// Fotos reales de NASA para cada cuerpo, desde la NASA Image and Video Library.
// https://images.nasa.gov — pública, sin clave. Acepta pedidos desde el navegador.
// Cada cuerpo tiene una foto elegida a mano (nasaId en el catálogo), porque la búsqueda
// por texto devuelve fotos de conferencias, lanzamientos o maquetas.

const API = 'https://images-api.nasa.gov'
const cache = new Map()

// Miniatura directa (sin pedir nada a la API): se usa en la grilla del álbum
export const nasaThumb = (nasaId) =>
  `https://images-assets.nasa.gov/image/${nasaId}/${nasaId}~thumb.jpg`

// Foto en mejor calidad + título, misión, fecha y crédito
export async function getNasaPhoto(nasaId) {
  if (cache.has(nasaId)) return cache.get(nasaId)

  const [search, asset] = await Promise.all([
    fetch(`${API}/search?nasa_id=${nasaId}`).then((r) => r.json()),
    fetch(`${API}/asset/${nasaId}`).then((r) => r.json()),
  ])
  const meta = search.collection.items[0]?.data[0]
  if (!meta) throw new Error('Foto no encontrada')

  // De los tamaños disponibles, se usa el mediano (o el chico si no hay mediano)
  const files = asset.collection.items.map((i) => i.href.replace('http://', 'https://'))
  const image = files.find((h) => h.includes('~medium.jpg')) || files.find((h) => h.includes('~small.jpg')) || nasaThumb(nasaId)

  const photo = {
    image,
    title: meta.title,
    year: meta.date_created?.slice(0, 4),
    credit: meta.secondary_creator || `NASA / ${meta.center}`,
    mission: meta.keywords?.find((k) => !/^(Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Moon|Io|Europa|Ganymede|Callisto|Titan|Ceres)$/i.test(k)) ?? null,
    link: `https://images.nasa.gov/details/${nasaId}`,
    // Descripción sin etiquetas HTML (algunas vienen con enlaces o negritas)
    description: (meta.description || '').replace(/<[^>]+>/g, '').trim(),
  }
  cache.set(nasaId, photo)
  return photo
}

// Plan B para la foto del día: fotos icónicas de NASA elegidas a mano.
// Se elige una distinta cada día (el número de día del año decide cuál).
const FEATURED = [
  'carina_nebula', 'PIA03606', 'PIA04921', 'PIA04227', 'PIA21381', 'PIA15658', 'NHQ201708210116',
  'iss058e005282', 'PIA03096', 'PIA17172', 'PIA06193', 'PIA21775', 'PIA19952', 'PIA24622',
  'art002e021278', 'GSFC_20171208_Archive_e000842', 'PIA00452', 'PIA14617', 'PIA25433',
]

export function getDailyFeature(date = new Date()) {
  const day = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000)
  return getNasaPhoto(FEATURED[day % FEATURED.length])
}

// Desde fines de 2026 la API de APOD devuelve el logo de NASA en lugar de la foto
// (la página original se mudó y la API no la encuentra). Esto detecta ese caso.
export const isRealApod = (apod) =>
  apod && apod.title !== 'NASA Science' && !/nasa-logo/.test(apod.url || '')

// Foto astronómica del día (APOD). Pasa por /api/apod (función serverless en Vercel,
// proxy de Vite en desarrollo) para que la clave de NASA no llegue al navegador.
export async function getApod() {
  const res = await fetch('/api/apod')
  if (!res.ok) throw new Error(`APOD respondió ${res.status}`)
  return res.json()
}
