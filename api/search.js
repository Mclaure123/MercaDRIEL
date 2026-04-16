// api/search.js
export default async function handler(req, res) {
  // 1. Recibir los parámetros de tu frontend
  const { q, site } = req.query;

  if (!q || !site) {
    return res.status(400).json({ error: 'Faltan parámetros de búsqueda' });
  }

  try {
    // 2. Hacer la petición a MercadoLibre DESDE EL SERVIDOR (sin restricciones CORS)
    const meliUrl = `https://api.mercadolibre.com/sites/${site}/search?q=${encodeURIComponent(q)}&limit=16`;
    
    const response = await fetch(meliUrl);
    const data = await response.json();

    // 3. Devolver los datos a tu frontend
    res.status(200).json(data);

  } catch (error) {
    console.error("Error en el backend:", error);
    res.status(500).json({ error: 'Error conectando con el motor logístico' });
  }
}
