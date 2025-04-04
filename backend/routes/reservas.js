const express = require('express');
const router = express.Router();

const {
  crearReserva,
  obtenerReservasUsuario,
  eliminarReserva,
  obtenerTodasLasReservas // 👈 Ruta de administrador
} = require('../controllers/reservaController');

const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/verificarAdmin'); // 👈 Nuevo middleware

// Crear una nueva reserva (requiere estar autenticado)
router.post('/', verificarToken, crearReserva);

// Obtener las reservas del usuario autenticado
router.get('/mis-reservas', verificarToken, obtenerReservasUsuario);

// Cancelar (eliminar) una reserva por ID
router.delete('/:id', verificarToken, eliminarReserva);

// Obtener TODAS las reservas (solo admin)
router.get('/admin/todas-las-reservas', verificarToken, verificarAdmin, obtenerTodasLasReservas);

module.exports = router;
