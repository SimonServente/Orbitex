// Lista "Quiero ver": cuerpos que el usuario quiere encontrar en el cielo.
// Ruta de los datos: users/{uid}/wishlist/{bodyId}
// Se usa el id del cuerpo como id del documento: así no puede repetirse.
import { collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

// CONSULTAR en tiempo real
export function subscribeToWishlist(uid, onData, onError) {
  return onSnapshot(
    collection(db, 'users', uid, 'wishlist'),
    (snap) => onData(snap.docs.map((d) => d.data())),
    onError,
  )
}

// AGREGAR
export function addToWishlist(uid, body) {
  return setDoc(doc(db, 'users', uid, 'wishlist', body.id), {
    bodyId: body.id,
    bodyName: body.name,
    addedAt: serverTimestamp(),
  })
}

// ELIMINAR
export function removeFromWishlist(uid, bodyId) {
  return deleteDoc(doc(db, 'users', uid, 'wishlist', bodyId))
}
