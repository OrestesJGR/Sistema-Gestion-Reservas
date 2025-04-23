import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AdminServicios() {
  const [servicios, setServicios] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', descripcion: '' });
  const [editando, setEditando] = useState(null); // Servicio en edición
  const [modalVisible, setModalVisible] = useState(false);
  const token = localStorage.getItem('token');

  const obtenerServicios = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/servicios');
      setServicios(res.data);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
    }
  };

  useEffect(() => {
    obtenerServicios();
  }, []);

  const abrirModalCrear = () => {
    setNuevo({ nombre: '', descripcion: '' });
    setEditando(null);
    setModalVisible(true);
  };

  const abrirModalEditar = (servicio) => {
    setNuevo({ nombre: servicio.nombre, descripcion: servicio.descripcion });
    setEditando(servicio);
    setModalVisible(true);
  };

  const guardarServicio = async (e) => {
    e.preventDefault();

    if (!nuevo.nombre.trim() || !nuevo.descripcion.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Debes completar todos los campos.',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    try {
      if (editando) {
        // Editar servicio existente
        const res = await axios.put(`http://localhost:5000/api/servicios/${editando._id}`, nuevo, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setServicios(servicios.map(s => s._id === editando._id ? res.data : s));
        Swal.fire({
          icon: 'success',
          title: 'Servicio actualizado',
          text: 'Los datos del servicio se han actualizado.',
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        // Crear nuevo servicio
        const res = await axios.post('http://localhost:5000/api/servicios', nuevo, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setServicios([...servicios, res.data]);
        Swal.fire({
          icon: 'success',
          title: 'Servicio creado',
          text: 'El nuevo servicio ha sido agregado.',
          showConfirmButton: false,
          timer: 3000
        });
      }

      setNuevo({ nombre: '', descripcion: '' });
      setModalVisible(false);
      setEditando(null);
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar el servicio.',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  const eliminarServicio = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar servicio?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/servicios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setServicios(servicios.filter(s => s._id !== id));

      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El servicio ha sido eliminado.',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el servicio.',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Servicios</h2>
        <button
          onClick={abrirModalCrear}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Crear servicio
        </button>
      </div>

      {/* Modal de creación/edición */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-center text-blue-600 mb-4">
              {editando ? 'Editar servicio' : 'Nuevo servicio'}
            </h3>
            <form onSubmit={guardarServicio} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                value={nuevo.nombre}
                onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <textarea
                placeholder="Descripción"
                value={nuevo.descripcion}
                onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                rows="3"
                required
              ></textarea>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editando ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Listado de servicios */}
      {servicios.length === 0 ? (
        <p className="text-center text-gray-600">No hay servicios registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio) => (
            <div key={servicio._id} className="bg-white p-4 rounded shadow flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-2">{servicio.nombre}</h3>
                <p className="text-sm text-gray-700">{servicio.descripcion}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => abrirModalEditar(servicio)}
                  className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarServicio(servicio._id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminServicios;
