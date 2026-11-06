// Operaciones con Cloud Firestore sobre los avistamientos del usuario.
// Ruta de los datos: users/{uid}/sightings/{sightingId}
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

const sightingsRef = (uid) => collection(db, 'users', uid, 'sightings')

// CONSULTAR: escucha en tiempo real (la lista se actualiza sola)
export function subscribeToSightings(uid, onData, onError) {
  const q = query(sightingsRef(uid), orderBy('date', 'desc'))
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError,
  )
}

// AGREGAR
export function addSighting(uid, sighting) {
  return addDoc(sightingsRef(uid), { ...sighting, createdAt: serverTimestamp() })
}

// MODIFICAR
export function updateSighting(uid, id, changes) {
  return updateDoc(doc(db, 'users', uid, 'sightings', id), {
    ...changes,
    updatedAt: serverTimestamp(),
  })
}

// ELIMINAR
export function deleteSighting(uid, id) {
  return deleteDoc(doc(db, 'users', uid, 'sightings', id))
}
