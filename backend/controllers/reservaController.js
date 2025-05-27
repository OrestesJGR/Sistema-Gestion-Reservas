// Importa el modelo Reserva para interactuar con la colección de reservas en la base de datos
const Reserva = require('../models/Reserva');

// Controlador para crear una nueva reserva
const crearReserva = async (req, res) => {
  try {
    // Extrae los datos necesarios desde el cuerpo de la solicitud
    const { servicio, fecha, observaciones } = req.body;

    // Verifica que los campos obligatorios estén presentes
    if (!servicio || !fecha) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios: servicio y fecha' });
    }

    // Crea una nueva instancia del modelo Reserva con los datos proporcionados
    const nueva = new Reserva({
      usuario: req.usuario.id, // El ID del usuario autenticado (viene del token)
      servicio,
      fecha,
      observaciones
    });

    // Guarda la reserva en la base de datos
    await nueva.save();

    // Devuelve respuesta exitosa con la reserva creada
    res.status(201).json({
      mensaje: 'Reserva creada correctamente',
      reserva: nueva
    });
  } catch (error) {
    // Captura cualquier error y responde con estado 500
    console.error('❌ Error al crear reserva:', error);
    res.status(500).json({ mensaje: 'Error al crear reserva' });
  }
};

// Controlador para obtener todas las reservas del usuario autenticado
const obtenerReservasUsuario = async (req, res) => {
  try {
    // Busca todas las reservas asociadas al usuario actual
    const reservas = await Reserva.find({ usuario: req.usuario.id })
      .populate('servicio', 'nombre descripcion') // Rellena los datos del servicio
      .sort({ fecha: -1 }); // Ordena por fecha descendente

    res.json(reservas);
  } catch (error) {
    console.error('❌ Error al obtener reservas del usuario:', error);
    res.status(500).json({ mensaje: 'Error al obtener reservas' });
  }
};

// Controlador para obtener todas las reservas del sistema (solo accesible para administradores)
const obtenerTodasLasReservas = async (req, res) => {
  try {
    // Busca todas las reservas y rellena datos del usuario y servicio
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

// Controlador para obtener las franjas horarias disponibles por fecha y servicio
const obtenerHorariosDisponibles = async (req, res) => {
  try {
    const { fecha, servicio } = req.query;

    // Verifica que se haya recibido la fecha y el ID del servicio
    if (!fecha || !servicio) {
      return res.status(400).json({ mensaje: 'Faltan parámetros: fecha o servicio' });
    }

    // Genera franjas de 30 minutos entre un rango de horas
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

    // Genera todas las franjas horarias disponibles para mañana y tarde
    const franjasManana = generarFranjas('09:00', '14:00');
    const franjasTarde = generarFranjas('18:00', '21:00');
    const todasLasFranjas = [...franjasManana, ...franjasTarde];

    // Busca las reservas ya ocupadas para esa fecha y servicio
    const reservas = await Reserva.find({
      servicio,
      fecha: {
        $gte: new Date(`${fecha}T00:00:00`),
        $lte: new Date(`${fecha}T23:59:59`)
      }
    });

    // Convierte las fechas reservadas a ISO string
    const ocupadas = reservas.map(r => new Date(r.fecha).toISOString());

    // Filtra las franjas disponibles eliminando las ya ocupadas
    const disponibles = todasLasFranjas.filter(f => !ocupadas.includes(f));

    res.json(disponibles);
  } catch (error) {
    console.error('❌ Error al obtener horarios disponibles:', error);
    res.status(500).json({ mensaje: 'Error al obtener horarios' });
  }
};

// Controlador para cancelar una reserva (solo si pertenece al usuario autenticado)
const eliminarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);

    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    // Verifica que el usuario actual sea el propietario de la reserva
    if (reserva.usuario.toString() !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para cancelar esta reserva' });
    }

    // Elimina la reserva de la base de datos
    await reserva.deleteOne();

    res.json({ mensaje: 'Reserva cancelada correctamente' });
  } catch (error) {
    console.error('❌ Error al cancelar reserva:', error);
    res.status(500).json({ mensaje: 'Error al cancelar la reserva' });
  }
};

// Exporta todos los controladores para usarlos en las rutas del backend
module.exports = {
  crearReserva,
  obtenerReservasUsuario,
  eliminarReserva,
  obtenerTodasLasReservas,
  obtenerHorariosDisponibles
};
