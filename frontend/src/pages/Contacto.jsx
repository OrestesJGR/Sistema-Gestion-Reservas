// Importación de hooks y librerías necesarias
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Contacto() {
  // Estado del formulario de contacto
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  // Actualiza el estado del formulario conforme se escriben los datos
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envía el formulario al backend
      await axios.post('http://localhost:5000/api/contacto', form);

      // Mensaje de éxito al usuario
      Swal.fire({
        icon: 'success',
        title: 'Mensaje enviado',
        text: 'Gracias por tu mensaje. Te responderemos lo antes posible.',
        timer: 3000,
        showConfirmButton: false
      });

      // Limpieza del formulario
      setForm({ nombre: '', email: '', mensaje: '' });

    } catch (error) {
      // En caso de error en el envío
      console.error('Error al enviar mensaje:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar tu mensaje. Intenta de nuevo.'
      });
    }
  };

  return (
    // Contenedor centrado
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Formulario de contacto */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg space-y-4 animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-blue-600">Contacto</h2>

        {/* Campo nombre */}
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
          required
          className="w-full border px-4 py-2 rounded"
        />

        {/* Campo email */}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Tu correo electrónico"
          required
          className="w-full border px-4 py-2 rounded"
        />

        {/* Campo mensaje */}
        <textarea
          name="mensaje"
          value={form.mensaje}
          onChange={handleChange}
          placeholder="Tu mensaje"
          required
          rows="5"
          className="w-full border px-4 py-2 rounded resize-none"
        />

        {/* Botón de envío */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Enviar mensaje
        </button>
      </form>
    </div>
  );
}

export default Contacto;
