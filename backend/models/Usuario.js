const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true // ayuda a evitar registros duplicados con mayúsculas
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['usuario', 'moderador', 'admin'],
    default: 'usuario',
    required: true
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
