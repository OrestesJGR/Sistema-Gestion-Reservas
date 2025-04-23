import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Servicios from './pages/Servicios';
import MisReservas from './pages/MisReservas';
import Navbar from './components/Navbar';
import AdminPanel from './pages/AdminPanel';
import RutaProtegidaAdmin from './components/RutaProtegidaAdmin';
import AdminServicios from './pages/AdminServicios';
import AdminUsuarios from './pages/AdminUsuarios';





function App() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-center text-2xl font-bold my-6">Sistema de Gestión de Reservas</h1>
        <Routes>
          <Route path="/" element={<p className="text-center">Bienvenido a la app de reservas</p>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/mis-reservas" element={<MisReservas />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route
            path="/admin"
            element={
              <RutaProtegidaAdmin>
                <AdminPanel />
              </RutaProtegidaAdmin>
            }
          />
          <Route
            path="/admin/servicios"
            element={
              <RutaProtegidaAdmin>
                <AdminServicios />
              </RutaProtegidaAdmin>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <RutaProtegidaAdmin>
                <AdminUsuarios />
              </RutaProtegidaAdmin>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
