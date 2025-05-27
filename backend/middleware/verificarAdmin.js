// Middleware para verificar si el usuario tiene rol de administrador
module.exports = (req, res, next) => {
  // Comprueba que exista un usuario en el objeto req y que su rol sea 'admin'
  if (req.usuario && req.usuario.rol === 'admin') {
    // Si es administrador, continúa con la ejecución de la siguiente función o ruta
    next();
  } else {
    // Si no es admin, devuelve error 403 (prohibido)
    return res.status(403).json({ mensaje: 'Acceso denegado: solo administradores' });
  }
};
