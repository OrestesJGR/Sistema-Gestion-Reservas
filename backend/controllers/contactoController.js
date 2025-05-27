// Importa el modelo Contacto que representa los mensajes del formulario de contacto
const Contacto = require('../models/Contacto');

// Controlador para crear y guardar un nuevo mensaje de contacto
const crearMensaje = async (req, res) => {
  try {
    // Extrae los datos enviados desde el frontend
    const { nombre, email, mensaje } = req.body;

    // Crea una nueva instancia del modelo Contacto
    const nuevoMensaje = new Contacto({ nombre, email, mensaje });

    // Guarda el mensaje en la base de datos
    await nuevoMensaje.save();

    // Respuesta exitosa
    res.status(201).json({ mensaje: 'Mensaje guardado correctamente' });
  } catch (error) {
    // Manejo de errores durante el guardado
    console.error('❌ Error al guardar mensaje:', error);
    res.status(500).json({ mensaje: 'Error al enviar el mensaje' });
  }
};

// Controlador para obtener mensajes, filtrando si están archivados o no
const obtenerMensajes = async (req, res) => {
  try {
    // Determina si se quieren los archivados o no desde la query string
    const archivados = req.query.archivados === 'true';

    // Consulta a la base de datos los mensajes según su estado
    const mensajes = await Contacto.find({ archivado: archivados }).sort({ creadoEn: -1 });

    // Devuelve los mensajes ordenados por fecha de creación descendente
    res.json(mensajes);
  } catch (error) {
    // Manejo de errores durante la consulta
    console.error('❌ Error al obtener mensajes:', error);
    res.status(500).json({ mensaje: 'Error al cargar mensajes' });
  }
};

// Controlador para archivar un mensaje (no se elimina físicamente)
const eliminarMensaje = async (req, res) => {
  try {
    // Marca el mensaje como archivado (soft delete)
    await Contacto.findByIdAndUpdate(req.params.id, { archivado: true });
    res.json({ mensaje: 'Mensaje archivado correctamente' });
  } catch (error) {
    // Manejo de errores durante la actualización
    console.error('❌ Error al archivar mensaje:', error);
    res.status(500).json({ mensaje: 'Error al archivar mensaje' });
  }
};

// Controlador para restaurar un mensaje previamente archivado
const restaurarMensaje = async (req, res) => {
  try {
    // Cambia el campo archivado a false
    const mensaje = await Contacto.findByIdAndUpdate(
      req.params.id,
      { archivado: false },
      { new: true } // Devuelve el documento actualizado
    );

    // Si no se encuentra el mensaje, devuelve error 404
    if (!mensaje) return res.status(404).json({ mensaje: 'Mensaje no encontrado' });

    // Devuelve el mensaje restaurado
    res.json({ mensaje: 'Mensaje restaurado', mensaje });
  } catch (error) {
    // Manejo de errores durante la restauración
    console.error('❌ Error al restaurar mensaje:', error);
    res.status(500).json({ mensaje: 'Error al restaurar mensaje' });
  }
};

// Exporta los controladores para ser utilizados en las rutas del backend
module.exports = {
  crearMensaje,
  obtenerMensajes,
  eliminarMensaje,
  restaurarMensaje
};
