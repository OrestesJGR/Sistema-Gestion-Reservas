const Reserva = require('../models/Reserva');

// Crear nueva reserva
const crearReserva = async (req, res) => {
  try {
    const { servicio, fecha, observaciones } = req.body;

    if (!servicio || !fecha) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios: servicio y fecha' });
    }

    const nueva = new Reserva({
      usuario: req.usuario.id,
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
      .populate('usuario', 'nombre email')
      .populate('servicio', 'nombre descripcion')
      .sort({ fecha: -1 });

    res.json(reservas);
  } catch (error) {
    console.error('❌ Error al obtener todas las reservas:', error);
    res.status(500).json({ mensaje: 'Error al obtener todas las reservas' });
  }
};

// Obtener horarios disponibles por fecha y servicio
const obtenerHorariosDisponibles = async (req, res) => {
  try {
    const { fecha, servicio } = req.query;

    if (!fecha || !servicio) {
      return res.status(400).json({ mensaje: 'Faltan parámetros: fecha o servicio' });
    }

    // Generar franjas por defecto
    const generarFranjas = (inicio, fin) => {
      const franjas = [];
      const actual = new Date(`${fecha}T${inicio}:00`);
      const final = new Date(`${fecha}T${fin}:00`);

      while (actual < final) {
        franjas.push(new Date(actual).toISOString());
        actual.setMinutes(actual.getMinutes() + 30);
      }

      return franjas;
    };

    const franjasManana = generarFranjas('09:00', '14:00');
    const franjasTarde = generarFranjas('18:00', '21:00');
    const todasLasFranjas = [...franjasManana, ...franjasTarde];

    const reservas = await Reserva.find({
      servicio,
      fecha: { $gte: new Date(`${fecha}T00:00:00`), $lte: new Date(`${fecha}T23:59:59`) }
    });

    const ocupadas = reservas.map(r => new Date(r.fecha).toISOString());
    const disponibles = todasLasFranjas.filter(f => !ocupadas.includes(f));

    res.json(disponibles);
  } catch (error) {
    console.error('❌ Error al obtener horarios disponibles:', error);
    res.status(500).json({ mensaje: 'Error al obtener horarios' });
  }
};

// Eliminar (cancelar) una reserva
const eliminarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);

    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

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
  obtenerTodasLasReservas,
  obtenerHorariosDisponibles
};
