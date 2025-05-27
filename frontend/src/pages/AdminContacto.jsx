// Importa hooks y librerías necesarias
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Componente funcional para la gestión de mensajes desde el panel de administrador
function AdminContacto() {
  // Estado para almacenar los mensajes obtenidos
  const [mensajes, setMensajes] = useState([]);

  // Estado para alternar entre mensajes archivados y activos
  const [verArchivados, setVerArchivados] = useState(false);

  // Recupera el token del usuario autenticado
  const token = localStorage.getItem('token');

  // Función para obtener mensajes desde el backend según si están archivados o no
  const obtenerMensajes = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/contacto?archivados=${verArchivados}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensajes(res.data);
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los mensajes.'
      });
    }
  };

  // Función para archivar (ocultar) un mensaje
  const archivarMensaje = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Archivar mensaje?',
      text: 'El mensaje se ocultará del panel principal.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, archivar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/contacto/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Elimina el mensaje del estado actual sin recargar
      setMensajes((prev) => prev.filter((m) => m._id !== id));

      Swal.fire({
        icon: 'success',
        title: 'Archivado',
        text: 'El mensaje ha sido archivado.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al archivar mensaje:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo archivar el mensaje.'
      });
    }
  };

  // Función para restaurar un mensaje previamente archivado
  const restaurarMensaje = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/contacto/${id}/restaurar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Elimina el mensaje restaurado del estado local
      setMensajes((prev) => prev.filter((m) => m._id !== id));

      Swal.fire({
        icon: 'success',
        title: 'Restaurado',
        text: 'El mensaje ha sido restaurado con éxito.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al restaurar mensaje:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo restaurar el mensaje.'
      });
    }
  };

  // useEffect ejecuta la carga de mensajes al montar el componente o cambiar la vista (activos/archivados)
  useEffect(() => {
    obtenerMensajes();
  }, [verArchivados]);

  // Renderiza la interfaz de mensajes de contacto
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Mensajes de Contacto</h2>

      {/* Botón para alternar entre mensajes archivados y activos */}
      <div className="text-center mb-6">
        <button
          onClick={() => {
            setVerArchivados(!verArchivados);
            setMensajes([]); // Limpia la vista mientras se cargan nuevos datos
          }}
          className={`px-4 py-2 rounded font-medium shadow transition ${
            verArchivados
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {verArchivados ? 'Ver mensajes activos' : 'Ver archivados'}
        </button>
      </div>

      {/* Mensajes cargados o mensaje de vacío */}
      {mensajes.length === 0 ? (
        <p className="text-center text-gray-600">
          {verArchivados ? 'No hay mensajes archivados.' : 'No hay mensajes activos.'}
        </p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-4">
          {mensajes.map((msg) => (
            <div key={msg._id} className="bg-white shadow p-4 rounded relative">
              {/* Botón superior derecho: archivar o restaurar */}
              {verArchivados ? (
                <button
                  onClick={() => restaurarMensaje(msg._id)}
                  className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-md"
                  title="Restaurar mensaje"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16M20 4l-8 8-8-8" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => archivarMensaje(msg._id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-md"
                  title="Archivar mensaje"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6" />
                  </svg>
                </button>
              )}
              {/* Contenido del mensaje */}
              <p className="text-sm text-gray-500 mb-1">
                <strong>Fecha:</strong> {new Date(msg.creadoEn).toLocaleString()}
              </p>
              <p><strong>Nombre:</strong> {msg.nombre}</p>
              <p><strong>Email:</strong> {msg.email}</p>
              <p className="mt-2"><strong>Mensaje:</strong> {msg.mensaje}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Exporta el componente para uso en el panel de administración
export default AdminContacto;
