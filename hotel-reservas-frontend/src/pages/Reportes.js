// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import reportesService from '../services/reportesService';
import './Reportes.css'; // Importar el archivo CSS

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      const data = await reportesService.obtenerDashboard();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(monto || 0);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-EC');
  };

  const obtenerColorMovimiento = (tipo) => {
    return tipo === 'Ingreso' ? 'ingreso' : 'egreso';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          {error}
          <button 
            onClick={cargarDashboard}
            className="retry-button"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { resumen_financiero, estadisticas_ocupacion, ultimos_movimientos, periodo } = dashboardData;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard - Reportes</h1>
          <p className="dashboard-subtitle">{periodo}</p>
        </div>
        <button
          onClick={cargarDashboard}
          className="refresh-button"
        >
          🔄 Actualizar
        </button>
      </div>

      {/* KPIs Financieros */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-content">
            <div className="kpi-icon green">
              💰
            </div>
            <div>
              <p className="kpi-label">Ingresos Totales</p>
              <p className="kpi-value green">
                {formatearMonto(resumen_financiero?.total_ingresos)}
              </p>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-content">
            <div className="kpi-icon red">
              📉
            </div>
            <div>
              <p className="kpi-label">Egresos Totales</p>
              <p className="kpi-value red">
                {formatearMonto(resumen_financiero?.total_egresos)}
              </p>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-content">
            <div className="kpi-icon blue">
              💼
            </div>
            <div>
              <p className="kpi-label">Saldo Neto</p>
              <p className={`kpi-value ${
                (resumen_financiero?.saldo || 0) >= 0 ? 'green' : 'red'
              }`}>
                {formatearMonto(resumen_financiero?.saldo)}
              </p>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-content">
            <div className="kpi-icon purple">
              🏨
            </div>
            <div>
              <p className="kpi-label">Ocupación</p>
              <p className="kpi-value purple">
                {estadisticas_ocupacion?.porcentaje_ocupacion?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas de Ocupación y Resumen Financiero */}
      <div className="stats-grid">
        <div className="stats-card">
          <h3 className="stats-title">📊 Estadísticas de Ocupación</h3>
          <div>
            <div className="stat-row">
              <span className="stat-label">Total Reservas:</span>
              <span className="stat-value">{estadisticas_ocupacion?.total_reservas || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Habitaciones Ocupadas:</span>
              <span className="stat-value">{estadisticas_ocupacion?.habitaciones_ocupadas || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Habitaciones Disponibles:</span>
              <span className="stat-value">{estadisticas_ocupacion?.habitaciones_disponibles || 0}</span>
            </div>
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${estadisticas_ocupacion?.porcentaje_ocupacion || 0}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {estadisticas_ocupacion?.porcentaje_ocupacion?.toFixed(1) || 0}% de ocupación
              </p>
            </div>
          </div>
        </div>

        {/* Resumen Financiero Detallado */}
        <div className="stats-card">
          <h3 className="stats-title">💹 Resumen Financiero</h3>
          <div>
            <div className="stat-row">
              <span className="stat-label">Total Movimientos:</span>
              <span className="stat-value">
                {(resumen_financiero?.cantidad_ingresos || 0) + (resumen_financiero?.cantidad_egresos || 0)}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label green">• Ingresos ({resumen_financiero?.cantidad_ingresos || 0}):</span>
              <span className="stat-value green">
                {formatearMonto(resumen_financiero?.total_ingresos)}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label red">• Egresos ({resumen_financiero?.cantidad_egresos || 0}):</span>
              <span className="stat-value red">
                {formatearMonto(resumen_financiero?.total_egresos)}
              </span>
            </div>
            <div className="stat-row" style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1rem', marginTop: '1rem' }}>
              <span className="stat-label" style={{ fontWeight: '600', color: '#1f2937' }}>Balance Final:</span>
              <span className={`stat-value ${
                (resumen_financiero?.saldo || 0) >= 0 ? 'green' : 'red'
              }`} style={{ fontSize: '1.125rem' }}>
                {formatearMonto(resumen_financiero?.saldo)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Últimos Movimientos */}
      <div className="movements-card">
        <h3 className="stats-title">📋 Últimos Movimientos</h3>
        {ultimos_movimientos && ultimos_movimientos.length > 0 ? (
          <div className="table-container">
            <table className="movements-table">
              <thead className="table-header">
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {ultimos_movimientos.map((movimiento, index) => (
                  <tr key={index} className="table-row">
                    <td>{formatearFecha(movimiento.fecha)}</td>
                    <td>
                      <span className={`movement-badge ${obtenerColorMovimiento(movimiento.tipo)}`}>
                        {movimiento.tipo}
                      </span>
                    </td>
                    <td>{movimiento.descripcion}</td>
                    <td className={`${
                      movimiento.tipo === 'Ingreso' ? 'amount-positive' : 'amount-negative'
                    }`} style={{ textAlign: 'right' }}>
                      {movimiento.tipo === 'Ingreso' ? '+' : '-'}{formatearMonto(Math.abs(movimiento.monto))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data-message">No hay movimientos recientes</p>
        )}
      </div>

      {/* Accesos Rápidos */}
      <div className="quick-access-card">
        <h3 className="stats-title">🚀 Accesos Rápidos</h3>
        <div className="quick-access-grid">
          <button className="quick-access-button">
            <div className="quick-access-icon">📊</div>
            <div className="quick-access-text">Libro Diario</div>
          </button>
          <button className="quick-access-button">
            <div className="quick-access-icon">👥</div>
            <div className="quick-access-text">Registro Huéspedes</div>
          </button>
          <button className="quick-access-button">
            <div className="quick-access-icon">🏨</div>
            <div className="quick-access-text">Ocupación</div>
          </button>
          <button className="quick-access-button">
            <div className="quick-access-icon">📈</div>
            <div className="quick-access-text">Exportar</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;