// Importación de los modelos de Mongoose para interactuar con la base de datos
const Usuario = require('../models/Usuario');
const Servicio = require('../models/Servicio');
const Reserva = require('../models/Reserva');

// Controlador para obtener estadísticas generales del sistema
const obtenerEstadisticas = async (req, res) => {
  try {
    // Cuenta el total de documentos en cada colección
    const totalUsuarios = await Usuario.countDocuments();
    const totalServicios = await Servicio.countDocuments();
    const totalReservas = await Reserva.countDocuments();

    // Devuelve los datos como JSON
    res.json({
      totalUsuarios,
      totalServicios,
      totalReservas
    });
  } catch (error) {
    // Captura y reporta cualquier error ocurrido durante la consulta
    console.error('❌ Error al obtener estadísticas:', error);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas' });
  }
};

// Controlador para obtener el número total de reservas agrupadas por servicio
const obtenerReservasPorServicio = async (req, res) => {
  try {
    // Utiliza agregación para agrupar reservas por el ID del servicio
    const resultado = await Reserva.aggregate([
      {
        // Agrupa por campo 'servicio' y suma la cantidad de reservas
        $group: {
          _id: '$servicio',
          total: { $sum: 1 }
        }
      },
      {
        // Realiza un join con la colección 'servicios' para obtener los nombres
        $lookup: {
          from: 'servicios',
          localField: '_id',
          foreignField: '_id',
          as: 'servicio'
        }
      },
      {
        // Desestructura el array 'servicio' para dejar un solo objeto
        $unwind: '$servicio'
      },
      {
        // Proyecta el nombre del servicio y el total de reservas
        $project: {
          servicio: '$servicio.nombre',
          total: 1
        }
      }
    ]);

    // Devuelve el resultado al cliente
    res.json(resultado);
  } catch (error) {
    // Captura errores durante la agregación
    console.error('Error al agrupar reservas por servicio:', error);
    res.status(500).json({ mensaje: 'Error al obtener datos de reservas por servicio' });
  }
};

// Exportación de los controladores para ser usados en las rutas
module.exports = {
  obtenerEstadisticas,
  obtenerReservasPorServicio
};
