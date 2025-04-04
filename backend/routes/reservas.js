const express = require('express');
const router = express.Router();
const {
  crearReserva,
  obtenerReservasUsuario,
  eliminarReserva // 👈 Añadimos esta función
} = require('../controllers/reservaController');
const verificarToken = require('../middleware/auth');

// Crear una nueva reserva (requiere estar autenticado)
router.post('/', verificarToken, crearReserva);

// Obtener las reservas del usuario autenticado
router.get('/mis-reservas', verificarToken, obtenerReservasUsuario);

// Cancelar (eliminar) una reserva por ID (requiere autenticación)
router.delete('/:id', verificarToken, eliminarReserva); // 👈 Ruta añadida

module.exports = router;
