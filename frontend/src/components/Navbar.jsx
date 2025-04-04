import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <h1 className="text-lg font-bold">Gestor de Reservas</h1>
      <ul className="flex gap-4 items-center text-sm">
        <li><Link to="/" className="hover:underline">Inicio</Link></li>
        <li><Link to="/servicios" className="hover:underline">Servicios</Link></li>
        {token && <li><Link to="/mis-reservas" className="hover:underline">Mis reservas</Link></li>}
        {!token && (
          <>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
            <li><Link to="/register" className="hover:underline">Registro</Link></li>
          </>
        )}
        {token && (
          <li>
            <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
              Cerrar sesión
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
