import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AdminPanel() {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [mensaje, setMensaje] = useState('');
  const token = localStorage.getItem('token');

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

  useEffect(() => {
    obtenerTodasLasReservas();
  }, []);

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

  const resetearFiltros = () => {
    setFiltro('');
    setFechaFiltro('');
  };

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Panel de Administrador</h2>

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

      {mensaje && <p className="text-center text-red-600 font-semibold mb-4">{mensaje}</p>}
      {reservasFiltradas.length === 0 ? (
        <p className="text-center text-gray-600">No se encontraron reservas.</p>
      ) : (
        <div className="max-w-5xl mx-auto overflow-x-auto">
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
              {reservasFiltradas.map((reserva) => (
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
    </div>
  );
}

export default AdminPanel;
