import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Perfil() {
  // Usuario autenticado
  const [usuario, setUsuario] = useState(null);

  // Controla si se está editando el perfil
  const [editando, setEditando] = useState(false);

  // Estado del formulario de edición de perfil
  const [formData, setFormData] = useState({ nombre: '', email: '' });

  // Controla la visibilidad del formulario de contraseña
  const [mostrandoPassword, setMostrandoPassword] = useState(false);

  // Estado del formulario de cambio de contraseña
  const [passForm, setPassForm] = useState({ antigua: '', nueva: '' });

  const token = localStorage.getItem('token');

  // Carga el perfil del usuario desde la API al montar el componente
  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/usuarios/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Guardamos los datos obtenidos
        setUsuario(res.data.usuario);
        setFormData({
          nombre: res.data.usuario.nombre,
          email: res.data.usuario.email
        });
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      }
    };

    obtenerPerfil();
  }, []);

  // Maneja el cambio en los inputs del perfil
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Guarda los cambios del perfil
  const handleGuardar = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/usuarios/${usuario._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Feedback y actualización de estado
      Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        showConfirmButton: false,
        timer: 2000
      });

      setUsuario(res.data.usuarioActualizado);
      setEditando(false);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuarioActualizado));
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar tu perfil.'
      });
    }
  };

  // Cambia la contraseña del usuario
  const handleCambiarPassword = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/usuarios/${usuario._id}/password`,
        passForm,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada',
        timer: 2000,
        showConfirmButton: false
      });

      setMostrandoPassword(false);
      setPassForm({ antigua: '', nueva: '' });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.mensaje || 'No se pudo actualizar la contraseña.'
      });
    }
  };

  // Muestra un loader mientras se cargan los datos
  if (!usuario) {
    return <p className="text-center mt-10">Cargando perfil...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 transition-all duration-500 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Mi Perfil</h2>

        {/* Modo edición del perfil */}
        {editando ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setEditando(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        ) : (
          // Vista de solo lectura del perfil
          <div className="space-y-2 text-sm">
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Rol:</strong> {usuario.rol}</p>
            <p><strong>Creado el:</strong> {new Date(usuario.creadoEn).toLocaleString()}</p>

            <div className="text-right">
              <button
                onClick={() => setEditando(true)}
                className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Editar perfil
              </button>
              <button
                onClick={() => setMostrandoPassword(true)}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Cambiar contraseña
              </button>
            </div>
          </div>
        )}

        {/* Sección para cambiar la contraseña */}
        {mostrandoPassword && (
          <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-bold mb-2 text-red-600">Cambiar contraseña</h4>

            <input
              type="password"
              placeholder="Contraseña actual"
              value={passForm.antigua}
              onChange={(e) => setPassForm({ ...passForm, antigua: e.target.value })}
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={passForm.nueva}
              onChange={(e) => setPassForm({ ...passForm, nueva: e.target.value })}
              className="w-full mb-4 border px-3 py-2 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMostrandoPassword(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleCambiarPassword}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Guardar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Perfil;
