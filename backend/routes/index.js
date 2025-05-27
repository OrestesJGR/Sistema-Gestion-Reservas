// Importa express y crea un router para definir rutas del punto de entrada principal
const express = require('express');
const router = express.Router();

// Define una ruta GET en la raíz ("/") que responde con un mensaje simple de estado
router.get('/', (req, res) => {
  // Devuelve un mensaje de texto como respuesta indicando que la API está operativa
  res.send('🚀 API funcionando');
});

// Exporta el router para integrarlo en el archivo principal del servidor (normalmente server.js o app.js)
module.exports = router;
