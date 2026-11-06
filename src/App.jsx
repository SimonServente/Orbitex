import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { auth } from './firebase'
import { subscribeToSightings, addSighting, updateSighting, deleteSighting } from './services/sightings'
import { CATALOG } from './data/catalog'
import BodyGrid from './components/BodyGrid'
import BodyDetail from './components/BodyDetail'
import Logbook from './components/Logbook'
import Toast from './components/Toast'

export default function App() {
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [sightings, setSightings] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('pokedex') // 'pokedex' | 'bitacora'
  const [selectedId, setSelectedId] = useState(null) // cuerpo abierto en la ficha
  const [editing, setEditing] = useState(null) // avistamiento en edición
  const [toast, setToast] = useState(null)

  const notify = (message, type = 'success') => setToast({ message, type, key: Date.now() })

  // 1. Login anónimo: identifica a cada visitante sin pantalla de registro
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u) setUser(u)
      else signInAnonymously(auth).catch((e) => setAuthError(e.code || e.message))
    })
  }, [])

  // 2. Con el usuario listo, se escuchan sus avistamientos en Firestore
  useEffect(() => {
    if (!user) return
    setLoading(true)
    return subscribeToSightings(
      user.uid,
      (data) => { setSightings(data); setLoading(false) },
      () => { setLoading(false); notify('No se pudieron cargar tus avistamientos.', 'error') },
    )
  }, [user])

  // Cuerpos que el usuario ya vio al menos una vez
  const seenIds = new Set(sightings.map((s) => s.bodyId))

  async function handleSave(data) {
    try {
      if (editing) {
        await updateSighting(user.uid, editing.id, data)
        notify('Avistamiento actualizado.')
      } else {
        await addSighting(user.uid, data)
        notify(seenIds.has(data.bodyId) ? 'Avistamiento registrado.' : `¡Nuevo en tu colección: ${data.bodyName}!`)
      }
      setEditing(null)
      return true
    } catch {
      notify('No se pudo guardar. Probá de nuevo.', 'error')
      return false
    }
  }

  async function handleDelete(s) {
    if (!confirm(`¿Eliminar el avistamiento de ${s.bodyName} del ${s.date.split('-').reverse().join('/')}?`)) return
    try {
      await deleteSighting(user.uid, s.id)
      notify('Avistamiento eliminado.')
    } catch {
      notify('No se pudo eliminar.', 'error')
    }
  }

  function startEdit(s) {
    setEditing(s)
    setSelectedId(s.bodyId)
    setView('pokedex')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selected = CATALOG.find((b) => b.id === selectedId)

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Orbitex</h1>
          <p>La Pokédex del sistema solar</p>
        </div>
        <div className="progress" aria-label="Progreso de la colección">
          <strong>{seenIds.size}</strong>/{CATALOG.length}
          <span>vistos</span>
        </div>
      </header>

      <nav className="tabs">
        <button className={view === 'pokedex' ? 'active' : ''} onClick={() => { setView('pokedex'); setSelectedId(null); setEditing(null) }}>
          Pokédex
        </button>
        <button className={view === 'bitacora' ? 'active' : ''} onClick={() => setView('bitacora')}>
          Mi bitácora ({sightings.length})
        </button>
      </nav>

      {authError && (
        <p className="error-box">
          No se pudo conectar ({authError}). Revisá que Authentication → Anónimo esté activado en Firebase.
        </p>
      )}
      {!user && !authError && <p className="loading">Conectando…</p>}

      {user && view === 'pokedex' && !selected && (
        <BodyGrid seenIds={seenIds} onOpen={setSelectedId} />
      )}

      {user && view === 'pokedex' && selected && (
        <BodyDetail
          body={selected}
          sightings={sightings.filter((s) => s.bodyId === selected.id)}
          editing={editing}
          onSave={handleSave}
          onCancelEdit={() => setEditing(null)}
          onEdit={startEdit}
          onDelete={handleDelete}
          onBack={() => { setSelectedId(null); setEditing(null) }}
        />
      )}

      {user && view === 'bitacora' && (
        <Logbook sightings={sightings} loading={loading} onEdit={startEdit} onDelete={handleDelete} />
      )}

      {toast && <Toast key={toast.key} {...toast} onClose={() => setToast(null)} />}

      <footer className="footer">
        Datos científicos: <a href="https://api.le-systeme-solaire.net" target="_blank" rel="noreferrer">Le Système Solaire API</a>
      </footer>
    </div>
  )
}
