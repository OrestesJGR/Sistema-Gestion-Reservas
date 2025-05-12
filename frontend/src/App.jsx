import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Servicios from './pages/Servicios';
import MisReservas from './pages/MisReservas';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ✅ Nuevo Footer
import AdminPanel from './pages/AdminPanel';
import RutaProtegidaAdmin from './components/RutaProtegidaAdmin';
import AdminServicios from './pages/AdminServicios';
import AdminUsuarios from './pages/AdminUsuarios';
import Perfil from './pages/Perfil';
import Home from './pages/Home';
import Contacto from './pages/Contacto';
import AdminContacto from './pages/AdminContacto';


function App() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        {/* ✅ Rutas de la aplicación */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/mis-reservas" element={<MisReservas />} />
          <Route path="/perfil" element={<Perfil />} />

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

          <Route path="/contacto" element={<Contacto />} />

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

      {/* ✅ Footer presente en todas las vistas */}
      <Footer />
    </>
  );
}

export default App;
