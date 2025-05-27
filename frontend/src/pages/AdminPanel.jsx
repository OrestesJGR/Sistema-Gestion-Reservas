// Importa hooks de React y librerías externas
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Importa y configura componentes de Chart.js para mostrar gráficas
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registro de componentes de gráfica
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Componente principal del panel de administración
function AdminPanel() {
  // Estados para manejar datos del sistema y filtros
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
    totalServicios: 0,
    totalReservas: 0
  });
  const [datosGrafica, setDatosGrafica] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const reservasPorPagina = 3;

  const token = localStorage.getItem('token');

  // Carga todas las reservas del sistema (requiere token admin)
  const obtenerTodasLasReservas = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reservas/admin/todas-las-reservas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservas(res.data);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      setMensaje('❌ No tienes permiso para ver esta información.');
    }
  };

  // Carga las estadísticas generales del sistema (usuarios, servicios, reservas)
  const obtenerEstadisticas = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/estadisticas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEstadisticas(res.data);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
    }
  };

  // Obtiene los datos para la gráfica de reservas por servicio
  const obtenerDatosGrafica = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/reservas-por-servicio', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDatosGrafica(res.data);
    } catch (error) {
      console.error('Error al obtener datos de la gráfica:', error);
    }
  };

  // Carga inicial del componente: obtiene reservas, estadísticas y gráfica
  useEffect(() => {
    obtenerTodasLasReservas();
    obtenerEstadisticas();
    obtenerDatosGrafica();
  }, []);

  // Reinicia paginación cuando se aplica un filtro
  useEffect(() => {
    setPaginaActual(1);
  }, [filtro, fechaFiltro]);

  // Elimina una reserva con confirmación
  const eliminarReserva = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la reserva permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/reservas/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservas(prev => prev.filter(r => r._id !== id));
        Swal.fire('Eliminada', 'La reserva ha sido eliminada.', 'success');
      } catch (error) {
        console.error('Error al eliminar reserva:', error);
        Swal.fire('Error', 'No se pudo eliminar la reserva.', 'error');
      }
    }
  };

  // Exporta reservas filtradas a un archivo CSV
  const exportarCSV = () => {
    if (reservasFiltradas.length === 0) {
      Swal.fire('Sin datos', 'No hay reservas para exportar.', 'info');
      return;
    }

    const encabezados = ['Nombre', 'Email', 'Servicio', 'Fecha'];
    const filas = reservasFiltradas.map((r) => [
      r.usuario?.nombre || '',
      r.usuario?.email || '',
      r.servicio?.nombre || '',
      new Date(r.fecha).toLocaleString()
    ]);

    const contenido = [encabezados, ...filas]
      .map((fila) => fila.map(valor => `"${valor}"`).join(','))
      .join('\n');

    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reservas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Restablece los filtros aplicados
  const resetearFiltros = () => {
    setFiltro('');
    setFechaFiltro('');
  };

  // Aplica filtros de búsqueda por texto y fecha
  const reservasFiltradas = reservas.filter((reserva) => {
    const termino = filtro.toLowerCase();
    const coincideTexto =
      reserva.usuario?.nombre?.toLowerCase().includes(termino) ||
      reserva.usuario?.email?.toLowerCase().includes(termino) ||
      reserva.servicio?.nombre?.toLowerCase().includes(termino);

    const fechaReserva = new Date(reserva.fecha);
    const offset = fechaReserva.getTimezoneOffset();
    const fechaLocal = new Date(fechaReserva.getTime() - offset * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const coincideFecha = fechaFiltro ? fechaLocal === fechaFiltro : true;

    return coincideTexto && coincideFecha;
  });

  // Paginación de los resultados
  const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);
  const indiceInicio = (paginaActual - 1) * reservasPorPagina;
  const reservasPaginadas = reservasFiltradas.slice(indiceInicio, indiceInicio + reservasPorPagina);

  // Render del componente
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Panel de Administrador</h2>

      {/* Tarjetas de estadísticas generales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto mb-6">
        <div className="bg-white shadow p-4 rounded text-center">
          <h3 className="text-sm text-gray-500">Usuarios</h3>
          <p className="text-2xl font-bold text-blue-600">{estadisticas.totalUsuarios}</p>
        </div>
        <div className="bg-white shadow p-4 rounded text-center">
          <h3 className="text-sm text-gray-500">Servicios</h3>
          <p className="text-2xl font-bold text-green-600">{estadisticas.totalServicios}</p>
        </div>
        <div className="bg-white shadow p-4 rounded text-center">
          <h3 className="text-sm text-gray-500">Reservas</h3>
          <p className="text-2xl font-bold text-purple-600">{estadisticas.totalReservas}</p>
        </div>
      </div>

      {/* Filtros y acciones */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row justify-between gap-4">
        <input
          type="text"
          placeholder="Buscar por usuario, email o servicio"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full md:w-2/5 border px-4 py-2 rounded shadow"
        />
        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
          className="w-full md:w-1/4 border px-4 py-2 rounded shadow"
        />
        <button
          onClick={resetearFiltros}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Restablecer filtros
        </button>
        <button
          onClick={exportarCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Exportar CSV
        </button>
      </div>

      {/* Mensajes de error o sin resultados */}
      {mensaje && <p className="text-center text-red-600 font-semibold mb-4">{mensaje}</p>}
      {reservasFiltradas.length === 0 ? (
        <p className="text-center text-gray-600">No se encontraron reservas.</p>
      ) : (
        // Tabla de reservas con paginación
        <div className="max-w-5xl mx-auto overflow-x-auto mb-6">
          <table className="w-full bg-white shadow rounded text-center">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2">Usuario</th>
                <th className="p-2">Email</th>
                <th className="p-2">Servicio</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasPaginadas.map((reserva) => (
                <tr key={reserva._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{reserva.usuario?.nombre || 'Sin nombre'}</td>
                  <td className="p-2">{reserva.usuario?.email || 'Sin correo'}</td>
                  <td className="p-2">{reserva.servicio?.nombre || 'Sin servicio'}</td>
                  <td className="p-2">{new Date(reserva.fecha).toLocaleString()}</td>
                  <td className="p-2">
                    <button
                      onClick={() => eliminarReserva(reserva._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
            className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400 disabled:opacity-50"
          >
            ⬅ Anterior
          </button>
          <span className="text-sm font-medium">Página {paginaActual} de {totalPaginas}</span>
          <button
            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={paginaActual === totalPaginas}
            className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Siguiente ➡
          </button>
        </div>
      )}

      {/* Gráfico de barras */}
      {datosGrafica.length > 0 && (
        <div className="max-w-5xl mx-auto bg-white p-4 rounded shadow mt-10">
          <h3 className="text-lg font-semibold text-center mb-4 text-blue-700">Reservas por servicio</h3>
          <Bar
            data={{
              labels: datosGrafica.map((d) => d.servicio),
              datasets: [
                {
                  label: 'Total de reservas',
                  data: datosGrafica.map((d) => d.total),
                  backgroundColor: 'rgba(59, 130, 246, 0.6)'
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 }
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

// Exporta el componente para uso en rutas de administración
export default AdminPanel;
