const mongoose = require('mongoose');

const contactoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  mensaje: { type: String, required: true },
  archivado: { type: Boolean, default: false },
  creadoEn: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Contacto', contactoSchema);
