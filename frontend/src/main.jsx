import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Habilita el uso de rutas en React
import App from './App.jsx'; // Componente principal de la app
import './index.css'; // Estilos globales

// Punto de montaje principal de la app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Envolvemos la app con BrowserRouter para poder usar rutas */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
