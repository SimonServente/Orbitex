import { useEffect, useState } from 'react'
import { getApod, getDailyFeature, isRealApod } from '../services/nasa'

// Encabezado: la imagen del día de NASA a pantalla completa.
// Primero intenta la foto astronómica del día (APOD). Si la API falla o devuelve el logo
// de NASA en vez de la foto (pasa desde noviembre de 2026), usa una foto icónica de la
// NASA Image Library que cambia cada día.
async function loadImageOfTheDay() {
  try {
    const apod = await getApod()
    if (isRealApod(apod)) {
      return {
        image: apod.media_type === 'image' ? apod.hdurl || apod.url : apod.thumbnail_url,
        link: apod.hdurl || apod.url,
        title: apod.title,
        credit: apod.copyright ? `© ${apod.copyright.trim()}, vía NASA APOD` : 'NASA APOD',
        text: apod.explanation,
      }
    }
  } catch {
    // Si APOD no responde, se sigue con el plan B
  }
  const photo = await getDailyFeature()
  return {
    image: photo.image,
    link: photo.link,
    title: photo.title,
    credit: `${photo.credit}${photo.year ? `, ${photo.year}` : ''}`,
    text: photo.description,
  }
}

export default function Hero({ seenCount, total, badgeCount, badgeTotal, onOpenCollection, onOpenBadges }) {
  const [item, setItem] = useState(null)
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    loadImageOfTheDay().then(setItem).catch(() => setFailed(true))
  }, [])

  return (
    <header className="hero">
      {item?.image && (
        <img
          className={`hero-img ${loaded ? 'is-loaded' : ''}`}
          src={item.image}
          alt=""
          onLoad={() => setLoaded(true)}
        />
      )}
      <div className="hero-shade" aria-hidden="true" />

      <div className="hero-top">
        <div>
          <p className="wordmark">Orbitex</p>
          <p className="tagline">El álbum del sistema solar</p>
        </div>
        <div className="hero-actions">
          <button className="collection-btn" onClick={onOpenCollection} aria-label={`Tu colección: ${seenCount} de ${total} vistos. Ver progreso`}>
            <span className="collection-count">
              {seenCount}<span>/{total}</span>
            </span>
            <span className="collection-label">Tu colección</span>
          </button>
          <button className="collection-btn" onClick={onOpenBadges} aria-label={`Insignias: ${badgeCount} de ${badgeTotal} desbloqueadas. Ver insignias`}>
            <span className="collection-count">
              {badgeCount}<span>/{badgeTotal}</span>
            </span>
            <span className="collection-label">Insignias</span>
          </button>
        </div>
      </div>

      <div className="hero-body">
        <p className="hero-kicker">imagen del día</p>
        {item ? (
          <>
            <h1 className="hero-title">{item.title}</h1>
            <p className="hero-credit">
              {item.credit}
              {item.text && (
                <button className="hero-more" onClick={() => setOpen(!open)} aria-expanded={open}>
                  {open ? 'Cerrar' : 'Sobre esta imagen'}
                </button>
              )}
            </p>
            {open && (
              <div className="hero-text">
                <p>{item.text}</p>
                <a href={item.link} target="_blank" rel="noreferrer">Ver en NASA</a>
              </div>
            )}
          </>
        ) : (
          <h1 className="hero-title is-muted">
            {failed ? 'Mirá hacia arriba esta noche' : 'Buscando la imagen de hoy…'}
          </h1>
        )}
      </div>
    </header>
  )
}
