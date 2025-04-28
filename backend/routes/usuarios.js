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
const Usuario = require('../models/Usuario'); // 👈 Importación necesaria para buscar al usuario

// Registro
router.post('/register', registrarUsuario);

// Login
router.post('/login', loginUsuario);

// Ruta de obtener perfil del usuario autenticado
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ usuario });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ mensaje: 'Error al obtener perfil del usuario' });
  }
});

// Obtener todos los usuarios
router.get('/', verificarToken, obtenerTodosLosUsuarios);

// Cambiar el rol de un usuario
router.put('/:id/rol', verificarToken, cambiarRolUsuario);

// Eliminar usuario
router.delete('/:id', verificarToken, eliminarUsuario);

//Editar perfil de usuario
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { nombre, email } = req.body;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ usuarioActualizado });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'No se pudo actualizar el perfil' });
  }
});

//Cambiar contraseña de usuario
router.put('/:id/password', verificarToken, async (req, res) => {
  try {
    const { antigua, nueva } = req.body;
    const usuario = await Usuario.findById(req.params.id);

    const coincide = await require('bcrypt').compare(antigua, usuario.password);
    if (!coincide) {
      return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta' });
    }

    const nuevaEncriptada = await require('bcrypt').hash(nueva, 10);
    usuario.password = nuevaEncriptada;
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ mensaje: 'Error al cambiar contraseña' });
  }
});


module.exports = router;
