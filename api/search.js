// Archivo: api/search.js

export default async function handler(req, res) {
  // 1. Configuración de CORS (Permitir que tu HTML lea los datos)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Si es una petición de validación (OPTIONS), responder OK.
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Extraer los parámetros de tu HTML
  const { q, site } = req.query;

  if (!q || !site) {
    return res.status(400).json({ error: "Faltan parámetros 'q' o 'site'" });
  }

  try {
    // 3. Crear la URL oficial de la API de MercadoLibre
    // Ej: https://api.mercadolibre.com/sites/MLA/search?q=Notebook
    const meliUrl = `https://api.mercadolibre.com/sites/${site}/search?q=${encodeURIComponent(q)}&limit=25`;

    // 4. HACER EL BYPASS (Engañar al bloqueador de Meli)
    const response = await fetch(meliUrl, {
      method: 'GET',
      headers: {
        // Al poner un User-Agent de navegador real, MercadoLibre no bloquea a Vercel
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`MercadoLibre respondió con estado: ${response.status}`);
    }

    const data = await response.json();

    // 5. Devolver los resultados a tu HTML
    return res.status(200).json({ results: data.results });

  } catch (error) {
    console.error("Error en Serverless Function:", error);
    return res.status(500).json({ error: error.message });
  }
}
