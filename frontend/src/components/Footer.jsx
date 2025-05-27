// Importa useState para manejar el estado local del formulario
import { useState } from 'react';

// Importa Axios para hacer peticiones HTTP
import axios from 'axios';

// Importa SweetAlert2 para mostrar mensajes emergentes con estilo
import Swal from 'sweetalert2';

// Componente funcional Footer que incluye información de la aplicación y un formulario de contacto
function Footer() {
  // Estado local que guarda los datos del formulario de contacto
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  // Manejador del cambio en los inputs: actualiza el estado según el campo modificado
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    try {
      // Envía el contenido del formulario a la API de contacto
      await axios.post('http://localhost:5000/api/contacto', form);

      // Muestra una notificación de éxito al usuario
      Swal.fire({
        icon: 'success',
        title: 'Mensaje enviado',
        text: 'Gracias por contactarnos.',
        timer: 3000,
        showConfirmButton: false
      });

      // Limpia el formulario tras el envío
      setForm({ nombre: '', email: '', mensaje: '' });
    } catch (error) {
      // Manejo de errores si la petición falla
      console.error('Error al enviar mensaje:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar tu mensaje.'
      });
    }
  };

  // Renderizado del componente Footer
  return (
    <footer className="bg-blue-900 text-white py-8 px-6 mt-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Sección de información general */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Sobre nosotros</h3>
          <p className="text-sm text-gray-300">
            Plataforma de gestión de reservas para servicios. Reservar nunca fue tan fácil.
          </p>
        </div>

        {/* Formulario de contacto */}
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

      {/* Pie de página final con derechos reservados */}
      <div className="text-center mt-6 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} NoteBook. Todos los derechos reservados.
      </div>
    </footer>
  );
}

// Exporta el componente Footer para usarlo en otras partes de la aplicación
export default Footer;
