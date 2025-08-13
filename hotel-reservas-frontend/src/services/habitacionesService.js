// services/habitacionesService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class HabitacionesService {
  // GET /habitaciones/ - Listar Habitaciones
  async listarHabitaciones() {
    try {
      const response = await fetch(`${API_BASE_URL}/habitaciones/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Agregar token si usas autenticación
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al listar habitaciones:', error);
      throw error;
    }
  }

  // POST /habitaciones/ - Crear Habitación
  async crearHabitacion(habitacionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/habitaciones/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(habitacionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear habitación:', error);
      throw error;
    }
  }

  // GET /habitaciones/{habitacion_id} - Obtener Habitación
  async obtenerHabitacion(habitacionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/habitaciones/${habitacionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener habitación:', error);
      throw error;
    }
  }

  // PUT /habitaciones/{habitacion_id}/estado - Actualizar Estado
  async actualizarEstado(habitacionId, nuevoEstado) {
    try {
      const response = await fetch(`${API_BASE_URL}/habitaciones/${habitacionId}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  }
}

export default new HabitacionesService();