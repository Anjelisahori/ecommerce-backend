import { useState, useContext } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import '../css/LoginPage.css';
import { AuthContext } from '../auth/AuthContext';

import { auth, provider, signInWithPopup } from '../firebase'; // Importa Firebase

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({
    usernameOrEmail: '',
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
      const res = await axios.post('/auth/login', form);
      login({ ...res.data, token: res.data.token }); // Asegúrate que tu backend retorna "token"
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Credenciales inválidas");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const googleData = {
        email: user.email,
        username: user.displayName.replace(/\s/g, '').toLowerCase(),
        firstName: user.displayName.split(' ')[0],
        lastName: user.displayName.split(' ').slice(1).join(' ') || 'GoogleUser',
        password: user.uid // dummy password
      };

      const res = await axios.post('/auth/google', googleData);
      login({ ...res.data, token: res.data.token });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      console.error('Error con Google Login:', err);
      setError('Error al iniciar sesión con Google');
    }
  };

  return (
    <div className="login-container">
      <div className="form-section">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Iniciar sesión</h2>
          <input 
            type="text" 
            name="usernameOrEmail" 
            placeholder="Usuario o Email" 
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
          <button type="submit">Entrar</button>

          <button type="button" onClick={handleGoogleLogin} className="google-button">
            Iniciar sesión con Google
          </button>

          {error && <p className="error">{error}</p>}
          <p className="register-link">
            ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </form>
      </div>
      <div className="image-section">
        <img src="/images/login-image.png" alt="Login illustration" />
      </div>
    </div>
  );
};

export default LoginPage;
