export default async function handler(req, res) {
  const { q, site } = req.query;

  if (!q || !site) {
    return res.status(400).json({ error: 'Faltan parámetros de búsqueda (q o site)' });
  }

  try {
    const meliUrl = `https://api.mercadolibre.com/sites/${site}/search?q=${encodeURIComponent(q)}&limit=16`;
    
    // Agregamos "Headers" para disfrazar el servidor como un navegador real
    const response = await fetch(meliUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`MercadoLibre bloqueó la petición: Status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("[Vercel Backend Error]:", error.message);
    // Ahora enviamos el detalle exacto del error a la pantalla
    return res.status(500).json({ 
      error: 'Error conectando con el motor logístico central',
      detalle: error.message || error.toString()
    });
  }
}
