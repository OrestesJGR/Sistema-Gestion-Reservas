const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario } = require('../controllers/usuarioController');

// Registro
router.post('/register', registrarUsuario);

// Login
router.post('/login', loginUsuario);

module.exports = router;
