// Fotos reales de NASA para cada cuerpo, desde la NASA Image and Video Library.
// https://images.nasa.gov — pública, sin clave. Acepta pedidos desde el navegador.
// Cada cuerpo tiene una foto elegida a mano (nasaId en el catálogo), porque la búsqueda
// por texto devuelve fotos de conferencias, lanzamientos o maquetas.

const API = 'https://images-api.nasa.gov'
const cache = new Map()

// Miniatura directa (sin pedir nada a la API): se usa en la grilla de la Pokédex
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
  }
  cache.set(nasaId, photo)
  return photo
}

// Foto astronómica del día (APOD). Pasa por /api/apod (función serverless en Vercel,
// proxy de Vite en desarrollo) para que la clave de NASA no llegue al navegador.
export async function getApod() {
  const res = await fetch('/api/apod')
  if (!res.ok) throw new Error(`APOD respondió ${res.status}`)
  return res.json()
}
