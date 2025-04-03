const express = require('express');
const router = express.Router();
const { crearReserva, obtenerReservasUsuario } = require('../controllers/reservaController');
const verificarToken = require('../middleware/auth');

// Crear una nueva reserva (requiere estar autenticado)
router.post('/', verificarToken, crearReserva);

// Obtener las reservas del usuario autenticado
router.get('/mis-reservas', verificarToken, obtenerReservasUsuario);

module.exports = router;
