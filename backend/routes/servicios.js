// Importa express y crea una instancia del router
const express = require('express');
const router = express.Router();

// Importa las funciones del controlador de servicios
const {
  crearServicio,
  obtenerServicios,
  actualizarServicio,
  eliminarServicio
} = require('../controllers/servicioController');

// Importa el middleware de autenticación para proteger rutas
const verificarToken = require('../middleware/auth');

// Ruta pública: obtener todos los servicios disponibles
router.get('/', obtenerServicios);

// Ruta protegida: crear un nuevo servicio (requiere autenticación)
router.post('/', verificarToken, crearServicio);

// Ruta protegida: actualizar un servicio existente
// Incluye una función intermedia que muestra un log en consola antes de ejecutar la lógica real
router.put('/:id', verificarToken, (req, res, next) => {
  console.log('➡️ Recibida petición PUT a /api/servicios/:id');
  next(); // Continúa con el controlador principal
}, actualizarServicio);

// Ruta protegida: eliminar un servicio existente
// También incluye un log previo para registrar la petición
router.delete('/:id', verificarToken, (req, res, next) => {
  console.log('➡️ Recibida petición DELETE a /api/servicios/:id');
  next();
}, eliminarServicio);

// Exporta el router para integrarlo en el backend principal
module.exports = router;
