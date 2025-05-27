// Importa Mongoose, la biblioteca que permite definir esquemas para MongoDB
const mongoose = require('mongoose');

// Define el esquema de Contacto, que representa los mensajes enviados desde el formulario de contacto
const contactoSchema = new mongoose.Schema({
  // Campo nombre del remitente (obligatorio)
  nombre: { type: String, required: true },

  // Campo email del remitente (obligatorio)
  email: { type: String, required: true },

  // Campo mensaje que contiene el contenido enviado (obligatorio)
  mensaje: { type: String, required: true },

  // Campo para marcar si el mensaje está archivado o no (por defecto, no archivado)
  archivado: { type: Boolean, default: false },

  // Campo que almacena la fecha de creación del mensaje (por defecto, la fecha actual)
  creadoEn: { type: Date, default: Date.now }
});

// Exporta el modelo Contacto, que será usado para acceder a la colección "contactos" en MongoDB
module.exports = mongoose.model('Contacto', contactoSchema);
