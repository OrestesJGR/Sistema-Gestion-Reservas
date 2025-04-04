import { useEffect, useState } from 'react';
import axios from 'axios';

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [mensaje, setMensaje] = useState('');
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

  // Función para obtener la fecha actual en formato "YYYY-MM-DDTHH:MM"
  const obtenerFechaMinima = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Corrige zona horaria
    return now.toISOString().slice(0, 16); // Recorta para que encaje con datetime-local
  };


  const reservarServicio = async (idServicio) => {
    const fechaSeleccionada = fechasReserva[idServicio];
  
    if (!fechaSeleccionada) {
      setMensaje('❌ Debes seleccionar una fecha y hora para reservar.');
      return;
    }
  
    const fechaActual = new Date();
    const fechaIngresada = new Date(fechaSeleccionada);
  
    if (fechaIngresada < fechaActual) {
      setMensaje('❌ No puedes reservar en una fecha pasada.');
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
  
      setMensaje('✅ Reserva realizada correctamente');
    } catch (error) {
      console.error('Error al reservar:', error);
      setMensaje('❌ No se pudo realizar la reserva');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Servicios disponibles</h2>
      {mensaje && <p className="text-center text-green-600 font-semibold mb-4">{mensaje}</p>}
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
