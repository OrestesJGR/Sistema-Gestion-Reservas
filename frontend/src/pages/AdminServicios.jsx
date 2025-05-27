// Importación de hooks y librerías necesarias
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AdminServicios() {
  // Estado para la lista de servicios obtenidos del backend
  const [servicios, setServicios] = useState([]);

  // Estado para el formulario (crear o editar un servicio)
  const [nuevo, setNuevo] = useState({ nombre: '', descripcion: '' });

  // Estado que guarda el servicio que se está editando (null si se está creando uno nuevo)
  const [editando, setEditando] = useState(null);

  // Estado para mostrar u ocultar el modal de creación/edición
  const [modalVisible, setModalVisible] = useState(false);

  // Token de autenticación obtenido del almacenamiento local
  const token = localStorage.getItem('token');

  // Función para obtener los servicios desde la API
  const obtenerServicios = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/servicios');
      setServicios(res.data);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
    }
  };

  // Al montar el componente, se obtienen los servicios
  useEffect(() => {
    obtenerServicios();
  }, []);

  // Abre el modal para crear un nuevo servicio
  const abrirModalCrear = () => {
    setNuevo({ nombre: '', descripcion: '' });
    setEditando(null);
    setModalVisible(true);
  };

  // Abre el modal y precarga los datos del servicio a editar
  const abrirModalEditar = (servicio) => {
    setNuevo({ nombre: servicio.nombre, descripcion: servicio.descripcion });
    setEditando(servicio);
    setModalVisible(true);
  };

  // Guarda o actualiza un servicio según el contexto (crear o editar)
  const guardarServicio = async (e) => {
    e.preventDefault();

    // Validación básica de campos vacíos
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
        // Actualiza un servicio existente
        const res = await axios.put(`http://localhost:5000/api/servicios/${editando._id}`, nuevo, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Actualiza la lista local de servicios con la respuesta del backend
        setServicios(servicios.map(s => s._id === editando._id ? res.data : s));

        Swal.fire({
          icon: 'success',
          title: 'Servicio actualizado',
          text: 'Los datos del servicio se han actualizado.',
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        // Crea un nuevo servicio
        const res = await axios.post('http://localhost:5000/api/servicios', nuevo, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Añade el nuevo servicio a la lista local
        setServicios([...servicios, res.data]);

        Swal.fire({
          icon: 'success',
          title: 'Servicio creado',
          text: 'El nuevo servicio ha sido agregado.',
          showConfirmButton: false,
          timer: 3000
        });
      }

      // Limpieza y cierre del modal
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

  // Elimina un servicio con confirmación previa
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
        headers: { Authorization: `Bearer ${token}` }
      });

      // Elimina el servicio de la lista local
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
      {/* Encabezado y botón para crear nuevo servicio */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Servicios</h2>
        <button
          onClick={abrirModalCrear}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Crear servicio
        </button>
      </div>

      {/* Modal de creación o edición */}
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

      {/* Listado de servicios existentes */}
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
