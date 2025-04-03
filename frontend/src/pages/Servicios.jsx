import { useEffect, useState } from 'react';
import axios from 'axios';

function Servicios() {
  const [servicios, setServicios] = useState([]);

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Servicios disponibles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {servicios.map((servicio) => (
          <div
            key={servicio._id}
            className="bg-white p-4 rounded shadow hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-2">{servicio.nombre}</h3>
            <p className="text-gray-700">{servicio.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Servicios;
