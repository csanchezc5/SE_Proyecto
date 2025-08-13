// pages/Habitaciones.js
import React, { useState, useEffect } from 'react';
import habitacionesService from '../services/habitacionesService';
import './Habitaciones.css';

const Habitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedHabitacion, setSelectedHabitacion] = useState(null);
  const [formData, setFormData] = useState({
    numero: '',
    tipo: '',
    precio: '',
    estado: 'disponible'
  });

  const estados = [
    { value: 'disponible', label: 'Disponible', color: 'bg-green-100 text-green-800' },
    { value: 'ocupada', label: 'Ocupada', color: 'bg-red-100 text-red-800' },
    { value: 'mantenimiento', label: 'Mantenimiento', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'limpieza', label: 'Limpieza', color: 'bg-blue-100 text-blue-800' }
  ];

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  const cargarHabitaciones = async () => {
    try {
      setLoading(true);
      const data = await habitacionesService.listarHabitaciones();
      setHabitaciones(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las habitaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validar datos antes de enviar
      if (!formData.numero.trim()) {
        setError('El número de habitación es requerido');
        return;
      }
      if (!formData.tipo) {
        setError('El tipo de habitación es requerido');
        return;
      }
      if (!formData.precio || parseFloat(formData.precio) <= 0) {
        setError('El precio debe ser mayor a 0');
        return;
      }
      
      await habitacionesService.crearHabitacion(formData);
      setShowModal(false);
      setFormData({
        numero: '',
        tipo: '',
        precio: '',
        estado: 'disponible'
      });
      cargarHabitaciones();
      setError(null); // Limpiar errores previos
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message || 'Error al crear la habitación');
    }
  };

  const handleEstadoChange = async (habitacionId, nuevoEstado) => {
    try {
      await habitacionesService.actualizarEstado(habitacionId, nuevoEstado);
      cargarHabitaciones();
    } catch (err) {
      setError('Error al actualizar el estado');
      console.error(err);
    }
  };

  const verDetalles = async (habitacionId) => {
    try {
      const habitacion = await habitacionesService.obtenerHabitacion(habitacionId);
      setSelectedHabitacion(habitacion);
    } catch (err) {
      setError('Error al obtener los detalles');
      console.error(err);
    }
  };

  const getEstadoStyle = (estado) => {
    const estadoInfo = estados.find(e => e.value === estado);
    return estadoInfo ? estadoInfo.color : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Habitaciones</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Nueva Habitación
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Grid de Habitaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {habitaciones.map((habitacion) => (
          <div key={habitacion.id} className="bg-white rounded-lg shadow-md border p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Habitación {habitacion.numero}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoStyle(habitacion.estado)}`}>
                {estados.find(e => e.value === habitacion.estado)?.label || habitacion.estado}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Tipo:</span> {habitacion.tipo}</p>
              <p><span className="font-medium">Precio:</span> ${habitacion.precio_noche}</p>
            </div>

            <div className="mt-4 space-y-2">
              <select
                value={habitacion.estado}
                onChange={(e) => handleEstadoChange(habitacion.id, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                {estados.map(estado => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => verDetalles(habitacion.id)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm transition-colors"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para nueva habitación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nueva Habitación</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Habitación
                </label>
                <input
                  type="text"
                  required
                  value={formData.numero}
                  onChange={(e) => setFormData({...formData, numero: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  required
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="simple">Simple</option>
                  <option value="doble">Doble</option>
                  <option value="suite">Suite</option>
                  <option value="familiar">Familiar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio por noche
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({...formData, precio: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Crear Habitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {selectedHabitacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Detalles - Habitación {selectedHabitacion.numero}
            </h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Tipo:</span> {selectedHabitacion.tipo}
              </div>
              <div>
                <span className="font-medium">Precio:</span> ${selectedHabitacion.precio_noche}
              </div>
              <div>
                <span className="font-medium">Estado:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getEstadoStyle(selectedHabitacion.estado)}`}>
                  {estados.find(e => e.value === selectedHabitacion.estado)?.label}
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setSelectedHabitacion(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habitaciones;