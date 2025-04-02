const express = require('express');
const router = express.Router();
const { crearServicio, obtenerServicios } = require('../controllers/servicioController');
const verificarToken = require('../middleware/auth');

// Ver todos los servicios (público)
router.get('/', obtenerServicios);

// Crear nuevo servicio (protegido, solo si estás autenticado)
router.post('/', verificarToken, crearServicio);

module.exports = router;
