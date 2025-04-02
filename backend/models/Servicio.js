const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  disponible: {
    type: Boolean,
    default: true
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Servicio', servicioSchema);
