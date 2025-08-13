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
      const dataToSend = {
        numero: String(habitacionData.numero),
        tipo: String(habitacionData.tipo),
        precio_noche: parseFloat(habitacionData.precio), 
        estado: String(habitacionData.estado || 'disponible')
      };

      console.log('Enviando datos:', dataToSend);

      const response = await fetch(`${API_BASE_URL}/habitaciones/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.detail || errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear habitación:', error);
      throw error;
    }
  }

  // PUT /habitaciones/{habitacion_id}/estado - Actualizar Estado
  async actualizarEstado(habitacionId, nuevoEstado) {
    try {
      const response = await fetch(`${API_BASE_URL}/habitaciones/${habitacionId}/estado?nuevo_estado=${nuevoEstado}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  }
}

export default new HabitacionesService();