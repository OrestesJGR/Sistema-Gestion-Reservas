const express = require('express');
const router = express.Router();
const {
  registrarUsuario,
  loginUsuario,
  obtenerTodosLosUsuarios,
  cambiarRolUsuario,
  eliminarUsuario 
} = require('../controllers/usuarioController');
const verificarToken = require('../middleware/auth');

// Registro
router.post('/register', registrarUsuario);

// Login
router.post('/login', loginUsuario);

// Ruta protegida de prueba
router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    mensaje: `Hola ${req.usuario.id}, estás autenticado como ${req.usuario.rol}`
  });
});

// Obtener todos los usuarios
router.get('/', verificarToken, obtenerTodosLosUsuarios);

// Cambiar el rol de un usuario
router.put('/:id/rol', verificarToken, cambiarRolUsuario);

// Eliminar usuario
router.delete('/:id', verificarToken, eliminarUsuario); 

module.exports = router;
