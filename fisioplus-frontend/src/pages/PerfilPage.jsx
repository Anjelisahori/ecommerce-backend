import { useEffect, useState } from 'react';
import axios from '../api/axios';

const PerfilPage = () => {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("📦 Token desde localStorage:", token); // Debug

    if (!token) {
      setError("No hay token disponible. Inicia sesión primero.");
      return;
    }

    axios.get('/auth/perfil')
      .then(res => {
        console.log("✅ Perfil recibido:", res.data);
        setPerfil(res.data);
      })
      .catch(err => {
        console.error("❌ Error al obtener perfil:", err);
        setError("No se pudo cargar el perfil. Asegúrate de haber iniciado sesión.");
      });
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!perfil) return <p>Cargando perfil...</p>;

  return (
    <div>
      <h2>Mi Perfil</h2>
      <p><strong>Usuario:</strong> {perfil.username}</p>
      <p><strong>Nombre:</strong> {perfil.firstName} {perfil.lastName}</p>
      <p><strong>Email:</strong> {perfil.email}</p>
      <p><strong>Fecha de registro:</strong> {new Date(perfil.dateJoined).toLocaleDateString()}</p>
    </div>
  );
};

export default PerfilPage;
