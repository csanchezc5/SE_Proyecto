// pages/Reportes.js
import React, { useState, useEffect } from 'react';
import reportesService from '../services/reportesService';
import './Reportes.css';

const Reportes = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [libroDiarioData, setLibroDiarioData] = useState([]);
  const [registroHuespedes, setRegistroHuespedes] = useState([]);
  const [registroOcupacion, setRegistroOcupacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Estados para filtros
  const [filtrosLibroDiario, setFiltrosLibroDiario] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    tipo: ''
  });

  const [filtrosHuespedes, setFiltrosHuespedes] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    documento_identidad: '',
    nombre_cliente: ''
  });

  const [filtrosOcupacion, setFiltrosOcupacion] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    numero_habitacion: '',
    tipo_habitacion: ''
  });

  // Estados para exportación
  const [exportConfig, setExportConfig] = useState({
    formato: 'json',
    periodo: 'todo',
    incluir_movimientos: true
  });

  useEffect(() => {
    if (activeTab === 'dashboard') {
      cargarDashboard();
    }
  }, [activeTab]);

  const limpiarMensajes = () => {
    setError(null);
    setSuccess(null);
  };

  const cargarDashboard = async () => {
    setLoading(true);
    limpiarMensajes();
    
    try {
      const data = await reportesService.obtenerDashboard();
      setDashboardData(data);
    } catch (err) {
      setError('Error al cargar el dashboard: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarLibroDiario = async () => {
    setLoading(true);
    limpiarMensajes();
    
    try {
      // Validar filtros antes de enviar
      if (filtrosLibroDiario.fecha_inicio && filtrosLibroDiario.fecha_fin) {
        reportesService.validarFiltrosFechas(filtrosLibroDiario.fecha_inicio, filtrosLibroDiario.fecha_fin);
      }
      
      const data = await reportesService.obtenerLibroDiario(filtrosLibroDiario);
      setLibroDiarioData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar libro diario: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarRegistroHuespedes = async () => {
    setLoading(true);
    limpiarMensajes();
    
    try {
      // Validar filtros antes de enviar
      if (filtrosHuespedes.fecha_inicio && filtrosHuespedes.fecha_fin) {
        reportesService.validarFiltrosFechas(filtrosHuespedes.fecha_inicio, filtrosHuespedes.fecha_fin);
      }
      
      const data = await reportesService.obtenerRegistroHuespedes(filtrosHuespedes);
      setRegistroHuespedes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar registro de huéspedes: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarRegistroOcupacion = async () => {
    setLoading(true);
    limpiarMensajes();
    
    try {
      // Validar filtros antes de enviar
      if (filtrosOcupacion.fecha_inicio && filtrosOcupacion.fecha_fin) {
        reportesService.validarFiltrosFechas(filtrosOcupacion.fecha_inicio, filtrosOcupacion.fecha_fin);
      }
      
      const data = await reportesService.obtenerRegistroOcupacion(filtrosOcupacion);
      setRegistroOcupacion(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar registro de ocupación: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportarDashboard = async () => {
    setLoading(true);
    limpiarMensajes();
    
    try {
      const result = await reportesService.exportarDashboard(
        exportConfig.formato,
        exportConfig.periodo,
        exportConfig.incluir_movimientos
      );
      
      setSuccess(`Dashboard exportado exitosamente como ${result.filename}`);
    } catch (err) {
      setError('Error al exportar dashboard: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    limpiarMensajes();
  };

  const formatearFecha = (fecha) => {
    return reportesService.formatearFecha(fecha);
  };

  const formatearMonto = (monto) => {
    return reportesService.formatearMonto(monto);
  };

  const obtenerColorMovimiento = (tipo) => {
    return tipo === 'ingreso' || tipo === 'Ingreso' ? 'ingreso' : 'egreso';
  };

  const obtenerFechaMinima = () => {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 1); // Permitir hasta un año atrás
    return hoy.toISOString().split('T')[0];
  };

  const obtenerFechaMaxima = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  return (
    <div className="reportes-container">
      {/* Header */}
      <div className="reportes-header">
        <h1 className="reportes-title">Reportes y Dashboard</h1>
        <button
          onClick={() => {
            if (activeTab === 'dashboard') cargarDashboard();
            else if (activeTab === 'libro-diario') cargarLibroDiario();
            else if (activeTab === 'huespedes') cargarRegistroHuespedes();
            else if (activeTab === 'ocupacion') cargarRegistroOcupacion();
          }}
          className="refresh-button"
          disabled={loading}
        >
          🔄 {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={limpiarMensajes} className="close-message">×</button>
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <span>{success}</span>
          <button onClick={limpiarMensajes} className="close-message">×</button>
        </div>
      )}

      {/* Navegación por pestañas */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleTabChange('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-button ${activeTab === 'libro-diario' ? 'active' : ''}`}
          onClick={() => handleTabChange('libro-diario')}
        >
          📚 Libro Diario
        </button>
        <button
          className={`tab-button ${activeTab === 'huespedes' ? 'active' : ''}`}
          onClick={() => handleTabChange('huespedes')}
        >
          👥 Registro Huéspedes
        </button>
        <button
          className={`tab-button ${activeTab === 'ocupacion' ? 'active' : ''}`}
          onClick={() => handleTabChange('ocupacion')}
        >
          🏨 Ocupación
        </button>
        <button
          className={`tab-button ${activeTab === 'exportar' ? 'active' : ''}`}
          onClick={() => handleTabChange('exportar')}
        >
          📥 Exportar
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="tab-content">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            {loading && <div className="loading-message">Cargando dashboard...</div>}
            
            {dashboardData && !loading && (
              <>
                {/* KPIs Financieros */}
                <div className="kpi-grid">
                  <div className="kpi-card">
                    <div className="kpi-content">
                      <div className="kpi-icon green">💰</div>
                      <div>
                        <p className="kpi-label">Ingresos Totales</p>
                        <p className="kpi-value green">
                          {formatearMonto(dashboardData.resumen_financiero?.total_ingresos)}
                        </p>
                        <small className="kpi-detail">
                          {dashboardData.resumen_financiero?.cantidad_ingresos || 0} registros
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="kpi-card">
                    <div className="kpi-content">
                      <div className="kpi-icon red">📉</div>
                      <div>
                        <p className="kpi-label">Egresos Totales</p>
                        <p className="kpi-value red">
                          {formatearMonto(dashboardData.resumen_financiero?.total_egresos)}
                        </p>
                        <small className="kpi-detail">
                          {dashboardData.resumen_financiero?.cantidad_egresos || 0} registros
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="kpi-card">
                    <div className="kpi-content">
                      <div className="kpi-icon blue">💼</div>
                      <div>
                        <p className="kpi-label">Saldo Neto</p>
                        <p className={`kpi-value ${
                          (dashboardData.resumen_financiero?.saldo_neto || 0) >= 0 ? 'green' : 'red'
                        }`}>
                          {formatearMonto(dashboardData.resumen_financiero?.saldo_neto)}
                        </p>
                        <small className="kpi-detail">
                          Estado: {dashboardData.kpis?.estado_financiero || 'Neutral'}
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="kpi-card">
                    <div className="kpi-content">
                      <div className="kpi-icon purple">📈</div>
                      <div>
                        <p className="kpi-label">Total Movimientos</p>
                        <p className="kpi-value purple">
                          {dashboardData.estadisticas_registros?.total_movimientos || 0}
                        </p>
                        <small className="kpi-detail">
                          Promedio ingreso: {formatearMonto(dashboardData.kpis?.promedio_ingreso)}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Últimos Movimientos */}
                <div className="movements-card">
                  <h3 className="section-title">📋 Últimos Movimientos</h3>
                  {dashboardData.ultimos_movimientos && dashboardData.ultimos_movimientos.length > 0 ? (
                    <div className="table-container">
                      <table className="movements-table">
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th>Monto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.ultimos_movimientos.map((movimiento, index) => (
                            <tr key={index}>
                              <td>{formatearFecha(movimiento.fecha)}</td>
                              <td>
                                <span className={`movement-badge ${obtenerColorMovimiento(movimiento.tipo)}`}>
                                  {movimiento.tipo}
                                </span>
                              </td>
                              <td>{movimiento.descripcion}</td>
                              <td className={`${
                                movimiento.monto >= 0 ? 'amount-positive' : 'amount-negative'
                              }`}>
                                {formatearMonto(movimiento.monto)}
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
              </>
            )}
          </div>
        )}

        {/* Libro Diario */}
        {activeTab === 'libro-diario' && (
          <div className="libro-diario-content">
            <div className="filtros-container">
              <h3 className="section-title">Filtros - Libro Diario</h3>
              <div className="filtros-grid">
                <div className="form-group">
                  <label>Fecha Inicio:</label>
                  <input
                    type="date"
                    value={filtrosLibroDiario.fecha_inicio}
                    onChange={(e) => setFiltrosLibroDiario({
                      ...filtrosLibroDiario,
                      fecha_inicio: e.target.value
                    })}
                    min={obtenerFechaMinima()}
                    max={obtenerFechaMaxima()}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Fin:</label>
                  <input
                    type="date"
                    value={filtrosLibroDiario.fecha_fin}
                    onChange={(e) => setFiltrosLibroDiario({
                      ...filtrosLibroDiario,
                      fecha_fin: e.target.value
                    })}
                    min={filtrosLibroDiario.fecha_inicio || obtenerFechaMinima()}
                    max={obtenerFechaMaxima()}
                  />
                </div>
                <div className="form-group">
                  <label>Tipo:</label>
                  <select
                    value={filtrosLibroDiario.tipo}
                    onChange={(e) => setFiltrosLibroDiario({
                      ...filtrosLibroDiario,
                      tipo: e.target.value
                    })}
                  >
                    <option value="">Todos</option>
                    {reportesService.getTiposMovimiento().map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <button
                    onClick={cargarLibroDiario}
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>
              </div>
            </div>

            {libroDiarioData.length > 0 && (
              <div className="resultados-container">
                <h3 className="section-title">Resultados ({libroDiarioData.length})</h3>
                <div className="table-container">
                  <table className="reportes-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {libroDiarioData.map((registro, index) => (
                        <tr key={index}>
                          <td>{formatearFecha(registro.fecha)}</td>
                          <td>
                            <span className={`movement-badge ${obtenerColorMovimiento(registro.tipo)}`}>
                              {registro.tipo}
                            </span>
                          </td>
                          <td>{registro.descripcion}</td>
                          <td className={`${
                            registro.tipo === 'Ingreso' ? 'amount-positive' : 'amount-negative'
                          }`}>
                            {formatearMonto(registro.monto)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Registro de Huéspedes */}
        {activeTab === 'huespedes' && (
          <div className="huespedes-content">
            <div className="filtros-container">
              <h3 className="section-title">Filtros - Registro de Huéspedes</h3>
              <div className="filtros-grid">
                <div className="form-group">
                  <label>Fecha Inicio:</label>
                  <input
                    type="date"
                    value={filtrosHuespedes.fecha_inicio}
                    onChange={(e) => setFiltrosHuespedes({
                      ...filtrosHuespedes,
                      fecha_inicio: e.target.value
                    })}
                    min={obtenerFechaMinima()}
                    max={obtenerFechaMaxima()}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Fin:</label>
                  <input
                    type="date"
                    value={filtrosHuespedes.fecha_fin}
                    onChange={(e) => setFiltrosHuespedes({
                      ...filtrosHuespedes,
                      fecha_fin: e.target.value
                    })}
                    min={filtrosHuespedes.fecha_inicio || obtenerFechaMinima()}
                    max={obtenerFechaMaxima()}
                  />
                </div>
                <div className="form-group">
                  <label>Documento:</label>
                  <input
                    type="text"
                    placeholder="Número de documento"
                    value={filtrosHuespedes.documento_identidad}
                    onChange={(e) => setFiltrosHuespedes({
                      ...filtrosHuespedes,
                      documento_identidad: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Nombre Cliente:</label>
                  <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={filtrosHuespedes.nombre_cliente}
                    onChange={(e) => setFiltrosHuespedes({
                      ...filtrosHuespedes,
                      nombre_cliente: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <button
                    onClick={cargarRegistroHuespedes}
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>
              </div>
            </div>

            {registroHuespedes.length > 0 && (
              <div className="resultados-container">
                <h3 className="section-title">Huéspedes Registrados ({registroHuespedes.length})</h3>
                <div className="table-container">
                  <table className="reportes-table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Documento</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Habitación</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registroHuespedes.map((huesped, index) => (
                        <tr key={index}>
                          <td>{huesped.cliente}</td>
                          <td>{huesped.documento_identidad}</td>
                          <td>{huesped.correo || 'N/A'}</td>
                          <td>{huesped.telefono || 'N/A'}</td>
                          <td>{formatearFecha(huesped.fecha_inicio)}</td>
                          <td>{huesped.fecha_fin ? formatearFecha(huesped.fecha_fin) : 'Activa'}</td>
                          <td>{huesped.habitacion || 'N/A'}</td>
                          <td>{huesped.tipo_habitacion || 'N/A'}</td>
                          <td>
                            <span className={`status-badge ${huesped.estado_reserva?.toLowerCase()}`}>
                              {huesped.estado_reserva || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Registro de Ocupación */}
        {activeTab === 'ocupacion' && (
          <div className="ocupacion-content">
            <div className="filtros-container">
              <h3 className="section-title">Filtros - Registro de Ocupación</h3>
              <div className="filtros-grid">
                <div className="form-group">
                  <label>Fecha Inicio:</label>
                  <input
                    type="date"
                    value={filtrosOcupacion.fecha_inicio}
                    onChange={(e) => setFiltrosOcupacion({
                      ...filtrosOcupacion,
                      fecha_inicio: e.target.value
                    })}
                    min={obtenerFechaMinima()}
                    max={obtenerFechaMaxima()}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Fin:</label>
                  <input
                    type="date"
                    value={filtrosOcupacion.fecha_fin}
                    onChange={(e) => setFiltrosOcupacion({
                      ...filtrosOcupacion,
                      fecha_fin: e.target.value
                    })}
                    min={filtrosOcupacion.fecha_inicio || obtenerFechaMinima()}
                    max={obtenerFechaMaxima()}
                  />
                </div>
                <div className="form-group">
                  <label>Número Habitación:</label>
                  <input
                    type="text"
                    placeholder="Ej: 101, 102..."
                    value={filtrosOcupacion.numero_habitacion}
                    onChange={(e) => setFiltrosOcupacion({
                      ...filtrosOcupacion,
                      numero_habitacion: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Tipo Habitación:</label>
                  <input
                    type="text"
                    placeholder="Ej: Simple, Doble..."
                    value={filtrosOcupacion.tipo_habitacion}
                    onChange={(e) => setFiltrosOcupacion({
                      ...filtrosOcupacion,
                      tipo_habitacion: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <button
                    onClick={cargarRegistroOcupacion}
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>
              </div>
            </div>

            {registroOcupacion.length > 0 && (
              <div className="resultados-container">
                <h3 className="section-title">Registro de Ocupación ({registroOcupacion.length})</h3>
                <div className="table-container">
                  <table className="reportes-table">
                    <thead>
                      <tr>
                        <th>Habitación</th>
                        <th>Tipo</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Estado Reserva</th>
                        <th>Cliente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registroOcupacion.map((ocupacion, index) => (
                        <tr key={index}>
                          <td>{ocupacion.habitacion}</td>
                          <td>{ocupacion.tipo || 'N/A'}</td>
                          <td>{formatearFecha(ocupacion.fecha_inicio)}</td>
                          <td>{ocupacion.fecha_fin ? formatearFecha(ocupacion.fecha_fin) : 'Activa'}</td>
                          <td>
                            <span className={`status-badge ${ocupacion.estado_reserva?.toLowerCase()}`}>
                              {ocupacion.estado_reserva || 'N/A'}
                            </span>
                          </td>
                          <td>{ocupacion.cliente || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Exportación */}
        {activeTab === 'exportar' && (
          <div className="exportar-content">
            <div className="export-container">
              <h3 className="section-title">Exportar Dashboard</h3>
              <div className="export-config">
                <div className="form-group">
                  <label>Formato:</label>
                  <select
                    value={exportConfig.formato}
                    onChange={(e) => setExportConfig({
                      ...exportConfig,
                      formato: e.target.value
                    })}
                  >
                    {reportesService.getFormatosExportacion().map(formato => (
                      <option key={formato.value} value={formato.value}>
                        {formato.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Período:</label>
                  <select
                    value={exportConfig.periodo}
                    onChange={(e) => setExportConfig({
                      ...exportConfig,
                      periodo: e.target.value
                    })}
                  >
                    {reportesService.getPeriodosExportacion().map(periodo => (
                      <option key={periodo.value} value={periodo.value}>
                        {periodo.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={exportConfig.incluir_movimientos}
                      onChange={(e) => setExportConfig({
                        ...exportConfig,
                        incluir_movimientos: e.target.checked
                      })}
                    />
                    Incluir últimos movimientos
                  </label>
                </div>

                <div className="form-group">
                  <button
                    onClick={exportarDashboard}
                    className="btn-primary btn-large"
                    disabled={loading}
                  >
                    {loading ? 'Exportando...' : '📥 Exportar Dashboard'}
                  </button>
                </div>
              </div>

              <div className="export-info">
                <h4>Información sobre la exportación:</h4>
                <ul>
                  <li><strong>JSON:</strong> Formato estructurado para análisis programático</li>
                  <li><strong>CSV:</strong> Compatible con Excel y herramientas de análisis</li>
                  <li><strong>Excel:</strong> Formato avanzado con múltiples hojas (simulado)</li>
                </ul>
                <p>La exportación incluirá resumen financiero, KPIs y opcionalmente los últimos movimientos.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reportes;