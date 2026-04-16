export default async function handler(req, res) {
  // 1. Configuración de CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { q, site } = req.query;

  if (!q || !site) {
    return res.status(400).json({ error: "Faltan parámetros 'q' o 'site'" });
  }

  try {
    const url = `https://api.mercadolibre.com/sites/${site}/search?q=${encodeURIComponent(q)}&limit=25`;

    // 2. EL BYPASS EXTREMO: Disfrazamos a Vercel como un celular Android real usando la App de Meli
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'MercadoLibre/12.4.0 (Android 13; es-US; Scale/2.0)', // Fingimos ser la app de Android
        'Accept': 'application/json',
        'X-Platform': 'Android',          // Cabecera interna de Meli
        'X-Device-Model': 'Samsung SM-G998B', // Fingimos ser un S21 Ultra
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
      // Si falla, capturamos exactamente qué dice MercadoLibre para saber si es un capcha
      const errorText = await response.text();
      console.error("Meli Error Response:", errorText);
      throw new Error(`Meli bloqueó la petición con Status: ${response.status}`);
    }

    const data = await response.json();
    
    // 3. Devolver los resultados exitosamente
    return res.status(200).json({ results: data.results });

  } catch (error) {
    console.error("Error en Vercel:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
