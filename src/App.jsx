import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { auth } from './firebase'
import { subscribeToSightings, addSighting, updateSighting, deleteSighting } from './services/sightings'
import { subscribeToWishlist, addToWishlist, removeFromWishlist } from './services/wishlist'
import { computeTonight, BUENOS_AIRES } from './services/sky'
import { CATALOG } from './data/catalog'
import BodyGrid from './components/BodyGrid'
import BodyDetail from './components/BodyDetail'
import Logbook from './components/Logbook'
import Tonight from './components/Tonight'
import Wishlist from './components/Wishlist'
import Toast from './components/Toast'

export default function App() {
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [sightings, setSightings] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState([])
  const [loadingWishlist, setLoadingWishlist] = useState(true)
  const [view, setView] = useState('pokedex') // 'pokedex' | 'noche' | 'quiero' | 'bitacora'
  const [selectedId, setSelectedId] = useState(null) // cuerpo abierto en la ficha
  const [editing, setEditing] = useState(null) // avistamiento en edición
  const [location, setLocation] = useState(BUENOS_AIRES)
  const [locating, setLocating] = useState(false)
  const [toast, setToast] = useState(null)

  const notify = (message, type = 'success') => setToast({ message, type, key: Date.now() })

  // 1. Login anónimo: identifica a cada visitante sin pantalla de registro
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u) setUser(u)
      else signInAnonymously(auth).catch((e) => setAuthError(e.code || e.message))
    })
  }, [])

  // 2. Con el usuario listo, se escuchan sus avistamientos y su lista en Firestore
  useEffect(() => {
    if (!user) return
    setLoading(true)
    setLoadingWishlist(true)
    const stopSightings = subscribeToSightings(
      user.uid,
      (data) => { setSightings(data); setLoading(false) },
      () => { setLoading(false); notify('No se pudieron cargar tus avistamientos.', 'error') },
    )
    const stopWishlist = subscribeToWishlist(
      user.uid,
      (data) => { setWishlist(data); setLoadingWishlist(false) },
      () => { setLoadingWishlist(false); notify('No se pudo cargar tu lista "Quiero ver".', 'error') },
    )
    return () => { stopSightings(); stopWishlist() }
  }, [user])

  // 3. Qué se ve esta noche (se calcula en el navegador, sin internet)
  const sky = useMemo(() => computeTonight(CATALOG, location), [location])

  const seenIds = new Set(sightings.map((s) => s.bodyId))
  const wishIds = new Set(wishlist.map((w) => w.bodyId))

  async function handleSave(data) {
    try {
      if (editing) {
        await updateSighting(user.uid, editing.id, data)
        notify('Avistamiento actualizado.')
      } else {
        await addSighting(user.uid, data)
        // Si estaba en "Quiero ver", ya cumplió el objetivo: se tacha de la lista
        if (wishIds.has(data.bodyId)) await removeFromWishlist(user.uid, data.bodyId)
        notify(
          wishIds.has(data.bodyId)
            ? `¡Objetivo cumplido! ${data.bodyName} salió de tu lista "Quiero ver".`
            : seenIds.has(data.bodyId)
              ? 'Avistamiento registrado.'
              : `¡Nuevo en tu colección: ${data.bodyName}!`,
        )
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

  async function toggleWish(body) {
    try {
      if (wishIds.has(body.id)) {
        await removeFromWishlist(user.uid, body.id)
        notify(`${body.name} salió de tu lista.`)
      } else {
        await addToWishlist(user.uid, body)
        notify(`${body.name} agregado a "Quiero ver".`)
      }
    } catch {
      notify('No se pudo actualizar tu lista.', 'error')
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      notify('Tu navegador no permite obtener la ubicación.', 'error')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'tu ubicación' })
        setLocating(false)
        notify('Cálculo actualizado para tu ubicación.')
      },
      () => {
        setLocating(false)
        notify('No se pudo obtener tu ubicación. Se usa Buenos Aires.', 'error')
      },
    )
  }

  function openBody(id) {
    setSelectedId(id)
    setEditing(null)
    setView('pokedex')
    window.scrollTo({ top: 0 })
  }

  function startEdit(s) {
    setEditing(s)
    setSelectedId(s.bodyId)
    setView('pokedex')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goTo(v) {
    setView(v)
    setSelectedId(null)
    setEditing(null)
  }

  const selected = CATALOG.find((b) => b.id === selectedId)
  const tonightCount = CATALOG.filter((b) => sky.byBody[b.id] && b.group !== 'Lunas').length

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
        <button className={view === 'pokedex' ? 'active' : ''} onClick={() => goTo('pokedex')}>Pokédex</button>
        <button className={view === 'noche' ? 'active' : ''} onClick={() => goTo('noche')}>
          Esta noche ({tonightCount})
        </button>
        <button className={view === 'quiero' ? 'active' : ''} onClick={() => goTo('quiero')}>
          Quiero ver ({wishlist.length})
        </button>
        <button className={view === 'bitacora' ? 'active' : ''} onClick={() => goTo('bitacora')}>
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
        <BodyGrid seenIds={seenIds} wishIds={wishIds} sky={sky} onOpen={openBody} />
      )}

      {user && view === 'pokedex' && selected && (
        <BodyDetail
          body={selected}
          sightings={sightings.filter((s) => s.bodyId === selected.id)}
          visibility={sky.byBody[selected.id]}
          wished={wishIds.has(selected.id)}
          onToggleWish={() => toggleWish(selected)}
          editing={editing}
          onSave={handleSave}
          onCancelEdit={() => setEditing(null)}
          onEdit={startEdit}
          onDelete={handleDelete}
          onBack={() => { setSelectedId(null); setEditing(null) }}
        />
      )}

      {user && view === 'noche' && (
        <Tonight
          sky={sky}
          seenIds={seenIds}
          wishIds={wishIds}
          onToggleWish={toggleWish}
          onOpen={openBody}
          onUseMyLocation={useMyLocation}
          locating={locating}
        />
      )}

      {user && view === 'quiero' && (
        <Wishlist wishlist={wishlist} loading={loadingWishlist} sky={sky} onToggleWish={toggleWish} onOpen={openBody} />
      )}

      {user && view === 'bitacora' && (
        <Logbook sightings={sightings} loading={loading} onEdit={startEdit} onDelete={handleDelete} />
      )}

      {toast && <Toast key={toast.key} {...toast} onClose={() => setToast(null)} />}

      <footer className="footer">
        Datos científicos: <a href="https://api.le-systeme-solaire.net" target="_blank" rel="noreferrer">Le Système Solaire API</a>
        {' · '}Cálculos del cielo: <a href="https://github.com/cosinekitty/astronomy" target="_blank" rel="noreferrer">Astronomy Engine</a>
      </footer>
    </div>
  )
}
