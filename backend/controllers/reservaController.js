const Reserva = require('../models/Reserva');

// Crear nueva reserva
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

// Obtener reservas del usuario autenticado
const obtenerReservasUsuario = async (req, res) => {
  try {
    const reservas = await Reserva.find({ usuario: req.usuario.id })
      .populate('servicio', 'nombre descripcion')
      .sort({ fecha: -1 });

    res.json(reservas);
  } catch (error) {
    console.error('❌ Error al obtener reservas del usuario:', error);
    res.status(500).json({ mensaje: 'Error al obtener reservas' });
  }
};

// Obtener todas las reservas del sistema (solo para admin)
const obtenerTodasLasReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find()
      .populate('usuario', 'nombre email') // info del usuario que reservó
      .populate('servicio', 'nombre descripcion') // info del servicio reservado
      .sort({ fecha: -1 });

    res.json(reservas);
  } catch (error) {
    console.error('❌ Error al obtener todas las reservas:', error);
    res.status(500).json({ mensaje: 'Error al obtener todas las reservas' });
  }
};


// Eliminar (cancelar) una reserva
const eliminarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);

    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    // Verifica que la reserva pertenezca al usuario
    if (reserva.usuario.toString() !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para cancelar esta reserva' });
    }

    await reserva.deleteOne();

    res.json({ mensaje: 'Reserva cancelada correctamente' });
  } catch (error) {
    console.error('❌ Error al cancelar reserva:', error);
    res.status(500).json({ mensaje: 'Error al cancelar la reserva' });
  }
};

module.exports = {
  crearReserva,
  obtenerReservasUsuario,
  eliminarReserva,
  obtenerTodasLasReservas 
};
