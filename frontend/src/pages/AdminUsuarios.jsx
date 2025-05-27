// Importamos hooks y librerías necesarias
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AdminUsuarios() {
  // Estado con todos los usuarios del sistema
  const [usuarios, setUsuarios] = useState([]);

  // Término de búsqueda para el filtro
  const [busqueda, setBusqueda] = useState('');

  // Página actual para la paginación
  const [paginaActual, setPaginaActual] = useState(1);

  // Número de usuarios que se muestran por página
  const usuariosPorPagina = 3;

  // Token de autenticación
  const token = localStorage.getItem('token');

  // Obtener todos los usuarios desde la API
  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsuarios(res.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  // Llamada inicial para cargar los usuarios cuando se monta el componente
  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Cambia el rol de un usuario específico
  const cambiarRol = async (id, nuevoRol) => {
    try {
      await axios.put(
        `http://localhost:5000/api/usuarios/${id}/rol`,
        { rol: nuevoRol },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Actualiza el usuario modificado en la lista
      setUsuarios(usuarios.map(u => (u._id === id ? { ...u, rol: nuevoRol } : u)));

      Swal.fire({
        icon: 'success',
        title: 'Rol actualizado',
        text: 'El rol del usuario se ha modificado.',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Error al cambiar el rol:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar el rol del usuario.',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  // Elimina un usuario tras confirmación
  const eliminarUsuario = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar usuario?',
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
      await axios.delete(`http://localhost:5000/api/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Elimina el usuario de la lista local
      setUsuarios(usuarios.filter(u => u._id !== id));

      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El usuario ha sido eliminado.',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el usuario.',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  // Filtro de búsqueda que incluye nombre, email y rol
  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nombre} ${u.email} ${u.rol}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cálculo de paginación
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const indiceInicio = (paginaActual - 1) * usuariosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceInicio + usuariosPorPagina);

  // Cambia la página si es válida
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Título principal */}
      <h2 className="text-2xl font-bold text-center mb-6">Gestión de Usuarios</h2>

      {/* Barra de búsqueda */}
      <div className="max-w-5xl mx-auto mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, email o rol"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1); // reinicia a página 1 al buscar
          }}
          className="w-full px-4 py-2 border rounded shadow"
        />
      </div>

      {/* Tabla de usuarios */}
      {usuariosPaginados.length === 0 ? (
        <p className="text-center text-gray-600">No se encontraron usuarios.</p>
      ) : (
        <div className="overflow-x-auto max-w-5xl mx-auto">
          <table className="w-full bg-white shadow rounded text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-center">Rol</th>
                <th className="p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.map((usuario) => (
                <tr key={usuario._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{usuario.nombre}</td>
                  <td className="p-2">{usuario.email}</td>
                  <td className="p-2 text-center">
                    {/* Menú desplegable para cambiar el rol del usuario */}
                    <select
                      value={usuario.rol}
                      onChange={(e) => cambiarRol(usuario._id, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="usuario">usuario</option>
                      <option value="moderador">moderador</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="p-2 text-center">
                    {/* Botón de eliminación */}
                    <button
                      onClick={() => eliminarUsuario(usuario._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Controles de paginación */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Anterior
            </button>
            <span>Página {paginaActual} de {totalPaginas}</span>
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsuarios;
