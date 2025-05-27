// Importa la biblioteca Mongoose para definir esquemas y modelos en MongoDB
const mongoose = require('mongoose');

// Define el esquema del usuario, que representa a cualquier persona que se registra en la plataforma
const usuarioSchema = new mongoose.Schema({
  // Nombre del usuario (obligatorio, sin espacios extra)
  nombre: {
    type: String,
    required: true,
    trim: true
  },

  // Correo electrónico del usuario
  email: {
    type: String,
    required: true,
    unique: true,        // No se permite repetir emails
    trim: true,          // Elimina espacios al principio/final
    lowercase: true      // Convierte a minúsculas para evitar duplicados por mayúsculas
  },

  // Contraseña encriptada del usuario (obligatoria)
  password: {
    type: String,
    required: true
  },

  // Rol del usuario dentro del sistema
  rol: {
    type: String,
    enum: ['usuario', 'moderador', 'admin'], // Valores válidos
    default: 'usuario',                      // Por defecto, es un usuario estándar
    required: true
  },

  // Fecha en la que se creó el usuario
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

// Exporta el modelo Usuario para poder ser utilizado en controladores y rutas
module.exports = mongoose.model('Usuario', usuarioSchema);
