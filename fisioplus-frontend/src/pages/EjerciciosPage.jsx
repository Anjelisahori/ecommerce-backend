import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

import '../css/EjerciciosPage.css';
import '../css/HomePage.css';

const EjerciciosPage = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [search, setSearch] = useState('');
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    setEjercicios([
      {
        id: 1,
        nombre: "Estiramiento de cuello",
        descripcion: "Gira la cabeza suavemente de un lado a otro.",
        repeticiones: "3 series de 10",
        videoUrl: "https://www.youtube.com/watch?v=w4H0N_h_G9U"
      },
      {
        id: 2,
        nombre: "Ejercicio lumbar",
        descripcion: "Acostado boca arriba, eleva la pelvis.",
        repeticiones: "4 series de 15",
        videoUrl: "https://www.youtube.com/watch?v=2L2lnxIcNmo"
      },
      {
        id: 3,
        nombre: "Flexiones de brazo",
        descripcion: "Apoya las manos en el suelo y baja el cuerpo.",
        repeticiones: "4 series de 12",
        videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4"
      },
      {
        id: 4,
        nombre: "Sentadillas",
        descripcion: "Flexiona las piernas manteniendo la espalda recta.",
        repeticiones: "3 series de 20",
        videoUrl: "https://www.youtube.com/watch?v=aclHkVaku9U"
      },
      {
        id: 5,
        nombre: "Plancha abdominal",
        descripcion: "Mantén el cuerpo recto apoyado en antebrazos y pies.",
        repeticiones: "3 series de 30 segundos",
        videoUrl: "https://www.youtube.com/watch?v=pSHjTRCQxIw"
      },
      {
        id: 6,
        nombre: "Puente de glúteos",
        descripcion: "Acostado boca arriba, levanta las caderas hacia el techo.",
        repeticiones: "4 series de 10",
        videoUrl: "https://www.youtube.com/watch?v=FOE4eoO4nOk"
      }
    ]);
  }, []);

  const ejerciciosFiltrados = ejercicios.filter(ej =>
    ej.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="homepage-container">
      <div className="page-wrapper">
        <header className="homepage-header">
          <div className="logo">
            <Link to="/" className="logo-link">
              <img src="/images/logo.png" alt="Logo" className="logo-img" />
              <span className="logo-text">FisioPlus</span>
            </Link>
          </div>
          <nav className="homepage-nav">
            <Link to="/perfil">Perfil</Link>
            <Link to="/citas">Citas</Link>
            <Link to="/ejercicios">Ejercicios</Link>
            <Link to="/progreso">Progreso</Link>
            <button className="logout-button" onClick={logout}>Cerrar sesión</button>
          </nav>
        </header>

        <main className="ejercicios-container">
          <h2>Ejercicios Recomendados</h2>

          <input
            type="text"
            placeholder="Buscar ejercicio..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />

          <div className="ejercicios-grid">
            {ejerciciosFiltrados.map(ej => (
              <div key={ej.id} className="ejercicio-card">
                <iframe
                  src={ej.videoUrl.replace("watch?v=", "embed/")}
                  title={ej.nombre}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="video-iframe"
                />
                <div className="ejercicio-info">
                  <h4>{ej.nombre}</h4>
                  <p>{ej.descripcion}</p>
                  <p><strong>Repeticiones:</strong> {ej.repeticiones}</p>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="homepage-footer">
          &copy; {new Date().getFullYear()} FisioPlus. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default EjerciciosPage;
