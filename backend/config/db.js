// Importa la biblioteca mongoose para interactuar con MongoDB
const mongoose = require('mongoose');

// Función asíncrona para conectar a la base de datos
const connectDB = async () => {
  try {
    // Intenta conectar a la base de datos usando la URI definida en las variables de entorno
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,         // Usa el nuevo analizador de URLs de MongoDB
      useUnifiedTopology: true       // Usa el nuevo motor de gestión de conexiones
    });

    // Si la conexión es exitosa, muestra un mensaje en consola
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    // Si ocurre un error, muestra el mensaje de error y finaliza el proceso
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  }
};

// Exporta la función para ser utilizada en otros archivos del proyecto
module.exports = connectDB;
