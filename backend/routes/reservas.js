const express = require('express');
const router = express.Router();
const { crearReserva } = require('../controllers/reservaController');
const verificarToken = require('../middleware/auth');

// Crear nueva reserva (requiere login)
router.post('/', verificarToken, crearReserva);

module.exports = router;
