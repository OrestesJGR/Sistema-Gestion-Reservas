module.exports = (req, res, next) => {
    if (req.usuario && req.usuario.rol === 'admin') {
      next();
    } else {
      return res.status(403).json({ mensaje: 'Acceso denegado: solo administradores' });
    }
  };
  