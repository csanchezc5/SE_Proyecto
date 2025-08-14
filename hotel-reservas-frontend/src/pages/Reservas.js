// pages/Reservas.js
import React, { useState, useEffect } from 'react';
import reservasService from '../services/reservasService';
import habitacionesService from '../services/habitacionesService';
import './Reservas.css';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    cliente_id: '',
    habitacion_id: '',
    fecha_inicio: '',
    fecha_fin: ''
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarReservas();
    cargarHabitaciones();
  }, []);

  const cargarReservas = async () => {
    setLoading(true);
    try {
      const data = await reservasService.listarReservas();
      setReservas(data);
      setError('');
    } catch (error) {
      setError('Error al cargar reservas: ' + error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarHabitaciones = async () => {
    try {
      const data = await habitacionesService.listarHabitaciones();
      // Filtrar solo habitaciones disponibles
      const disponibles = data.filter(hab => hab.estado === 'disponible');
      setHabitaciones(disponibles);
    } catch (error) {
      console.error('Error al cargar habitaciones:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar fechas antes de enviar
      reservasService.validarFechas(formData.fecha_inicio, formData.fecha_fin);

      await reservasService.crearReserva(formData);
      
      // Limpiar formulario y actualizar lista
      setFormData({
        cliente_id: '',
        habitacion_id: '',
        fecha_inicio: '',
        fecha_fin: ''
      });
      setShowForm(false);
      await cargarReservas();
      await cargarHabitaciones(); // Recargar habitaciones por si cambió disponibilidad
      setError('');
      alert('Reserva creada exitosamente');
    } catch (error) {
      setError('Error al crear reserva: ' + error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (reservaId) => {
    if (window.confirm('¿Está seguro de que desea cancelar esta reserva?')) {
      setLoading(true);
      try {
        await reservasService.cancelarReserva(reservaId);
        await cargarReservas();
        await cargarHabitaciones(); // Recargar habitaciones por si cambió disponibilidad
        setError('');
        alert('Reserva cancelada exitosamente');
      } catch (error) {
        setError('Error al cancelar reserva: ' + error.message);
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const calcularDias = (fechaInicio, fechaFin) => {
    return reservasService.calcularDiasEstancia(fechaInicio, fechaFin);
  };

  const obtenerHabitacionInfo = (habitacionId) => {
    const habitacion = habitaciones.find(h => h.id === habitacionId);
    return habitacion ? `${habitacion.numero} - ${habitacion.tipo}` : 'N/A';
  };

  return (
    <div className="reservas-container">
      <div className="header">
        <h2>Gestión de Reservas</h2>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? 'Cancelar' : 'Nueva Reserva'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Formulario de nueva reserva */}
      {showForm && (
        <div className="form-container">
          <h3>Nueva Reserva</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>ID Cliente:</label>
                <input
                  type="number"
                  name="cliente_id"
                  value={formData.cliente_id}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Habitación:</label>
                <select
                  name="habitacion_id"
                  value={formData.habitacion_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar habitación</option>
                  {habitaciones.map(habitacion => (
                    <option key={habitacion.id} value={habitacion.id}>
                      {habitacion.numero} - {habitacion.tipo} (${habitacion.precio_noche}/noche)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Fecha Inicio:</label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Fecha Fin:</label>
                <input
                  type="date"
                  name="fecha_fin"
                  value={formData.fecha_fin}
                  onChange={handleInputChange}
                  required
                  min={formData.fecha_inicio || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            {formData.fecha_inicio && formData.fecha_fin && (
              <div className="info-estancia">
                <p>Días de estancia: {calcularDias(formData.fecha_inicio, formData.fecha_fin)}</p>
              </div>
            )}
            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Creando...' : 'Crear Reserva'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de reservas */}
      <div className="reservas-list">
        <h3>Reservas Registradas</h3>
        {loading && !showForm && <p>Cargando reservas...</p>}
        
        {reservas.length === 0 && !loading ? (
          <p>No hay reservas registradas.</p>
        ) : (
          <div className="table-container">
            <table className="reservas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Habitación</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Días</th>
                  <th>Estado</th>
                  <th>Fecha Reserva</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map(reserva => (
                  <tr key={reserva.id}>
                    <td>{reserva.id}</td>
                    <td>{reserva.cliente_id}</td>
                    <td>{obtenerHabitacionInfo(reserva.habitacion_id)}</td>
                    <td>{formatearFecha(reserva.fecha_inicio)}</td>
                    <td>{formatearFecha(reserva.fecha_fin)}</td>
                    <td>{calcularDias(reserva.fecha_inicio, reserva.fecha_fin)}</td>
                    <td>
                      <span className={`estado ${reserva.estado}`}>
                        {reserva.estado}
                      </span>
                    </td>
                    <td>{formatearFecha(reserva.fecha_reserva)}</td>
                    <td>
                      {reserva.estado !== 'cancelada' && (
                        <button
                          onClick={() => handleCancelar(reserva.id)}
                          className="btn-danger btn-small"
                          disabled={loading}
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservas;