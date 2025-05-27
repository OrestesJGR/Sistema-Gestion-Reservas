// Importa express y crea una instancia de router para definir las rutas relacionadas con reservas
const express = require('express');
const router = express.Router();

// Importa los controladores que manejan la lógica de las reservas
const {
  crearReserva,
  obtenerReservasUsuario,
  eliminarReserva,
  obtenerTodasLasReservas,
  obtenerHorariosDisponibles // Función que devuelve los horarios disponibles por día y servicio
} = require('../controllers/reservaController');

// Importa middlewares de autenticación y autorización
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/verificarAdmin');

// Ruta para crear una nueva reserva (solo usuarios autenticados)
router.post('/', verificarToken, crearReserva);

// Ruta para obtener las reservas del usuario autenticado
router.get('/mis-reservas', verificarToken, obtenerReservasUsuario);

// Ruta para cancelar (eliminar) una reserva por ID (solo si es del propio usuario)
router.delete('/:id', verificarToken, eliminarReserva);

// Ruta para que un administrador obtenga todas las reservas del sistema
router.get('/admin/todas-las-reservas', verificarToken, verificarAdmin, obtenerTodasLasReservas);

// Ruta para obtener los horarios disponibles para una fecha y un servicio específicos
router.get('/horarios-disponibles', verificarToken, obtenerHorariosDisponibles);

// Exporta el router para ser usado en el archivo principal del backend
module.exports = router;
