// Importa la biblioteca Mongoose para definir el esquema del modelo
const mongoose = require('mongoose');

// Define el esquema de una reserva en la base de datos
const reservaSchema = new mongoose.Schema({
  // Referencia al usuario que realiza la reserva (relación con la colección 'Usuario')
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },

  // Referencia al servicio reservado (relación con la colección 'Servicio')
  servicio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicio',
    required: true
  },

  // Fecha y hora de la reserva (obligatorio)
  fecha: {
    type: Date,
    required: true
  },

  // Campo opcional para observaciones adicionales del usuario
  observaciones: {
    type: String,
    trim: true // Elimina espacios en blanco al inicio y al final
  },

  // Fecha de creación de la reserva (por defecto, la fecha actual)
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

// Exporta el modelo para interactuar con la colección 'reservas' en MongoDB
module.exports = mongoose.model('Reserva', reservaSchema);
