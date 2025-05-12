const Contacto = require('../models/Contacto');

const crearMensaje = async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    const nuevoMensaje = new Contacto({ nombre, email, mensaje });
    await nuevoMensaje.save();

    res.status(201).json({ mensaje: 'Mensaje guardado correctamente' });
  } catch (error) {
    console.error('❌ Error al guardar mensaje:', error);
    res.status(500).json({ mensaje: 'Error al enviar el mensaje' });
  }
};

const obtenerMensajes = async (req, res) => {
  try {
    const archivados = req.query.archivados === 'true';
    const mensajes = await Contacto.find({ archivado: archivados }).sort({ creadoEn: -1 });
    res.json(mensajes);
  } catch (error) {
    console.error('❌ Error al obtener mensajes:', error);
    res.status(500).json({ mensaje: 'Error al cargar mensajes' });
  }
};



const eliminarMensaje = async (req, res) => {
  try {
    await Contacto.findByIdAndUpdate(req.params.id, { archivado: true });
    res.json({ mensaje: 'Mensaje archivado correctamente' });
  } catch (error) {
    console.error('❌ Error al archivar mensaje:', error);
    res.status(500).json({ mensaje: 'Error al archivar mensaje' });
  }
};

const restaurarMensaje = async (req, res) => {
  try {
    const mensaje = await Contacto.findByIdAndUpdate(
      req.params.id,
      { archivado: false },
      { new: true }
    );

    if (!mensaje) return res.status(404).json({ mensaje: 'Mensaje no encontrado' });

    res.json({ mensaje: 'Mensaje restaurado', mensaje });
  } catch (error) {
    console.error('❌ Error al restaurar mensaje:', error);
    res.status(500).json({ mensaje: 'Error al restaurar mensaje' });
  }
};



module.exports = {
  crearMensaje,
  obtenerMensajes,
  eliminarMensaje,
  restaurarMensaje
};
