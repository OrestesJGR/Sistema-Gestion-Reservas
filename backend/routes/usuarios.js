// Importa express y crea un router para definir rutas relacionadas con los usuarios
const express = require('express');
const router = express.Router();

// Importa controladores que gestionan funcionalidades del usuario
const {
  registrarUsuario,
  loginUsuario,
  obtenerTodosLosUsuarios,
  cambiarRolUsuario,
  eliminarUsuario
} = require('../controllers/usuarioController');

// Middleware para verificar si el usuario está autenticado
const verificarToken = require('../middleware/auth');

// Modelo Usuario necesario para algunas rutas como perfil y actualización directa
const Usuario = require('../models/Usuario');

// Ruta para registrar un nuevo usuario (acceso público)
router.post('/register', registrarUsuario);

// Ruta para iniciar sesión (login) (acceso público)
router.post('/login', loginUsuario);

// Ruta protegida para obtener el perfil del usuario autenticado
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    // Busca al usuario por el ID decodificado del token, excluyendo la contraseña
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

// Ruta protegida para obtener todos los usuarios registrados (normalmente usada por administradores)
router.get('/', verificarToken, obtenerTodosLosUsuarios);

// Ruta protegida para cambiar el rol de un usuario
router.put('/:id/rol', verificarToken, cambiarRolUsuario);

// Ruta protegida para eliminar un usuario
router.delete('/:id', verificarToken, eliminarUsuario);

// Ruta protegida para editar el perfil de un usuario (nombre y correo)
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { nombre, email } = req.body;

    // Actualiza el nombre y email del usuario correspondiente
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, email },
      { new: true, runValidators: true } // Devuelve el nuevo usuario actualizado, aplicando validaciones
    ).select('-password');

    res.json({ usuarioActualizado });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'No se pudo actualizar el perfil' });
  }
});

// Ruta protegida para cambiar la contraseña de un usuario
router.put('/:id/password', verificarToken, async (req, res) => {
  try {
    const { antigua, nueva } = req.body;

    // Busca al usuario por ID
    const usuario = await Usuario.findById(req.params.id);

    // Compara la contraseña actual con la enviada
    const coincide = await require('bcrypt').compare(antigua, usuario.password);
    if (!coincide) {
      return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta' });
    }

    // Encripta la nueva contraseña y la guarda
    const nuevaEncriptada = await require('bcrypt').hash(nueva, 10);
    usuario.password = nuevaEncriptada;
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ mensaje: 'Error al cambiar contraseña' });
  }
});

// Exporta el router para usarlo en el archivo principal de rutas
module.exports = router;
