import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(() => {
    const datos = localStorage.getItem('usuario');
    return datos ? JSON.parse(datos) : null;
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Detectar cambios en localStorage (por si login ocurre en otra pestaña o no refresca)
    const actualizarUsuario = () => {
      const datos = localStorage.getItem('usuario');
      setUsuario(datos ? JSON.parse(datos) : null);
    };

    window.addEventListener('storage', actualizarUsuario);
    return () => window.removeEventListener('storage', actualizarUsuario);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <h1 className="text-lg font-bold">Gestor de Reservas</h1>
      <ul className="flex gap-4 items-center text-sm">
        <li><Link to="/" className="hover:underline">Inicio</Link></li>
        <li><Link to="/servicios" className="hover:underline">Servicios</Link></li>

        {token && <li><Link to="/mis-reservas" className="hover:underline">Mis reservas</Link></li>}
        {token && <li><Link to="/perfil" className="hover:underline">Mi perfil</Link></li>} {/* 👈 Añadido */}

        {/* Solo para administradores */}
        {usuario?.rol === 'admin' && (
          <>
            <li><Link to="/admin" className="hover:underline">Admin</Link></li>
            <li><Link to="/admin/servicios" className="hover:underline">Gestión servicios</Link></li>
            <li><Link to="/admin/usuarios" className="hover:underline">Usuarios</Link></li>
          </>
        )}

        {!token && (
          <>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
            <li><Link to="/register" className="hover:underline">Registro</Link></li>
          </>
        )}

        {token && (
          <li>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </li>
        )}

        <li><Link to="/contacto" className="hover:underline">Contacto</Link></li>

      </ul>
    </nav>
  );
}

export default Navbar;
