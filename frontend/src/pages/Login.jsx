// Importación de hooks y librerías necesarias
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Login() {
  // Estado para el campo de email
  const [email, setEmail] = useState('');

  // Estado para el campo de contraseña
  const [password, setPassword] = useState('');

  // Función que maneja el envío del formulario
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Solicitud POST a la API de login
      const res = await axios.post('http://localhost:5000/api/usuarios/login', {
        email,
        password
      });

      // Guardamos el token y datos del usuario en localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));

      // Mostramos alerta de bienvenida
      await Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Inicio de sesión correcto.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });

      // Redirigimos al usuario a la página principal
      window.location.href = '/';
    } catch (error) {
      // Manejamos error si las credenciales son incorrectas
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error de acceso',
        text: 'Credenciales incorrectas',
        confirmButtonText: 'Intentar de nuevo',
        customClass: {
          confirmButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
        }
      });
    }
  };

  return (
    // Contenedor centrado
    <div className="min-h-screen flex items-start justify-center bg-gray-100 pt-16 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {/* Título del formulario */}
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>

        {/* Formulario de login */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Campo email */}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />

          {/* Campo contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />

          {/* Botón de envío */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
