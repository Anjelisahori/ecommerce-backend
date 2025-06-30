import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import '../css/RegisterPage.css';
import { auth, provider, signInWithPopup } from '../firebase';

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/registro', form);
      navigate('/login');
    } catch (err) {
      setError('Error al registrarse. Verifica los datos.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const googleUser = {
        username: user.displayName.replace(/\s/g, '').toLowerCase(),
        email: user.email,
        firstName: user.displayName.split(' ')[0],
        lastName: user.displayName.split(' ')[1] || '',
        password: user.uid.substring(0, 8), // clave temporal solo para cumplir estructura
      };

      const response = await axios.post('/auth/google', googleUser);

      localStorage.setItem('token', response.data.accessToken);
      navigate('/');
    } catch (error) {
      console.error('Error con Google Sign-In:', error);
      setError('Error al registrarse con Google');
    }
  };

  return (
    <div className="register-container">
      <div className="form-section">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Registrarse</h2>

          <input
            type="text"
            name="username"
            placeholder="Usuario"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="firstName"
            placeholder="Nombres"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Apellidos"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />

          <button type="submit">Registrar</button>
          <button type="button" onClick={handleGoogleSignIn}>
            Registrarse con Google
          </button>

          {error && <p className="error-message">{error}</p>}

          <p className="login-link">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </form>
      </div>

      <div className="image-section">
        <img
          src="/images/register.png"
          alt="Registro"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
