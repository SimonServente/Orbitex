import { useEffect, useState } from 'react'
import { getBody } from '../services/solarSystem'
import { getNasaPhoto, nasaThumb } from '../services/nasa'
import { INSTRUMENTS } from '../data/catalog'
import Orb from './Orb'
import SightingForm from './SightingForm'
import SightingList from './SightingList'
import Visibility from './Visibility'
import WishButton from './WishButton'

const fmt = (n, digits = 0) => n.toLocaleString('es-AR', { maximumFractionDigits: digits })

export default function BodyDetail({ body, sightings, visibility, wished, onToggleWish, editing, onSave, onCancelEdit, onEdit, onDelete, onBack }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [photo, setPhoto] = useState(null)
  const seen = sightings.length > 0

  // Pide los datos científicos a la API cada vez que se abre una ficha
  useEffect(() => {
    let active = true
    setData(null)
    setError(null)
    getBody(body.id)
      .then((d) => active && setData(d))
      .catch(() => active && setError('No se pudieron cargar los datos de la API.'))
    return () => { active = false }
  }, [body.id])

  // Foto real de NASA (título, misión y crédito vienen de la NASA Image Library)
  useEffect(() => {
    let active = true
    setPhoto(null)
    getNasaPhoto(body.nasaId).then((p) => active && setPhoto(p)).catch(() => {})
    return () => { active = false }
  }, [body.nasaId])

  const facts = data && [
    data.gravity && ['Gravedad', `${fmt(data.gravity, 2)} m/s²`],
    data.meanRadius && ['Radio', `${fmt(data.meanRadius)} km`],
    data.avgTempC !== null && ['Temperatura media', `${fmt(data.avgTempC)} °C`],
    data.dayHours && ['Duración del día', `${fmt(data.dayHours, 1)} h`],
    data.yearDays && [data.aroundPlanet ? 'Vuelta a su planeta' : 'Duración del año', `${fmt(data.yearDays, 1)} días`],
    data.distanceKm && [data.aroundPlanet ? 'Distancia a su planeta' : 'Distancia al Sol', `${fmt(data.distanceKm)} km`],
    !data.aroundPlanet && ['Lunas', fmt(data.moons)],
    data.discoveredBy && ['Descubierto por', `${data.discoveredBy}${data.discoveryDate ? ` (${data.discoveryDate})` : ''}`],
  ].filter(Boolean)

  return (
    <>
      <button className="link" onClick={onBack}>← Volver a la Pokédex</button>

      <section className="card detail">
        <div className="detail-head">
          <Orb color={body.color} image={nasaThumb(body.nasaId)} seen={seen} size={96} />
          <div className="detail-title">
            <h2>{body.name}</h2>
            <p className="muted">{body.group} · Se ve con: {INSTRUMENTS[body.difficulty].toLowerCase()}</p>
            <Visibility info={visibility} body={body} />
          </div>
          <WishButton active={wished} onToggle={onToggleWish} />
        </div>
        <p className="tip">{body.tip}</p>

        <figure className={`nasa-photo ${seen ? '' : 'locked'}`}>
          {photo ? (
            <img src={photo.image} alt={seen ? photo.title : ''} />
          ) : (
            <div className="photo-placeholder loading">Cargando foto de NASA…</div>
          )}
          {!seen && (
            <div className="photo-lock">
              <strong>Foto bloqueada</strong>
              <span>Se revela cuando registres que viste {body.name}.</span>
            </div>
          )}
          {photo && seen && (
            <figcaption>
              <a href={photo.link} target="_blank" rel="noreferrer">{photo.title}</a>
              {' · '}{[photo.mission, photo.year].filter(Boolean).join(', ')} · {photo.credit}
            </figcaption>
          )}
        </figure>

        {!data && !error && <p className="loading">Cargando datos…</p>}
        {error && <p className="error-box">{error}</p>}
        {facts && (
          <dl className="facts">
            {facts.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        )}
      </section>

      <SightingForm
        key={editing?.id ?? body.id}
        body={body}
        initial={editing}
        onSave={onSave}
        onCancel={editing ? onCancelEdit : null}
      />

      <section className="card">
        <h2>Tus avistamientos de {body.name}</h2>
        <SightingList
          sightings={sightings}
          onEdit={onEdit}
          onDelete={onDelete}
          empty="Todavía no lo viste. Cuando lo encuentres en el cielo, registralo arriba."
        />
      </section>
    </>
  )
}
