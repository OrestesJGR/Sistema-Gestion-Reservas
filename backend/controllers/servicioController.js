const Servicio = require('../models/Servicio');

// Crear un nuevo servicio (protegido, requiere token válido)
const crearServicio = async (req, res) => {
  try {
    // Validación básica para asegurarnos de que req.body llega bien
    if (!req.body || !req.body.nombre || !req.body.descripcion) {
      return res.status(400).json({
        mensaje: 'Faltan campos requeridos: nombre y descripcion'
      });
    }

    const { nombre, descripcion } = req.body;

    const nuevoServicio = new Servicio({
      nombre: nombre.trim(),
      descripcion: descripcion.trim()
    });

    await nuevoServicio.save();

    res.status(201).json({
      mensaje: 'Servicio creado correctamente',
      servicio: nuevoServicio
    });

  } catch (error) {
    console.error('❌ Error al crear servicio:', error);
    res.status(500).json({ mensaje: 'Error al crear servicio' });
  }
};

// Obtener todos los servicios disponibles (público)
const obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find({ disponible: true });
    res.json(servicios);
  } catch (error) {
    console.error('❌ Error al obtener servicios:', error);
    res.status(500).json({ mensaje: 'Error al obtener los servicios' });
  }
};

module.exports = {
  crearServicio,
  obtenerServicios
};
