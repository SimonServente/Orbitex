import { useEffect, useState } from 'react'
import { getApod } from '../services/nasa'

// Foto astronómica del día de NASA (APOD). El texto viene en inglés desde NASA.
export default function Apod() {
  const [apod, setApod] = useState(null)
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getApod().then(setApod).catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <section className="card apod">
        <h2>Foto astronómica del día</h2>
        <p className="muted small">No se pudo cargar la foto de NASA en este momento.</p>
      </section>
    )
  }
  if (!apod) {
    return (
      <section className="card apod">
        <h2>Foto astronómica del día</h2>
        <p className="loading">Cargando la foto de NASA…</p>
      </section>
    )
  }

  // A veces APOD es un video: se muestra su miniatura con un enlace
  const image = apod.media_type === 'image' ? apod.url : apod.thumbnail_url
  const [y, m, d] = apod.date.split('-')

  return (
    <section className="card apod">
      <p className="eyebrow">Foto astronómica del día · NASA · {d}/{m}/{y}</p>
      {image && (
        <a href={apod.hdurl || apod.url} target="_blank" rel="noreferrer">
          <img src={image} alt={apod.title} loading="lazy" />
        </a>
      )}
      <h2>{apod.title}</h2>
      {apod.copyright && <p className="muted small">© {apod.copyright.trim()}</p>}
      <button className="link" onClick={() => setOpen(!open)}>
        {open ? 'Ocultar descripción' : 'Leer descripción (en inglés)'}
      </button>
      {open && <p className="apod-text">{apod.explanation}</p>}
    </section>
  )
}
