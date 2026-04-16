export default async function handler(req, res) {
  // 1. Extraer los parámetros de la URL enviados por el frontend
  const { q, site } = req.query;

  // 2. Validación básica
  if (!q || !site) {
    return res.status(400).json({ error: 'Faltan parámetros de búsqueda (q o site)' });
  }

  try {
    // 3. Consultar a MercadoLibre de Servidor a Servidor (¡Sin problemas de CORS!)
    const meliUrl = `https://api.mercadolibre.com/sites/${site}/search?q=${encodeURIComponent(q)}&limit=16`;
    
    const response = await fetch(meliUrl);
    
    if (!response.ok) {
      throw new Error(`Error de MercadoLibre API: ${response.status}`);
    }

    const data = await response.json();

    // 4. Enviar los resultados de vuelta a tu frontend HTML
    return res.status(200).json(data);

  } catch (error) {
    console.error("[Vercel Backend Error]:", error);
    return res.status(500).json({ error: 'Error conectando con el motor logístico central' });
  }
}
