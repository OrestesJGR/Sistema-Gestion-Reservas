import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Páginas principales de usuario
import Login from './pages/Login';
import Register from './pages/Register';
import Servicios from './pages/Servicios';
import MisReservas from './pages/MisReservas';
import Perfil from './pages/Perfil';
import Home from './pages/Home';
import Contacto from './pages/Contacto';

// Componentes comunes
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ✅ Nuevo Footer

// Páginas de administración
import AdminPanel from './pages/AdminPanel';
import AdminServicios from './pages/AdminServicios';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminContacto from './pages/AdminContacto';
import RutaProtegidaAdmin from './components/RutaProtegidaAdmin'; // Protege rutas de admins

function App() {
  return (
    <>
      {/* Navbar fijo en todas las vistas */}
      <Navbar />

      {/* Contenedor de las vistas */}
      <div className="p-6">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/mis-reservas" element={<MisReservas />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* Rutas protegidas por rol administrador */}
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
          <Route
            path="/admin/contacto"
            element={
              <RutaProtegidaAdmin>
                <AdminContacto />
              </RutaProtegidaAdmin>
            }
          />
        </Routes>
      </div>

      {/* Footer fijo en todas las vistas */}
      <Footer />
    </>
  );
}

export default App;
