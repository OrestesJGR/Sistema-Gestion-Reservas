import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  const evaluarFortalezaPassword = (password) => {
    let puntuacion = 0;
    if (password.length >= 8) puntuacion++;
    if (/[A-Z]/.test(password)) puntuacion++;
    if (/[a-z]/.test(password)) puntuacion++;
    if (/\d/.test(password)) puntuacion++;
    if (/[@$!%*?&]/.test(password)) puntuacion++;

    setPasswordStrength(puntuacion);

    if (puntuacion <= 2) {
      setPasswordFeedback('Débil');
    } else if (puntuacion === 3 || puntuacion === 4) {
      setPasswordFeedback('Media');
    } else {
      setPasswordFeedback('Fuerte');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/usuarios/register', {
        nombre,
        email,
        password
      });

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tu cuenta se ha creado correctamente.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        window.location.href = '/login';
      });

      setNombre('');
      setEmail('');
      setPassword('');
      setPasswordStrength(0);
      setPasswordFeedback('');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: error.response?.data?.mensaje || '¿Ya existe ese correo?',
        confirmButtonText: 'Intentar de nuevo',
        customClass: {
          confirmButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 pt-16 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Crear cuenta</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              evaluarFortalezaPassword(e.target.value);
            }}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />

          {/* Barra de seguridad de contraseña */}
          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className={`h-full rounded transition-all duration-300 ${
                passwordStrength <= 2
                  ? 'bg-red-500 w-1/4'
                  : passwordStrength === 3 || passwordStrength === 4
                  ? 'bg-yellow-400 w-3/4'
                  : 'bg-green-500 w-full'
              }`}
            ></div>
          </div>
          <p className="text-sm font-medium text-gray-600">
            Seguridad: {passwordFeedback}
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
