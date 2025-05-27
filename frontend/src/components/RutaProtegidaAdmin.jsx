// Importa el componente Navigate para redirigir a otra ruta si no se cumplen ciertas condiciones
import { Navigate } from 'react-router-dom';

// Componente de orden superior que protege rutas específicas para administradores
function RutaProtegidaAdmin({ children }) {
  // Obtiene el token almacenado localmente (indicador de sesión activa)
  const token = localStorage.getItem('token');

  // Obtiene los datos del usuario (incluido el rol) desde localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Si no hay token o el rol no es 'admin', redirige al login
  if (!token || usuario?.rol !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Si se cumple la condición, renderiza los componentes hijos (contenido protegido)
  return children;
}

// Exporta el componente para proteger rutas administrativas en App.jsx o Routes.jsx
export default RutaProtegidaAdmin;
