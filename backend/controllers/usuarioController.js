// Importación del modelo Usuario y de bibliotecas necesarias para encriptación y autenticación
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt'); // Para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Para generar tokens JWT

// Función para validar contraseñas seguras según patrón:
// Al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial
const esContrasenaSegura = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// Controlador para registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verifica si la contraseña cumple con los requisitos de seguridad
    if (!esContrasenaSegura(password)) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y un carácter especial.'
      });
    }

    // Verifica si ya existe un usuario con ese correo
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    // Encripta la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea y guarda el nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword
    });

    await nuevoUsuario.save();

    // Devuelve respuesta exitosa
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario' });
  }
};

// Controlador para iniciar sesión de un usuario
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca al usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Compara la contraseña introducida con la guardada en la base de datos
    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Genera un token JWT válido por 2 horas
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Devuelve el token y los datos del usuario
    res.json({
      mensaje: 'Inicio de sesión correcto',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

// Controlador para obtener todos los usuarios (usado en el panel de administración)
const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    // Obtiene todos los usuarios, excluyendo sus contraseñas
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};

// Controlador para cambiar el rol de un usuario (solo admin)
const cambiarRolUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    // Verifica si el rol recibido es válido
    if (!['usuario', 'moderador', 'admin'].includes(rol)) {
      return res.status(400).json({ mensaje: 'Rol no válido' });
    }

    // Actualiza el rol del usuario por su ID
    const usuario = await Usuario.findByIdAndUpdate(id, { rol }, { new: true });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al cambiar el rol:', error);
    res.status(500).json({ mensaje: 'Error al cambiar el rol del usuario' });
  }
};

// Controlador para eliminar un usuario de la base de datos
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndDelete(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
  }
};

// Exporta todos los controladores para ser usados en las rutas del backend
module.exports = {
  registrarUsuario,
  loginUsuario,
  obtenerTodosLosUsuarios,
  cambiarRolUsuario,
  eliminarUsuario
};
