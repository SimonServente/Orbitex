// Función serverless (Vercel): foto astronómica del día de NASA (APOD).
// https://api.nasa.gov — la clave queda en el servidor (variable NASA_API_KEY).
// Si no está configurada se usa DEMO_KEY, que funciona pero con pocos pedidos por hora.

export default async function handler(req, res) {
  const key = process.env.NASA_API_KEY || 'DEMO_KEY'
  try {
    const r = await fetch(`https://api.nasa.gov/planetary/apod?thumbs=true&api_key=${key}`)
    if (!r.ok) return res.status(r.status).json({ error: `NASA respondió ${r.status}` })
    // Cambia una vez por día: Vercel la guarda en caché una hora
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).json(await r.json())
  } catch {
    return res.status(502).json({ error: 'No se pudo contactar a NASA' })
  }
}
