# Orbitex · La Pokédex del sistema solar

Aplicación web para registrar qué cuerpos del sistema solar viste en el cielo. Cada planeta, luna o planeta enano tiene una ficha con datos científicos, una guía para encontrarlo y tu historial de avistamientos. La colección se va completando a medida que los ves.

Además, calcula qué se puede ver esta noche desde tu ubicación (hora, dirección y altura) y te deja armar una lista de objetivos "Quiero ver", que se tachan solos cuando registrás el avistamiento.

Como en una Pokédex, los cuerpos que todavía no viste aparecen como silueta de su foto real de NASA, que se revela al registrarlos. Los avistamientos desbloquean insignias, y la pestaña "Esta noche" incluye una brújula del cielo y la foto astronómica del día de NASA.

Trabajo Práctico 2 de Desarrollo Frontend II (UADE).

## Tecnologías

- **React + Vite**: interfaz.
- **Firebase Authentication** (anónima): identifica a cada visitante sin registro.
- **Cloud Firestore**: guarda los avistamientos de cada usuario.
- **Le Système Solaire API**: datos científicos de cada cuerpo (gravedad, temperatura, órbita, lunas, descubrimiento).
- **Astronomy Engine**: calcula en el navegador la posición de los planetas y la fase lunar (sin internet ni clave).
- **NASA Image and Video Library**: fotos reales de cada cuerpo (sin clave).
- **NASA APOD**: foto astronómica del día.
- **Vercel**: publicación.

## Cómo ejecutarlo

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Copiar `.env.example` como `.env` y completar:
   - Los valores del `firebaseConfig` del proyecto de Firebase.
   - `SOLAR_API_KEY`: token gratuito de https://api.le-systeme-solaire.net/generatekey.html (sin prefijo `VITE_`: solo lo usa el servidor, no llega al navegador)
   - `NASA_API_KEY`: clave gratuita de https://api.nasa.gov (también solo de servidor). Si se deja vacía se usa `DEMO_KEY`, que tiene pocos pedidos por hora.
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Configuración de Firebase

1. Crear un proyecto en Firebase Console y registrar una app web.
2. Activar **Authentication → Anónimo**.
3. Crear una base **Cloud Firestore** (Standard, `southamerica-east1`) en modo producción.
4. Publicar las reglas del archivo `firestore.rules` en la pestaña **Reglas**.

## Datos guardados

- **Avistamientos**: `users/{uid}/sightings/{sightingId}` con cuerpo (id y nombre), fecha, lugar, instrumento (`ojo`, `binoculares` o `telescopio`) y notas.
- **Lista "Quiero ver"**: `users/{uid}/wishlist/{bodyId}` con el id y nombre del cuerpo y la fecha en que se agregó. El id del documento es el del cuerpo, así no se puede repetir.

Las reglas permiten que cada usuario lea y modifique solo sus propios datos, y validan los campos antes de guardar.

## Dónde está cada cosa

- `src/firebase.js`: conexión con Firebase.
- `src/services/sightings.js`: consultar, agregar, modificar y eliminar avistamientos en Firestore.
- `src/services/wishlist.js`: consultar, agregar y quitar cuerpos de la lista "Quiero ver" en Firestore.
- `src/services/sky.js`: qué se ve esta noche y fase lunar (Astronomy Engine).
- `src/services/solarSystem.js`: datos científicos desde Le Système Solaire API.
- `src/services/nasa.js`: fotos de NASA y foto del día.
- `src/data/badges.js`: insignias y las condiciones para desbloquearlas.
- `api/apod.js`: función serverless de Vercel que pide la foto del día con la clave de NASA.
- `api/body.js`: función serverless de Vercel que llama a la API con el token (la API no permite hacerlo desde el navegador).
- `src/data/catalog.js`: cuerpos coleccionables, nombres en español y consejos de observación.
- `src/components/`: componentes de la interfaz.
