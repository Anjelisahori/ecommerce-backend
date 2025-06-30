// src/pages/ProgresoPage.jsx
import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

import '../css/ProgresoPage.css';
import '../css/HomePage.css';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from 'recharts';

const ProgresoPage = () => {
  const { user } = useContext(AuthContext);

  const [estadoFisico, setEstadoFisico] = useState('');
  const [estadoEmocional, setEstadoEmocional] = useState('');
  const [actividadFisica, setActividadFisica] = useState('');
  const [avance, setAvance] = useState(0);

  const [progresos, setProgresos] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    axios.get(`/progreso/paciente/${user.id}`)
      .then(res => {
        const sorted = res.data.sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
        setProgresos(sorted);
      })
      .catch(err => console.error('Error cargando progresos:', err));
  }, [user]);

  const calcularAvance = (fisico, emocional, actividad) => {
    let base = 100;

    if (fisico.includes('dolor leve')) base -= 15;
    if (fisico.includes('dolor moderado')) base -= 30;
    if (fisico.includes('dolor fuerte')) base -= 50;

    if (emocional.includes('ansioso')) base -= 15;
    if (emocional.includes('irritado')) base -= 25;

    if (actividad.includes('sedentario')) base -= 40;
    if (actividad.includes('activa')) base -= 10;

    if (base < 0) base = 0;
    if (base > 100) base = 100;

    return base;
  };

  const handleSubmit = async () => {
    if (!estadoFisico || !estadoEmocional || !actividadFisica) {
      alert('Por favor selecciona todas las opciones.');
      return;
    }
    const avanceCalculado = calcularAvance(estadoFisico.toLowerCase(), estadoEmocional.toLowerCase(), actividadFisica.toLowerCase());

    const descripcion = `Estado físico: ${estadoFisico}, Estado emocional: ${estadoEmocional}, Actividad física: ${actividadFisica}`;

    const data = {
      pacienteId: user.id,
      fecha: new Date().toISOString().slice(0, 10),
      descripcion,
      avancePorcentaje: avanceCalculado,
    };

    try {
      await axios.post('/progreso', data);
      alert('Progreso registrado con éxito');
      setEstadoFisico('');
      setEstadoEmocional('');
      setActividadFisica('');
      setAvance(0);

      setProgresos(prev => [...prev, data]);
    } catch (error) {
      console.error('Error al registrar el progreso:', error);
      alert('Ocurrió un error al registrar el progreso.');
    }
  };

  const formatearFecha = (fecha) => {
    const d = new Date(fecha);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  const dataChart = progresos.map(p => ({
    fecha: formatearFecha(p.fecha),
    avance: p.avancePorcentaje,
    isAnomalous: p.avancePorcentaje <= 40,
  }));

  const renderCustomizedLabel = (props) => {
    const { x, y, index } = props;
    if (dataChart[index].isAnomalous) {
      return (
        <text x={x} y={y - 10} fill="red" fontSize={12} fontWeight="bold" textAnchor="middle">
          ANÓMALO
        </text>
      );
    }
    return null;
  };

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
            <button className="logout-button" onClick={() => localStorage.clear()}>Cerrar sesión</button>
          </nav>
        </header>

        <main className="progreso-container">
          <h2>Mi Progreso</h2>

          <section className="formulario-progreso">
            <div className="opciones">
              <h4>Estado Físico</h4>
              {['😌 Sin dolor', '🙂 Dolor leve', '😣 Dolor moderado', '😖 Dolor fuerte'].map(op => (
                <button
                  key={op}
                  className={estadoFisico === op ? 'opcion activa' : 'opcion'}
                  onClick={() => setEstadoFisico(op)}
                >{op}</button>
              ))}
            </div>

            <div className="opciones">
              <h4>Estado Emocional</h4>
              {['😎 Tranquilo/a', '😰 Ansioso/a', '💪 Motivado/a', '😡 Irritado/a'].map(op => (
                <button
                  key={op}
                  className={estadoEmocional === op ? 'opcion activa' : 'opcion'}
                  onClick={() => setEstadoEmocional(op)}
                >{op}</button>
              ))}
            </div>

            <div className="opciones">
              <h4>Actividad Física</h4>
              {['🛋️ Sedentario/a', '🏃 Activa/o', '✅ Ejercicios completados'].map(op => (
                <button
                  key={op}
                  className={actividadFisica === op ? 'opcion activa' : 'opcion'}
                  onClick={() => setActividadFisica(op)}
                >{op}</button>
              ))}
            </div>
            
            <button onClick={handleSubmit} className="submit-progreso">
              Registrar Progreso
            </button>
          </section>

          <section className="lista-progresos">
            <h3>Historial</h3>
            {progresos.length === 0 ? (
              <p>No hay progresos registrados.</p>
            ) : (
              <>
                {progresos.map(p => (
                  <div key={p.fecha + p.avancePorcentaje} className="progreso-item">
                    <p><strong>{p.fecha}</strong></p>
                    <p>{p.descripcion}</p>
                    <div className="barra-externa">
                      <div
                        className="barra-interna"
                        style={{ width: `${p.avancePorcentaje}%` }}
                      >
                        {p.avancePorcentaje}%
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{ height: 300, marginTop: 40 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataChart} margin={{ top: 30, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="avance"
                        stroke="#00bfa5"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        label={renderCustomizedLabel}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </section>
        </main>

        <footer className="homepage-footer">
          &copy; {new Date().getFullYear()} FisioPlus. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default ProgresoPage;
