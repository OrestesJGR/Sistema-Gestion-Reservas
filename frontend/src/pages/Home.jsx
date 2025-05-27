// Importación de hooks y librerías necesarias
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function Home() {
  // Estado para almacenar los datos del usuario logueado
  const [usuario, setUsuario] = useState(null);

  // Hook que se ejecuta al cargar la vista
  useEffect(() => {
    // Verificamos si hay una bandera de "bienvenida" en localStorage
    const bienvenida = localStorage.getItem('bienvenida');

    // Obtenemos los datos del usuario guardados en localStorage
    const datos = localStorage.getItem('usuario');

    if (datos) {
      // Parseamos y guardamos el usuario en estado
      const u = JSON.parse(datos);
      setUsuario(u);

      // Si hay una bienvenida pendiente, se muestra con SweetAlert y se elimina la bandera
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
    // Contenedor principal centrado
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        {/* Título personalizado si hay usuario, o mensaje genérico si no */}
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          {usuario ? `Bienvenido, ${usuario.nombre} 👋` : 'Bienvenido a NoteBook!!'}
        </h1>

        {/* Descripción contextual */}
        <p className="text-gray-600">
          {usuario
            ? 'Elige un servicio del menú superior para reservar tu cita.'
            : 'Por favor inicia sesión para comenzar.'}
        </p>
      </div>
    </div>
  );
}

export default Home;
