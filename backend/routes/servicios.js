const express = require('express');
const router = express.Router();
const {
  crearServicio,
  obtenerServicios,
  actualizarServicio,
  eliminarServicio
} = require('../controllers/servicioController');
const verificarToken = require('../middleware/auth');

// Ver todos los servicios
router.get('/', obtenerServicios);

// Crear nuevo servicio
router.post('/', verificarToken, crearServicio);

// EDITAR servicio (con log)
router.put('/:id', verificarToken, (req, res, next) => {
  console.log('➡️ Recibida petición PUT a /api/servicios/:id');
  next();
}, actualizarServicio);

// ELIMINAR servicio (con log)
router.delete('/:id', verificarToken, (req, res, next) => {
  console.log('➡️ Recibida petición DELETE a /api/servicios/:id');
  next();
}, eliminarServicio);

module.exports = router;
