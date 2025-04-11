import { Navigate } from 'react-router-dom';

function RutaProtegidaAdmin({ children }) {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // No logueado o sin rol admin
  if (!token || usuario?.rol !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RutaProtegidaAdmin;
