// src/components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuth(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">FisioPlus</Link>
      </div>
      <div className="space-x-4">
        {auth ? (
          <>
            <Link to="/perfil">Perfil</Link>
            <Link to="/citas">Citas</Link>
            <Link to="/ejercicios">Ejercicios</Link>
            <Link to="/progreso">Progreso</Link>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
