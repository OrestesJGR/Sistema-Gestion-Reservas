const Reserva = require('../models/Reserva');

const crearReserva = async (req, res) => {
  try {
    const { servicio, fecha, observaciones } = req.body;

    if (!servicio || !fecha) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios: servicio y fecha' });
    }

    const nueva = new Reserva({
      usuario: req.usuario.id, // viene del token verificado
      servicio,
      fecha,
      observaciones
    });

    await nueva.save();

    res.status(201).json({
      mensaje: 'Reserva creada correctamente',
      reserva: nueva
    });
  } catch (error) {
    console.error('❌ Error al crear reserva:', error);
    res.status(500).json({ mensaje: 'Error al crear reserva' });
  }
};

module.exports = {
  crearReserva
};
