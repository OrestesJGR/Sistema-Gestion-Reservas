// Importa Mongoose para definir esquemas y modelos en MongoDB
const mongoose = require('mongoose');

// Define el esquema de un servicio que puede ser reservado por los usuarios
const servicioSchema = new mongoose.Schema({
  // Nombre del servicio (obligatorio, sin espacios innecesarios)
  nombre: {
    type: String,
    required: true,
    trim: true // Elimina espacios en blanco al inicio y final
  },

  // Descripción del servicio (obligatorio)
  descripcion: {
    type: String,
    required: true
  },

  // Indica si el servicio está activo y disponible para reservas
  disponible: {
    type: Boolean,
    default: true // Por defecto, el servicio está disponible
  },

  // Fecha de creación del servicio
  creadoEn: {
    type: Date,
    default: Date.now // Asigna automáticamente la fecha actual
  }
});

// Exporta el modelo Servicio para poder utilizarlo en otros módulos
module.exports = mongoose.model('Servicio', servicioSchema);
