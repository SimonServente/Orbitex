import { useState } from 'react'
import { INSTRUMENTS } from '../data/catalog'

// Fecha local (no UTC) en formato AAAA-MM-DD
const today = () => {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export default function SightingForm({ body, initial, onSave, onCancel }) {
  const [date, setDate] = useState(initial?.date ?? today())
  const [place, setPlace] = useState(initial?.place ?? '')
  const [instrument, setInstrument] = useState(initial?.instrument ?? body.difficulty)
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    if (!date) newErrors.date = 'Elegí una fecha.'
    else if (date > today()) newErrors.date = 'No podés registrar algo que todavía no viste.'
    if (place.trim().length > 100) newErrors.place = 'Máximo 100 caracteres.'
    if (notes.length > 1000) newErrors.notes = 'Máximo 1000 caracteres.'
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    setSaving(true)
    const ok = await onSave({
      bodyId: body.id,
      bodyName: body.name,
      date,
      place: place.trim(),
      instrument,
      notes: notes.trim(),
    })
    setSaving(false)
    if (ok && !initial) {
      setPlace('')
      setNotes('')
    }
  }

  return (
    <section className="card">
      <h2>{initial ? 'Editar avistamiento' : `Registrar que viste ${body.name}`}</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <label>
            Fecha
            <input type="date" value={date} max={today()} onChange={(e) => setDate(e.target.value)} />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </label>
          <label>
            Lugar
            <input
              type="text"
              maxLength={100}
              placeholder="Ej: terraza, Palermo"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
            {errors.place && <span className="field-error">{errors.place}</span>}
          </label>
        </div>

        <fieldset>
          <legend>¿Con qué lo viste?</legend>
          <div className="segmented">
            {Object.entries(INSTRUMENTS).map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={instrument === value ? 'active' : ''}
                onClick={() => setInstrument(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <label>
          Notas
          <textarea
            rows={3}
            maxLength={1000}
            placeholder="¿Cómo estaba el cielo? ¿Qué se veía?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <span className="counter">{notes.length}/1000</span>
          {errors.notes && <span className="field-error">{errors.notes}</span>}
        </label>

        <div className="actions">
          {onCancel && <button type="button" className="secondary" onClick={onCancel} disabled={saving}>Cancelar</button>}
          <button type="submit" disabled={saving}>{saving ? 'Guardando…' : initial ? 'Guardar cambios' : 'Registrar'}</button>
        </div>
      </form>
    </section>
  )
}
