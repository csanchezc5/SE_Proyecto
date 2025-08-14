// services/reservasService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ReservasService {
  // GET /reservas/ - Listar Reservas
  async listarReservas() {
    try {
      const response = await fetch(`${API_BASE_URL}/reservas/`, {
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
      console.error('Error al listar reservas:', error);
      throw error;
    }
  }

  // POST /reservas/ - Crear Reserva
  async crearReserva(reservaData) {
    try {
      const dataToSend = {
        cliente_id: parseInt(reservaData.cliente_id),
        habitacion_id: parseInt(reservaData.habitacion_id),
        fecha_inicio: reservaData.fecha_inicio, // formato: YYYY-MM-DD
        fecha_fin: reservaData.fecha_fin // formato: YYYY-MM-DD
      };

      console.log('Enviando datos de reserva:', dataToSend);

      const response = await fetch(`${API_BASE_URL}/reservas/`, {
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
      console.error('Error al crear reserva:', error);
      throw error;
    }
  }

  // PUT /reservas/{reserva_id}/cancelar - Cancelar Reserva
  async cancelarReserva(reservaId) {
    try {
      const response = await fetch(`${API_BASE_URL}/reservas/${reservaId}/cancelar`, {
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
      console.error('Error al cancelar reserva:', error);
      throw error;
    }
  }

  // Método auxiliar para formatear fechas si es necesario
  formatearFecha(fecha) {
    if (fecha instanceof Date) {
      return fecha.toISOString().split('T')[0]; // YYYY-MM-DD
    }
    return fecha;
  }

  // Método auxiliar para validar fechas
  validarFechas(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const hoy = new Date();
    
    // Resetear horas para comparar solo fechas
    hoy.setHours(0, 0, 0, 0);
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);

    if (inicio < hoy) {
      throw new Error('La fecha de inicio no puede ser anterior a hoy');
    }

    if (fin <= inicio) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    return true;
  }

  // Método auxiliar para calcular días de estancia
  calcularDiasEstancia(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }
}

export default new ReservasService();