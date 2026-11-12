import { useEffect, useState } from 'react'
import { getApod, getDailyFeature, isRealApod } from '../services/nasa'

// Foto astronómica del día de NASA (APOD). El texto viene en inglés desde NASA.
// Si la API de APOD falla o devuelve el logo de NASA en vez de la foto (pasa desde
// noviembre de 2026), se muestra una foto icónica de la NASA Image Library que cambia cada día.
export default function Apod() {
  const [item, setItem] = useState(null)
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const apod = await getApod()
        if (isRealApod(apod)) {
          const [y, m, d] = apod.date.split('-')
          setItem({
            source: `Foto astronómica del día · NASA APOD · ${d}/${m}/${y}`,
            image: apod.media_type === 'image' ? apod.url : apod.thumbnail_url, // si es un video, su miniatura
            link: apod.hdurl || apod.url,
            title: apod.title,
            credit: apod.copyright ? `© ${apod.copyright.trim()}` : 'NASA',
            text: apod.explanation,
          })
          return
        }
      } catch {
        // Si APOD no responde, se sigue con el plan B
      }
      try {
        const photo = await getDailyFeature()
        setItem({
          source: 'Imagen del día · NASA Image Library',
          image: photo.image,
          link: photo.link,
          title: photo.title,
          credit: [photo.credit, photo.year].filter(Boolean).join(' · '),
          text: photo.description,
        })
      } catch {
        setError(true)
      }
    }
    load()
  }, [])

  if (error) {
    return (
      <section className="card apod">
        <h2>Imagen del día</h2>
        <p className="muted small">No se pudo cargar la imagen de NASA en este momento.</p>
      </section>
    )
  }
  if (!item) {
    return (
      <section className="card apod">
        <h2>Imagen del día</h2>
        <p className="loading">Cargando la imagen de NASA…</p>
      </section>
    )
  }

  return (
    <section className="card apod">
      <p className="eyebrow">{item.source}</p>
      {item.image && (
        <a href={item.link} target="_blank" rel="noreferrer">
          <img src={item.image} alt={item.title} loading="lazy" />
        </a>
      )}
      <h2>{item.title}</h2>
      <p className="muted small">{item.credit}</p>
      {item.text && (
        <>
          <button className="link" onClick={() => setOpen(!open)}>
            {open ? 'Ocultar descripción' : 'Leer descripción (en inglés)'}
          </button>
          {open && <p className="apod-text">{item.text}</p>}
        </>
      )}
    </section>
  )
}
