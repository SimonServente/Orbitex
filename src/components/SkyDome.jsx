import { useMemo, useState } from 'react'
import { formatTime, positionsAt } from '../services/sky'

// Brújula del cielo: el círculo es el horizonte y el centro es el punto justo arriba de tu cabeza.
// Como un mapa del cielo para mirar hacia arriba: Norte arriba y Este a la IZQUIERDA.
// El control deslizante permite ver cómo se mueven los planetas durante la noche.

const SIZE = 300
const C = SIZE / 2
const R = 130
const STEP = 15 * 60000 // 15 minutos

function toXY(altitude, azimuth) {
  const r = ((90 - altitude) / 90) * R
  const a = (azimuth * Math.PI) / 180
  return { x: C - r * Math.sin(a), y: C - r * Math.cos(a) }
}

export default function SkyDome({ bodies, night, location, onOpen }) {
  const start = night.start.getTime()
  const end = night.end.getTime()
  const now = Date.now()
  const [time, setTime] = useState(night.isNight && now < end ? now : start)

  // Posiciones en pantalla. Si dos nombres quedan encimados, el segundo se corre hacia abajo.
  const positions = useMemo(() => {
    const placed = []
    return positionsAt(bodies, location, new Date(time))
      .filter((p) => p.altitude > 0)
      .map((p) => ({ ...p, ...toXY(p.altitude, p.azimuth) }))
      .sort((a, b) => a.y - b.y)
      .map((p) => {
        let labelY = p.y + 4
        while (placed.some((q) => Math.abs(q.x - p.x) < 70 && Math.abs(q.labelY - labelY) < 13)) labelY += 13
        placed.push({ x: p.x, labelY })
        return { ...p, labelY }
      })
  }, [bodies, location, time])

  return (
    <section className="card sky-dome">
      <h2>Hacia dónde mirar</h2>
      <p className="muted small">
        El borde es el horizonte y el centro, el punto justo arriba tuyo. Es un mapa para sostener sobre tu cabeza: por eso el Este queda a la izquierda. Tocá un planeta para ver su ficha.
      </p>

      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`Posición de los planetas a las ${formatTime(new Date(time))}`}>
        <circle cx={C} cy={C} r={R} className="dome-bg" />
        <circle cx={C} cy={C} r={(R * 60) / 90} className="dome-ring" />
        <circle cx={C} cy={C} r={(R * 30) / 90} className="dome-ring" />
        <line x1={C} y1={C - R} x2={C} y2={C + R} className="dome-ring" />
        <line x1={C - R} y1={C} x2={C + R} y2={C} className="dome-ring" />
        <text x={C} y={C - R - 6} className="dome-cardinal">N</text>
        <text x={C} y={C + R + 14} className="dome-cardinal">S</text>
        <text x={C - R - 10} y={C + 4} className="dome-cardinal">E</text>
        <text x={C + R + 10} y={C + 4} className="dome-cardinal">O</text>

        {/* Primero los puntos y después los nombres, para que ningún punto tape un nombre */}
        {positions.map((p) => (
          <circle key={p.id} className="dome-body" cx={p.x} cy={p.y} r={p.id === 'lune' ? 8 : 6} fill={p.color} onClick={() => onOpen(p.id)} />
        ))}
        {positions.map((p) => (
          <text key={p.id} className="dome-label" x={p.x + 10} y={p.labelY} onClick={() => onOpen(p.id)}>{p.name}</text>
        ))}
      </svg>

      {positions.length === 0 && <p className="muted small center">A esta hora no hay planetas sobre el horizonte.</p>}

      <label className="time-slider">
        <span>
          A las <strong>{formatTime(new Date(time))}</strong>
        </span>
        <input
          type="range"
          min={start}
          max={end}
          step={STEP}
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
        />
        <span className="slider-labels muted small">
          <span>{formatTime(night.start)}</span>
          <span>{formatTime(night.end)}</span>
        </span>
      </label>
    </section>
  )
}
