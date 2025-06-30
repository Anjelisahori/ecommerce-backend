import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../auth/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../css/CitasPage.css';
import '../css/HomePage.css';

const CitasPage = () => {
  const [citas, setCitas] = useState([]);
  const [nuevaCita, setNuevaCita] = useState({ motivo: '', fechaHora: '' });
  const { logout, user } = useContext(AuthContext);
  const [error, setError] = useState('');

  const fetchCitas = () => {
    if (!user?.id) return;
    axios.get(`/citas/paciente/${user.id}`)
      .then(res => setCitas(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCitas();
  }, [user]);

  const crearCita = (e) => {
    e.preventDefault();
    setError('');

    const fechaUtc = new Date(nuevaCita.fechaHora).toISOString();

    const citaPayload = {
      pacienteId: user?.id,
      fechaHora: fechaUtc,
      motivo: nuevaCita.motivo
    };

    axios.post('/citas', citaPayload)
      .then(() => {
        setNuevaCita({ motivo: '', fechaHora: '' });
        fetchCitas();
        toast.success('✅ ¡Cita reservada con éxito!\nNo faltes a tu cita 😊', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored"
        });
      })
      .catch(err => {
        console.error('Error al crear cita:', err.response?.data || err.message);
        if (err.response?.data?.fechaHora) {
          setError(`Error: ${err.response.data.fechaHora}`);
        } else {
          setError('Error al crear cita. Verifica los datos.');
        }
      });
  };

  return (
    <div className="homepage-container">
      <div className="page-wrapper">
        <ToastContainer />

        <header className="homepage-header">
          <div className="logo">
            <Link to="/" className="logo-link">
              <img src="/images/logo.png" alt="Logo" className="logo-img" />
              <span className="logo-text">FisioPlus</span>
            </Link>
          </div>
          <nav className="homepage-nav responsive-nav">
            <Link to="/perfil">Perfil</Link>
            <Link to="/citas">Citas</Link>
            <Link to="/ejercicios">Ejercicios</Link>
            <Link to="/progreso">Progreso</Link>
            <button className="logout-button" onClick={logout}>Cerrar sesión</button>
          </nav>
        </header>

        <main className="citas-container">
          <h2>Gestión de Citas</h2>

          <form className="cita-form" onSubmit={crearCita}>
            <input
              name="motivo"
              value={nuevaCita.motivo}
              onChange={e => setNuevaCita({ ...nuevaCita, motivo: e.target.value })}
              placeholder="Motivo de la cita"
              required
            />
            <input
              name="fechaHora"
              type="datetime-local"
              value={nuevaCita.fechaHora}
              onChange={e => setNuevaCita({ ...nuevaCita, fechaHora: e.target.value })}
              required
            />
            <button type="submit">Agendar Cita</button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <ul className="citas-list">
            {citas.map(cita => (
              <li key={cita.id} className="cita-item">
                <strong>{new Date(cita.fechaHora).toLocaleString()}</strong>
                <p>{cita.motivo} — <strong>{cita.estado}</strong></p>
              </li>
            ))}
          </ul>
        </main>

        <footer className="homepage-footer">
          &copy; {new Date().getFullYear()} FisioPlus. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default CitasPage;