import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Contacto() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/contacto', form);

      Swal.fire({
        icon: 'success',
        title: 'Mensaje enviado',
        text: 'Gracias por tu mensaje. Te responderemos lo antes posible.',
        timer: 3000,
        showConfirmButton: false
      });

      setForm({ nombre: '', email: '', mensaje: '' });
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar tu mensaje. Intenta de nuevo.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg space-y-4 animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-blue-600">Contacto</h2>

        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Tu correo electrónico"
          required
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          name="mensaje"
          value={form.mensaje}
          onChange={handleChange}
          placeholder="Tu mensaje"
          required
          rows="5"
          className="w-full border px-4 py-2 rounded resize-none"
        />

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
