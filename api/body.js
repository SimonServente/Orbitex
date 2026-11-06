// Función serverless (Vercel): intermediario entre la app y Le Système Solaire API.
// La API exige un token y no acepta pedidos con token desde otros sitios web (CORS),
// así que el navegador le pide los datos a esta función y ella llama a la API.
// Ventaja extra: el token queda en el servidor y nunca llega al navegador.

export default async function handler(req, res) {
  const id = String(req.query.id || '')
  if (!/^[a-z]+$/.test(id)) {
    return res.status(400).json({ error: 'id inválido' })
  }

  try {
    const r = await fetch(`https://api.le-systeme-solaire.net/rest/bodies/${id}`, {
      headers: { Authorization: `Bearer ${process.env.SOLAR_API_KEY}` },
    })
    if (!r.ok) return res.status(r.status).json({ error: `La API respondió ${r.status}` })

    // Los datos de los planetas no cambian: Vercel los guarda en caché un día
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800')
    return res.status(200).json(await r.json())
  } catch {
    return res.status(502).json({ error: 'No se pudo contactar a la API' })
  }
}
