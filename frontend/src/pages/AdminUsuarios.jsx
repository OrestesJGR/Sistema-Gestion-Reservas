import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const token = localStorage.getItem('token');

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

  useEffect(() => {
    obtenerUsuarios();
  }, []);

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

      setUsuarios(usuarios.map(u => (u._id === id ? { ...u, rol: nuevoRol } : u)));

      Swal.fire({
        icon: 'success',
        title: 'Rol actualizado',
        text: 'El rol del usuario ha sido modificado.',
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Gestión de Usuarios</h2>

      {usuarios.length === 0 ? (
        <p className="text-center text-gray-600">No hay usuarios registrados.</p>
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
              {usuarios.map((usuario) => (
                <tr key={usuario._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{usuario.nombre}</td>
                  <td className="p-2">{usuario.email}</td>
                  <td className="p-2 text-center">
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
        </div>
      )}
    </div>
  );
}

export default AdminUsuarios;
