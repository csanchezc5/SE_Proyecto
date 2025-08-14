// reportesService.js
const API_BASE_URL = 'http://localhost:8000';

class ReportesService {
  // Método que combina datos de múltiples endpoints reales
  async obtenerDashboard() {
    try {
      // Hacer llamadas paralelas a los endpoints disponibles
      const [resumenFinanciero, estadisticasOcupacion, libroDiario] = await Promise.allSettled([
        this.obtenerResumenFinanciero(),
        this.obtenerEstadisticasOcupacion(),
        this.obtenerLibroDiario({ limite: 10 }) // Últimos 10 movimientos
      ]);

      // Procesar resultados y manejar errores
      const resumen_financiero = resumenFinanciero.status === 'fulfilled' 
        ? resumenFinanciero.value 
        : { total_ingresos: 0, total_egresos: 0, saldo: 0, cantidad_ingresos: 0, cantidad_egresos: 0 };

      const estadisticas_ocupacion = estadisticasOcupacion.status === 'fulfilled' 
        ? estadisticasOcupacion.value 
        : { total_reservas: 0, habitaciones_ocupadas: 0, habitaciones_disponibles: 0, habitaciones_total: 0, porcentaje_ocupacion: 0 };

      const ultimos_movimientos = libroDiario.status === 'fulfilled' 
        ? libroDiario.value.slice(0, 8) // Tomar solo los últimos 8
        : [];

      // Combinar todos los datos en el formato esperado
      return {
        periodo: `${new Date().toLocaleDateString('es-EC', { month: 'long', year: 'numeric' })}`,
        resumen_financiero,
        estadisticas_ocupacion,
        ultimos_movimientos
      };

    } catch (error) {
      console.error('Error al obtener dashboard:', error);
      
      // En caso de error total, devolver datos por defecto
      return {
        periodo: "Datos no disponibles",
        resumen_financiero: {
          total_ingresos: 0,
          total_egresos: 0,
          saldo: 0,
          cantidad_ingresos: 0,
          cantidad_egresos: 0
        },
        estadisticas_ocupacion: {
          total_reservas: 0,
          habitaciones_ocupadas: 0,
          habitaciones_disponibles: 0,
          habitaciones_total: 0,
          porcentaje_ocupacion: 0
        },
        ultimos_movimientos: []
      };
    }
  }

  // Cuando el backend esté listo, descomenta este método y elimina el de arriba
  /*
  async obtenerDashboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/reportes/dashboard`, {
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
      console.error('Error al obtener dashboard:', error);
      throw error;
    }
  }
  */

  // Otros métodos del servicio...
}

export default new ReportesService();