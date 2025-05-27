// Importa el modelo Servicio para interactuar con la base de datos
const Servicio = require('../models/Servicio');

// Controlador para crear un nuevo servicio (requiere token válido)
const crearServicio = async (req, res) => {
  try {
    // Verifica que el cuerpo de la solicitud incluya nombre y descripción
    if (!req.body || !req.body.nombre || !req.body.descripcion) {
      return res.status(400).json({
        mensaje: 'Faltan campos requeridos: nombre y descripcion'
      });
    }

    const { nombre, descripcion } = req.body;

    // Crea una nueva instancia del servicio con los campos limpiados
    const nuevoServicio = new Servicio({
      nombre: nombre.trim(),
      descripcion: descripcion.trim()
    });

    // Guarda el nuevo servicio en la base de datos
    await nuevoServicio.save();

    // Devuelve el servicio creado
    res.status(201).json(nuevoServicio);
  } catch (error) {
    // Captura y muestra errores de ejecución
    console.error('❌ Error al crear servicio:', error);
    res.status(500).json({ mensaje: 'Error al crear servicio' });
  }
};

// Controlador para obtener todos los servicios activos (disponibles)
const obtenerServicios = async (req, res) => {
  try {
    // Busca todos los servicios con el campo disponible en true
    const servicios = await Servicio.find({ disponible: true });

    // Devuelve la lista de servicios
    res.json(servicios);
  } catch (error) {
    console.error('❌ Error al obtener servicios:', error);
    res.status(500).json({ mensaje: 'Error al obtener los servicios' });
  }
};

// Controlador para actualizar un servicio (requiere token y datos)
const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    // Verifica que ambos campos estén presentes
    if (!nombre || !descripcion) {
      return res.status(400).json({ mensaje: 'Nombre y descripción son obligatorios' });
    }

    // Busca y actualiza el servicio correspondiente
    const servicioActualizado = await Servicio.findByIdAndUpdate(
      id,
      { nombre: nombre.trim(), descripcion: descripcion.trim() },
      { new: true } // Devuelve el documento actualizado
    );

    // Si no existe el servicio, devuelve error 404
    if (!servicioActualizado) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    // Devuelve el servicio actualizado
    res.json(servicioActualizado);
  } catch (error) {
    console.error('❌ Error al actualizar servicio:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el servicio' });
  }
};

// Controlador para eliminar un servicio por ID
const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca y elimina el servicio indicado
    const servicioEliminado = await Servicio.findByIdAndDelete(id);

    // Si no existe, devuelve error 404
    if (!servicioEliminado) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    // Confirma la eliminación
    res.json({ mensaje: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar servicio:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el servicio' });
  }
};

// Exporta todos los controladores para ser utilizados en las rutas
module.exports = {
  crearServicio,
  obtenerServicios,
  actualizarServicio,
  eliminarServicio
};
