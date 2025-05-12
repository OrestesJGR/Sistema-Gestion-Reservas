const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const {
  crearMensaje,
  obtenerMensajes,
  eliminarMensaje,
  restaurarMensaje // ✅ Importar correctamente
} = require('../controllers/contactoController');

// Ruta pública
router.post('/', crearMensaje);

// Rutas protegidas (solo admin)
router.get('/', verificarToken, obtenerMensajes);
router.delete('/:id', verificarToken, eliminarMensaje);
router.put('/:id/restaurar', verificarToken, restaurarMensaje); // ✅ Ya funcionará correctamente

module.exports = router;
