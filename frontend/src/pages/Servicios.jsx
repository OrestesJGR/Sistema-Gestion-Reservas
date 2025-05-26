import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [fechas, setFechas] = useState({});
  const [horarios, setHorarios] = useState({});
  const [horarioSeleccionado, setHorarioSeleccionado] = useState({});
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

  const manejarCambioFecha = async (idServicio, fecha) => {
    setFechas((prev) => ({ ...prev, [idServicio]: fecha }));
    setHorarioSeleccionado((prev) => ({ ...prev, [idServicio]: '' }));

    if (!fecha) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/reservas/horarios-disponibles`,
        {
          params: { fecha, servicio: idServicio },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setHorarios((prev) => ({ ...prev, [idServicio]: res.data }));
    } catch (error) {
      console.error('Error al obtener horarios disponibles:', error);
      setHorarios((prev) => ({ ...prev, [idServicio]: [] }));
    }
  };

  const reservarServicio = async (idServicio) => {
    const fecha = fechas[idServicio];
    const hora = horarioSeleccionado[idServicio];

    if (!fecha || !hora) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Selecciona una fecha y un horario disponible.',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    const fechaCompleta = new Date(hora);
    const ahora = new Date();

    if (fechaCompleta <= ahora) {
      Swal.fire({
        icon: 'error',
        title: 'Horario inválido',
        text: 'No puedes reservar una franja horaria pasada.',
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
          fecha: fechaCompleta
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
                  type="date"
                  className="mb-3 w-full border rounded px-3 py-2 text-sm"
                  value={fechas[servicio._id] || ''}
                  onChange={(e) => manejarCambioFecha(servicio._id, e.target.value)}
                />

                {horarios[servicio._id] && (
                  <select
                    className="mb-3 w-full border rounded px-3 py-2 text-sm"
                    value={horarioSeleccionado[servicio._id] || ''}
                    onChange={(e) =>
                      setHorarioSeleccionado((prev) => ({
                        ...prev,
                        [servicio._id]: e.target.value
                      }))
                    }
                  >
                    <option value="">Selecciona una hora</option>
                    {horarios[servicio._id].map((h) => {
                      const horaLocal = new Date(h).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                      return (
                        <option key={h} value={h}>
                          {horaLocal}
                        </option>
                      );
                    })}
                  </select>
                )}

                <button
                  onClick={() => reservarServicio(servicio._id)}
                  className="mt-auto bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  Reservar
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center mt-4">
                Inicia sesión para reservar
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Servicios;
