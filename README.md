# Orbitex · La Pokédex del sistema solar

Aplicación web para registrar qué cuerpos del sistema solar viste en el cielo. Cada planeta, luna o planeta enano tiene una ficha con datos científicos, una guía para encontrarlo y tu historial de avistamientos. La colección se va completando a medida que los ves.

Trabajo Práctico 2 de Desarrollo Frontend II (UADE).

## Tecnologías

- **React + Vite**: interfaz.
- **Firebase Authentication** (anónima): identifica a cada visitante sin registro.
- **Cloud Firestore**: guarda los avistamientos de cada usuario.
- **Le Système Solaire API**: datos científicos de cada cuerpo (gravedad, temperatura, órbita, lunas, descubrimiento).
- **Vercel**: publicación.

## Cómo ejecutarlo

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Copiar `.env.example` como `.env` y completar:
   - Los valores del `firebaseConfig` del proyecto de Firebase.
   - `SOLAR_API_KEY`: token gratuito de https://api.le-systeme-solaire.net/generatekey.html (sin prefijo `VITE_`: solo lo usa el servidor, no llega al navegador)
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

Cada avistamiento se guarda en `users/{uid}/sightings/{sightingId}` con: cuerpo (id y nombre), fecha, lugar, instrumento (`ojo`, `binoculares` o `telescopio`) y notas.

Las reglas permiten que cada usuario lea y modifique solo sus propios avistamientos, y validan los campos antes de guardar.

## Dónde está cada cosa

- `src/firebase.js`: conexión con Firebase.
- `src/services/sightings.js`: consultar, agregar, modificar y eliminar avistamientos en Firestore.
- `src/services/solarSystem.js`: datos científicos desde Le Système Solaire API.
- `api/body.js`: función serverless de Vercel que llama a la API con el token (la API no permite hacerlo desde el navegador).
- `src/data/catalog.js`: cuerpos coleccionables, nombres en español y consejos de observación.
- `src/components/`: componentes de la interfaz.
