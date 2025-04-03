import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Servicios from './pages/Servicios';

function App() {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold my-6">Sistema de Gestión de Reservas</h1>
      <Routes>
        <Route path="/" element={<p className="text-center">Bienvenido a la app de reservas</p>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/servicios" element={<Servicios />} />
      </Routes>
    </div>
  );
}

export default App;
