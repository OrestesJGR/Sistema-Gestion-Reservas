const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  servicio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicio',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  observaciones: {
    type: String,
    trim: true
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reserva', reservaSchema);
