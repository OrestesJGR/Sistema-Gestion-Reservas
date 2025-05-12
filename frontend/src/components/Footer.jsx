import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Footer() {
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
        text: 'Gracias por contactarnos.',
        timer: 3000,
        showConfirmButton: false
      });

      setForm({ nombre: '', email: '', mensaje: '' });
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar tu mensaje.'
      });
    }
  };

  return (
    <footer className="bg-blue-900 text-white py-8 px-6 mt-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Sobre nosotros</h3>
          <p className="text-sm text-gray-300">
            Plataforma de gestión de reservas para servicios. Reservar nunca fue tan fácil.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Contacto</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="w-full px-3 py-2 rounded text-black"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Tu correo"
              className="w-full px-3 py-2 rounded text-black"
              required
            />
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              placeholder="Escribe tu mensaje"
              className="w-full px-3 py-2 rounded text-black resize-none"
              rows={3}
              required
            ></textarea>
            <button
              type="submit"
              className="bg-white text-blue-900 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>

      <div className="text-center mt-6 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Gestor de Reservas. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
