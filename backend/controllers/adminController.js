const Usuario = require('../models/Usuario');
const Servicio = require('../models/Servicio');
const Reserva = require('../models/Reserva');

const obtenerEstadisticas = async (req, res) => {
  try {
    const totalUsuarios = await Usuario.countDocuments();
    const totalServicios = await Servicio.countDocuments();
    const totalReservas = await Reserva.countDocuments();

    res.json({
      totalUsuarios,
      totalServicios,
      totalReservas
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas' });
  }
};

const obtenerReservasPorServicio = async (req, res) => {
  try {
    const resultado = await Reserva.aggregate([
        {
        $group: {
            _id: '$servicio',
            total: { $sum: 1 }
        }
        },
        {
        $lookup: {
            from: 'servicios',
            localField: '_id',
            foreignField: '_id',
            as: 'servicio'
        }
        },
        {
        $unwind: '$servicio'
        },
        {
        $project: {
            servicio: '$servicio.nombre',
            total: 1
            }
        }
        ]);
    res.json(resultado);
  } catch (error) {
    console.error('Error al agrupar reservas por servicio:', error);
    res.status(500).json({ mensaje: 'Error al obtener datos de reservas por servicio' });
  }
};

module.exports = {
  obtenerEstadisticas,
  obtenerReservasPorServicio
};
