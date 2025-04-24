const express = require('express');
const router = express.Router();
const { obtenerEstadisticas } = require('../controllers/adminController');
const verificarToken = require('../middleware/auth');
const { obtenerReservasPorServicio } = require('../controllers/adminController');

router.get('/estadisticas', verificarToken, obtenerEstadisticas);

router.get('/reservas-por-servicio', verificarToken, obtenerReservasPorServicio);


module.exports = router;
