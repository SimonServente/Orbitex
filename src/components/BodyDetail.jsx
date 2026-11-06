import { useEffect, useState } from 'react'
import { getBody } from '../services/solarSystem'
import { INSTRUMENTS } from '../data/catalog'
import Orb from './Orb'
import SightingForm from './SightingForm'
import SightingList from './SightingList'

const fmt = (n, digits = 0) => n.toLocaleString('es-AR', { maximumFractionDigits: digits })

export default function BodyDetail({ body, sightings, editing, onSave, onCancelEdit, onEdit, onDelete, onBack }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

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
          <Orb color={body.color} seen={sightings.length > 0} size={96} />
          <div>
            <h2>{body.name}</h2>
            <p className="muted">{body.group} · Se ve con: {INSTRUMENTS[body.difficulty].toLowerCase()}</p>
          </div>
        </div>
        <p className="tip">{body.tip}</p>

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
