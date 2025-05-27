// Importación de hooks y librerías necesarias
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function MisReservas() {
  // Estado que almacena las reservas del usuario
  const [reservas, setReservas] = useState([]);

  // Estado para mostrar mensajes de error o advertencia
  const [mensaje, setMensaje] = useState('');

  // Token de autenticación guardado en localStorage
  const token = localStorage.getItem('token');

  // Función para obtener las reservas del usuario desde la API
  const obtenerReservas = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reservas/mis-reservas', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReservas(res.data);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      setMensaje('❌ No se pudieron cargar tus reservas.');
    }
  };

  // Al montar el componente, se consultan las reservas del usuario
  useEffect(() => {
    obtenerReservas();
  }, []);

  // Función para cancelar una reserva específica
  const cancelarReserva = async (idReserva) => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción cancelará tu reserva y no se podrá recuperar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    // Si el usuario cancela el diálogo, no se ejecuta la cancelación
    if (!confirmacion.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/reservas/${idReserva}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Actualiza la lista eliminando la reserva cancelada
      setReservas(reservas.filter((reserva) => reserva._id !== idReserva));

      Swal.fire({
        icon: 'success',
        title: 'Cancelada',
        text: 'Tu reserva ha sido cancelada con éxito.',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cancelar la reserva.',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Mis Reservas</h2>

      {/* Mostrar mensaje de error si existe */}
      {mensaje && <p className="text-center text-red-600 font-semibold mb-4">{mensaje}</p>}

      {/* Mostrar mensaje si no hay reservas */}
      {reservas.length === 0 ? (
        <p className="text-center text-gray-600">Aún no tienes reservas registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mapeo de cada reserva */}
          {reservas.map((reserva) => (
            <div key={reserva._id} className="bg-white shadow p-4 rounded flex flex-col justify-between">
              <div>
                {/* Nombre del servicio */}
                <h3 className="text-lg font-semibold text-blue-600 mb-2">{reserva.servicio.nombre}</h3>

                {/* Descripción del servicio */}
                <p className="text-sm text-gray-700">{reserva.servicio.descripcion}</p>

                {/* Fecha formateada */}
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleString()}
                </p>

                {/* Observaciones si existen */}
                {reserva.observaciones && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Notas:</strong> {reserva.observaciones}
                  </p>
                )}
              </div>

              {/* Botón para cancelar reserva */}
              <button
                onClick={() => cancelarReserva(reserva._id)}
                className="mt-4 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
              >
                Cancelar reserva
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisReservas;
