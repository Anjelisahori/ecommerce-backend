import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CitasPage from './pages/CitasPage';
import EjerciciosPage from './pages/EjerciciosPage';
import ProgresoPage from './pages/ProgresoPage';
import PerfilPage from './pages/PerfilPage';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/citas" element={<PrivateRoute><CitasPage /></PrivateRoute>} />
          <Route path="/ejercicios" element={<PrivateRoute><EjerciciosPage /></PrivateRoute>} />
          <Route path="/progreso" element={<PrivateRoute><ProgresoPage /></PrivateRoute>} />
          <Route path="/perfil" element={<PrivateRoute><PerfilPage /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
