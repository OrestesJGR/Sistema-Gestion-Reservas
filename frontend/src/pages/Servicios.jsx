import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [fechasReserva, setFechasReserva] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    const obtenerServicios = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/servicios');
        setServicios(res.data);
      } catch (error) {
        console.error('Error al obtener servicios:', error);
      }
    };

    obtenerServicios();
  }, []);

  const manejarCambioFecha = (id, valor) => {
    setFechasReserva({ ...fechasReserva, [id]: valor });
  };

  const obtenerFechaMinima = () => {
    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5); // Redondear a múltiplo de 5
    now.setSeconds(0);
    now.setMilliseconds(0);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Corregir zona horaria
    return now.toISOString().slice(0, 16);
  };
  

  const reservarServicio = async (idServicio) => {
    const fechaSeleccionada = fechasReserva[idServicio];

    if (!fechaSeleccionada) {
      Swal.fire({
        icon: 'warning',
        title: 'Fecha requerida',
        text: 'Debes seleccionar una fecha y hora para reservar.',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    const fechaActual = new Date();
    const fechaIngresada = new Date(fechaSeleccionada);

    if (fechaIngresada < fechaActual) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha inválida',
        text: 'No puedes reservar en una fecha pasada.',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/reservas',
        {
          servicio: idServicio,
          fecha: fechaSeleccionada
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Reserva realizada',
        text: 'Tu reserva se ha registrado con éxito.',
        showConfirmButton: false,
        timer: 3000
      });

      // Opcional: Redirigir tras la reserva
      setTimeout(() => {
        window.location.href = '/mis-reservas';
      }, 3000);

    } catch (error) {
      console.error('Error al reservar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al reservar',
        text: 'No se pudo completar la reserva.',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Servicios disponibles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {servicios.map((servicio) => (
          <div
            key={servicio._id}
            className="bg-white p-4 rounded shadow hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{servicio.nombre}</h3>
              <p className="text-gray-700 mb-4">{servicio.descripcion}</p>
            </div>

            {token ? (
              <>
                <input
                  type="datetime-local"
                  step="300"
                  className="mb-3 w-full border rounded px-3 py-2 text-sm"
                  value={fechasReserva[servicio._id] || ''}
                  onChange={(e) => manejarCambioFecha(servicio._id, e.target.value)}
                  min={obtenerFechaMinima()}
                />
                <button
                  onClick={() => reservarServicio(servicio._id)}
                  className="mt-auto bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  Reservar
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center mt-4">Inicia sesión para reservar</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Servicios;
