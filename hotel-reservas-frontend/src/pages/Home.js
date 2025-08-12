// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reservasAPI, usuariosAPI, habitacionesAPI } from '../services/api';
import './Home.css';

function Home() {
  const [stats, setStats] = useState({
    totalReservas: 0,
    totalUsuarios: 0,
    totalHabitaciones: 0,
    habitacionesDisponibles: 0,
    reservasHoy: 0,
    ocupacion: 0
  });
  const [recentReservas, setRecentReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos básicos
      const [reservasRes, usuariosRes, habitacionesRes] = await Promise.all([
        reservasAPI.getAll(),
        usuariosAPI.getAll(),
        habitacionesAPI.getAll()
      ]);

      const reservas = reservasRes.data;
      const usuarios = usuariosRes.data;
      const habitaciones = habitacionesRes.data;

      // Calcular estadísticas
      const today = new Date().toISOString().split('T')[0];
      const reservasHoy = reservas.filter(r => r.fecha_checkin === today).length;
      
      // Habitaciones ocupadas (reservas activas)
      const reservasActivas = reservas.filter(r => {
        const checkin = new Date(r.fecha_checkin);
        const checkout = new Date(r.fecha_checkout);
        const hoy = new Date();
        return checkin <= hoy && checkout >= hoy;
      });

      const habitacionesOcupadas = reservasActivas.length;
      const habitacionesDisponibles = habitaciones.length - habitacionesOcupadas;
      const ocupacion = habitaciones.length > 0 ? 
        Math.round((habitacionesOcupadas / habitaciones.length) * 100) : 0;

      // Reservas recientes (últimas 5)
      const reservasOrdenadas = reservas
        .sort((a, b) => new Date(b.fecha_checkin) - new Date(a.fecha_checkin))
        .slice(0, 5);

      setStats({
        totalReservas: reservas.length,
        totalUsuarios: usuarios.length,
        totalHabitaciones: habitaciones.length,
        habitacionesDisponibles,
        reservasHoy,
        ocupacion
      });

      setRecentReservas(reservasOrdenadas);
      setError(null);
    } catch (err) {
      //setError('Error al cargar los datos del dashboard: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-dashboard">
          <div className="loading-spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Sistema de Reservas de Hoteles</h1>
          <p className="hero-subtitle">
            Gestiona reservas, usuarios y habitaciones de manera eficiente
          </p>
          <div className="hero-actions">
            <Link to="/reservas" className="btn-primary">
              Nueva Reserva
            </Link>
            <Link to="/usuarios" className="btn-secondary">
              Gestionar Usuarios
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hotel-illustration">🏨</div>
        </div>
      </section>

      {error
      }

      {/* Stats Dashboard */}
      <section className="stats-section">
        <h2 className="section-title">Panel de Control</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalReservas}</h3>
              <p className="stat-label">Total Reservas</p>
            </div>
            <Link to="/reservas" className="stat-link">Ver todas →</Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalUsuarios}</h3>
              <p className="stat-label">Usuarios Registrados</p>
            </div>
            <Link to="/usuarios" className="stat-link">Gestionar →</Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🛏️</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalHabitaciones}</h3>
              <p className="stat-label">Total Habitaciones</p>
            </div>
            <Link to="/habitaciones" className="stat-link">Ver todas →</Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.habitacionesDisponibles}</h3>
              <p className="stat-label">Habitaciones Disponibles</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.ocupacion}%</h3>
              <p className="stat-label">Ocupación Actual</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🕒</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.reservasHoy}</h3>
              <p className="stat-label">Check-ins Hoy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="activity-section">
        <div className="activity-header">
          <h2 className="section-title">Reservas Recientes</h2>
          <Link to="/reservas" className="view-all-link">Ver todas las reservas →</Link>
        </div>
        
        <div className="activity-content">
          {recentReservas.length === 0 ? (
            <div className="no-activity">
              <div className="no-activity-icon">📋</div>
              <p>No hay reservas recientes</p>
              <Link to="/reservas" className="btn-primary">Crear Primera Reserva</Link>
            </div>
          ) : (
            <div className="reservas-preview">
              {recentReservas.map(reserva => (
                <div key={reserva.id} className="reserva-card">
                  <div className="reserva-header">
                    <span className="reserva-id">Reserva #{reserva.id}</span>
                    <span className="reserva-date">{reserva.fecha_checkin}</span>
                  </div>
                  <div className="reserva-details">
                    <p><strong>Usuario ID:</strong> {reserva.usuario_id}</p>
                    <p><strong>Habitación ID:</strong> {reserva.habitacion_id}</p>
                    <p><strong>Huéspedes:</strong> {reserva.numero_huespedes}</p>
                  </div>
                  <div className="reserva-period">
                    {reserva.fecha_checkin} → {reserva.fecha_checkout}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <h2 className="section-title">Acciones Rápidas</h2>
        <div className="quick-actions-grid">
          <Link to="/reservas" className="action-card">
            <div className="action-icon">➕</div>
            <h3>Nueva Reserva</h3>
            <p>Crear una nueva reserva de habitación</p>
          </Link>
          
          <Link to="/usuarios" className="action-card">
            <div className="action-icon">👤</div>
            <h3>Nuevo Usuario</h3>
            <p>Registrar un nuevo cliente</p>
          </Link>
          
          <Link to="/habitaciones" className="action-card">
            <div className="action-icon">🏠</div>
            <h3>Gestionar Habitaciones</h3>
            <p>Ver y editar habitaciones disponibles</p>
          </Link>
          
          <Link to="/reportes" className="action-card">
            <div className="action-icon">📈</div>
            <h3>Reportes</h3>
            <p>Ver estadísticas y reportes detallados</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;