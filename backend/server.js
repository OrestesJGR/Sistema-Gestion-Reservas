const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Configuración de variables de entorno
dotenv.config();

// Inicialización de la app
const app = express();
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB
connectDB();

// Middlewares globales
app.use(cors());
app.use(express.json()); // 💡 Este middleware permite leer req.body en formato JSON

// Rutas de la API
app.use('/api', require('./routes/index'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/reservas', require('./routes/reservas'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/contacto', require('./routes/contacto'));


// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
