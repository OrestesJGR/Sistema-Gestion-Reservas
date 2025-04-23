const Servicio = require('../models/Servicio');

// Crear un nuevo servicio (protegido, requiere token válido)
const crearServicio = async (req, res) => {
  try {
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

    res.status(201).json(nuevoServicio);
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

// Actualizar un servicio existente (protegido)
const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
      return res.status(400).json({ mensaje: 'Nombre y descripción son obligatorios' });
    }

    const servicioActualizado = await Servicio.findByIdAndUpdate(
      id,
      { nombre: nombre.trim(), descripcion: descripcion.trim() },
      { new: true }
    );

    if (!servicioActualizado) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    res.json(servicioActualizado);
  } catch (error) {
    console.error('❌ Error al actualizar servicio:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el servicio' });
  }
};

// Eliminar un servicio (protegido)
const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;

    const servicioEliminado = await Servicio.findByIdAndDelete(id);

    if (!servicioEliminado) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    res.json({ mensaje: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar servicio:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el servicio' });
  }
};

module.exports = {
  crearServicio,
  obtenerServicios,
  actualizarServicio,
  eliminarServicio
};
