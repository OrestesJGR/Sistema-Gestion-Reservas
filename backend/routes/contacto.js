// Importa express y crea un router para definir rutas relacionadas con los mensajes de contacto
const express = require('express');
const router = express.Router();

// Importa el middleware de autenticación JWT para proteger rutas
const verificarToken = require('../middleware/auth');

// Importa los controladores que gestionan los mensajes del formulario de contacto
const {
  crearMensaje,
  obtenerMensajes,
  eliminarMensaje,
  restaurarMensaje // Importación del controlador para restaurar mensajes archivados
} = require('../controllers/contactoController');

// Ruta pública para que cualquier usuario pueda enviar un mensaje desde el formulario
router.post('/', crearMensaje);

// Ruta protegida para obtener mensajes (solo usuarios autenticados, idealmente administradores)
router.get('/', verificarToken, obtenerMensajes);

// Ruta protegida para archivar un mensaje (eliminar lógico)
router.delete('/:id', verificarToken, eliminarMensaje);

// Ruta protegida para restaurar un mensaje previamente archivado
router.put('/:id/restaurar', verificarToken, restaurarMensaje);

// Exporta el router para usarlo en la configuración general de rutas de la aplicación
module.exports = router;
