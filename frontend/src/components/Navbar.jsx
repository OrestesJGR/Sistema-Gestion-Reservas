// Importa Link y useNavigate de react-router-dom para navegación sin recarga de página
import { Link, useNavigate } from 'react-router-dom';

// Importa useEffect y useState para manejar estado y efectos en el componente
import { useEffect, useState } from 'react';

// Componente funcional Navbar que muestra la barra de navegación superior
function Navbar() {
  const navigate = useNavigate();

  // Estado local que almacena los datos del usuario autenticado (si existen)
  const [usuario, setUsuario] = useState(() => {
    const datos = localStorage.getItem('usuario');
    return datos ? JSON.parse(datos) : null;
  });

  // Se obtiene el token directamente desde localStorage
  const token = localStorage.getItem('token');

  // Efecto que escucha cambios en el localStorage, útil si hay cambios desde otra pestaña
  useEffect(() => {
    const actualizarUsuario = () => {
      const datos = localStorage.getItem('usuario');
      setUsuario(datos ? JSON.parse(datos) : null);
    };

    // Se registra un listener para detectar cambios en el almacenamiento
    window.addEventListener('storage', actualizarUsuario);

    // Limpia el listener al desmontar el componente
    return () => window.removeEventListener('storage', actualizarUsuario);
  }, []);

  // Función que elimina el token y los datos del usuario al cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null); // Limpia el estado
    navigate('/login'); // Redirige al login
  };

  // Renderiza la barra de navegación
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Título de la aplicación */}
      <h1 className="text-lg font-bold">NoteBook</h1>

      {/* Lista de enlaces */}
      <ul className="flex gap-4 items-center text-sm">
        {/* Enlaces públicos */}
        <li><Link to="/" className="hover:underline">Inicio</Link></li>
        <li><Link to="/servicios" className="hover:underline">Servicios</Link></li>

        {/* Enlaces visibles solo si hay sesión iniciada */}
        {token && <li><Link to="/mis-reservas" className="hover:underline">Mis reservas</Link></li>}
        {token && <li><Link to="/perfil" className="hover:underline">Mi perfil</Link></li>}

        {/* Enlaces exclusivos para el administrador */}
        {usuario?.rol === 'admin' && (
          <>
            <li><Link to="/admin" className="hover:underline">Panel Administrador</Link></li>
            <li><Link to="/admin/servicios" className="hover:underline">Gestión servicios</Link></li>
            <li><Link to="/admin/usuarios" className="hover:underline">Usuarios</Link></li>
            <li><Link to="/admin/contacto" className="hover:underline">Mensajes</Link></li>
          </>
        )}

        {/* Enlaces para visitantes no autenticados */}
        {!token && (
          <>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
            <li><Link to="/register" className="hover:underline">Registro</Link></li>
          </>
        )}

        {/* Botón de cerrar sesión si hay sesión iniciada */}
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
      </ul>
    </nav>
  );
}

// Exporta el componente para ser usado en la aplicación principal
export default Navbar;
