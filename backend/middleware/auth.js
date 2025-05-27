// Importa la biblioteca jsonwebtoken para verificar tokens JWT
const jwt = require('jsonwebtoken');

// Middleware para verificar si el usuario está autenticado mediante un token
const verificarToken = (req, res, next) => {
  // Extrae el token del encabezado Authorization (formato: "Bearer <token>")
  const token = req.header('Authorization')?.split(' ')[1];

  // Si no hay token presente, devuelve error 401 (no autorizado)
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No hay token' });
  }

  try {
    // Verifica el token usando la clave secreta definida en las variables de entorno
    const verificado = jwt.verify(token, process.env.JWT_SECRET);

    // Añade el objeto usuario al objeto req, para que esté disponible en la siguiente función
    req.usuario = verificado;

    // Llama a next() para continuar con la ejecución de la ruta protegida
    next();
  } catch (error) {
    // Si el token es inválido o expirado, devuelve error 401
    res.status(401).json({ mensaje: 'Token inválido' });
  }
};

// Exporta el middleware para ser usado en rutas protegidas
module.exports = verificarToken;
