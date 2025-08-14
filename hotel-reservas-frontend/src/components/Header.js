// src/components/Header.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Función para verificar si una ruta está activa
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Toggle del menú móvil
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo y título */}
        <div className="header-brand">
          <Link to="/" className="brand-link">
            <div className="logo">🏨</div>
            <h1 className="brand-title">Hotel Reservas</h1>
          </Link>
        </div>

        {/* Botón hamburguesa para móvil */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navegación principal */}
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">🏠</span>
                Inicio
              </Link>
            </li>
            
            <li className="nav-item">
              <Link 
                to="/reservas" 
                className={`nav-link ${isActive('/reservas') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">📅</span>
                Reservas
              </Link>
            </li>
            
            <li className="nav-item">
              <Link 
                to="/clientes" 
                className={`nav-link ${isActive('/clientes') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">👥</span>
                Clientes
              </Link>
            </li>
            
            <li className="nav-item">
              <Link 
                to="/habitaciones" 
                className={`nav-link ${isActive('/habitaciones') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">🛏️</span>
                Habitaciones
              </Link>
            </li>
            
            <li className="nav-item">
              <Link 
                to="/reportes" 
                className={`nav-link ${isActive('/reportes') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">📊</span>
                Reportes
              </Link>
            </li>

            <li className="nav-item">
              <Link 
                to="/usuarios" 
                className={`nav-link ${isActive('/usuarios') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">👥</span>
                Usuarios
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;