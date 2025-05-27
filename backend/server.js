// Importa express para crear el servidor web
const express = require('express');

// Importa CORS para permitir peticiones desde dominios distintos (como el frontend en otro puerto)
const cors = require('cors');

// Importa dotenv para poder leer variables de entorno desde un archivo .env
const dotenv = require('dotenv');

// Importa la función que conecta a la base de datos MongoDB
const connectDB = require('./config/db');

// Carga las variables definidas en el archivo .env al entorno de Node.js
dotenv.config();

// Inicializa una aplicación de Express
const app = express();

// Define el puerto donde se ejecutará el servidor (por defecto 5000 si no está definido en .env)
const PORT = process.env.PORT || 5000;

// Conecta a la base de datos MongoDB antes de iniciar el servidor
connectDB();

// Middlewares globales

// Habilita CORS para que el frontend pueda hacer peticiones al backend desde otro origen
app.use(cors());

// Middleware para permitir que el servidor reciba y procese datos en formato JSON desde el cuerpo de las solicitudes
app.use(express.json()); // Permite acceder a req.body

// Define las rutas principales del backend, cada una delega a su respectivo archivo de rutas
app.use('/api', require('./routes/index')); // Ruta raíz de la API
app.use('/api/usuarios', require('./routes/usuarios')); // Gestión de usuarios
app.use('/api/servicios', require('./routes/servicios')); // Gestión de servicios
app.use('/api/reservas', require('./routes/reservas')); // Gestión de reservas
app.use('/api/admin', require('./routes/admin')); // Rutas exclusivas para administrador
app.use('/api/contacto', require('./routes/contacto')); // Gestión de mensajes de contacto

// Inicia el servidor y lo pone a escuchar en el puerto especificado
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
