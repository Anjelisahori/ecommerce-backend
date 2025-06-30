import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import '../css/HomePage.css';

const HomePage = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <div className="homepage-container">
      <div className="page-wrapper">

        {/* ✅ Encabezado corregido */}
        <header className="homepage-header">
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="Logo" />
            <h1>FisioPlus</h1>
          </Link>
          <nav className="homepage-nav">
            <Link to="/perfil">Perfil</Link>
            <Link to="/citas">Citas</Link>
            <Link to="/ejercicios">Ejercicios</Link>
            <Link to="/progreso">Progreso</Link>
            <button className="logout-button" onClick={logout}>Cerrar sesión</button>
          </nav>
        </header>

        {/* Contenido principal */}
        <main className="homepage-main">
          <section className="welcome-section">
            <div className="welcome-image">
              <img
                className="hero-image"
                src="/images/hero-health.png"
                alt="Salud y bienestar"
              />
            </div>
            <div className="welcome-text">
              <h2>Bienvenido, <span>{auth?.user?.firstName || 'Usuario'}</span></h2>
              <p>Tu portal de salud y bienestar personalizado</p>
            </div>
          </section>

          {/* Accesos rápidos */}
          <section className="quick-access">
            <div className="access-card">
              <img src="/images/perfil-icon.png" alt="Perfil" />
              <Link to="/perfil">Ver Perfil</Link>
            </div>
            <div className="access-card">
              <img src="/images/cita-icon.png" alt="Citas" />
              <Link to="/citas">Gestionar Citas</Link>
            </div>
            <div className="access-card">
              <img src="/images/ejercicio-icon.png" alt="Ejercicios" />
              <Link to="/ejercicios">Mis Ejercicios</Link>
            </div>
            <div className="access-card">
              <img src="/images/progreso-icon.png" alt="Progreso" />
              <Link to="/progreso">Progreso</Link>
            </div>
          </section>
        </main>

        {/* Pie de página */}
        <footer className="homepage-footer">
          &copy; {new Date().getFullYear()} FisioPlus. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
