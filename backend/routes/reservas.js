const express = require('express');
const router = express.Router();

const {
  crearReserva,
  obtenerReservasUsuario,
  eliminarReserva,
  obtenerTodasLasReservas,
  obtenerHorariosDisponibles // ✅ Nueva función importada
} = require('../controllers/reservaController');

const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/verificarAdmin');

// Crear una nueva reserva (requiere estar autenticado)
router.post('/', verificarToken, crearReserva);

// Obtener las reservas del usuario autenticado
router.get('/mis-reservas', verificarToken, obtenerReservasUsuario);

// Cancelar (eliminar) una reserva por ID
router.delete('/:id', verificarToken, eliminarReserva);

// Obtener TODAS las reservas (solo admin)
router.get('/admin/todas-las-reservas', verificarToken, verificarAdmin, obtenerTodasLasReservas);

// ✅ Obtener horarios disponibles por fecha y servicio
router.get('/horarios-disponibles', verificarToken, obtenerHorariosDisponibles);

module.exports = router;
