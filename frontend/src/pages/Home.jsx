import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function Home() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const bienvenida = localStorage.getItem('bienvenida');
    const datos = localStorage.getItem('usuario');

    if (datos) {
      const u = JSON.parse(datos);
      setUsuario(u);

      if (bienvenida) {
        Swal.fire({
          icon: 'success',
          title: `¡Hola, ${u.nombre}!`,
          text: 'Has iniciado sesión correctamente.',
          timer: 2500,
          showConfirmButton: false
        });
        localStorage.removeItem('bienvenida');
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          {usuario ? `Bienvenido, ${usuario.nombre} 👋` : 'Bienvenido a la app de reservas'}
        </h1>
        <p className="text-gray-600">
          {usuario ? 'Elige un servicio del menú superior para reservar tu cita.' : 'Por favor inicia sesión para comenzar.'}
        </p>
      </div>
    </div>
  );
}

export default Home;
