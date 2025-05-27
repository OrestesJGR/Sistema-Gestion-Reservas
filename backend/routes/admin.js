// Importa express y crea un router para definir rutas específicas del panel de administración
const express = require('express');
const router = express.Router();

// Importa el controlador que maneja la lógica para obtener estadísticas generales
const { obtenerEstadisticas } = require('../controllers/adminController');

// Importa el middleware que verifica si el usuario está autenticado mediante token
const verificarToken = require('../middleware/auth');

// Importa el controlador que agrupa reservas por servicio
const { obtenerReservasPorServicio } = require('../controllers/adminController');

// Ruta GET para obtener estadísticas generales del sistema
// Requiere autenticación mediante token
router.get('/estadisticas', verificarToken, obtenerEstadisticas);

// Ruta GET para obtener cantidad de reservas agrupadas por cada servicio
// También requiere autenticación
router.get('/reservas-por-servicio', verificarToken, obtenerReservasPorServicio);

// Exporta el router para ser usado en el archivo principal de rutas del backend
module.exports = router;
