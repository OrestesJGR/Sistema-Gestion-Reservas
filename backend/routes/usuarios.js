const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario } = require('../controllers/usuarioController');
const verificarToken = require('../middleware/auth');

// Registro
router.post('/register', registrarUsuario);

// Login
router.post('/login', loginUsuario);

module.exports = router;

// Ruta protegida de prueba
router.get('/perfil', verificarToken, (req, res) => {
    res.json({
      mensaje: `Hola ${req.usuario.id}, estás autenticado como ${req.usuario.rol}`
    });
  });