// services/reportesService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ReportesService {
  // GET /reportes/dashboard - Obtener dashboard completo
  async obtenerDashboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/reportes/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Procesar y estructurar datos para el componente
      return {
        periodo: data.periodo || "Historial completo",
        resumen_financiero: {
          total_ingresos: data.resumen_financiero?.total_ingresos || 0,
          total_egresos: data.resumen_financiero?.total_egresos || 0,
          saldo_neto: data.resumen_financiero?.saldo_neto || 0,
          cantidad_ingresos: data.estadisticas_registros?.total_ingresos_registros || 0,
          cantidad_egresos: data.estadisticas_registros?.total_egresos_registros || 0
        },
        estadisticas_registros: data.estadisticas_registros || {
          total_ingresos_registros: 0,
          total_egresos_registros: 0,
          total_movimientos: 0
        },
        ultimos_movimientos: data.ultimos_movimientos || [],
        kpis: data.kpis || {
          promedio_ingreso: 0,
          promedio_egreso: 0,
          estado_financiero: "Neutral"
        },
        fecha_actualizacion: data.fecha_actualizacion || new Date().toISOString()
      };

    } catch (error) {
      console.error('Error al obtener dashboard:', error);
      throw error;
    }
  }

  // GET /reportes/resumen-financiero-directo - Resumen financiero directo
  async obtenerResumenFinanciero() {
    try {
      const response = await fetch(`${API_BASE_URL}/reportes/resumen-financiero-directo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener resumen financiero:', error);
      throw error;
    }
  }

  // GET /reportes/libro-diario - Obtener libro diario
  async obtenerLibroDiario(filtros = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filtros.fecha_inicio) {
        params.append('fecha_inicio', filtros.fecha_inicio);
      }
      if (filtros.fecha_fin) {
        params.append('fecha_fin', filtros.fecha_fin);
      }
      if (filtros.tipo) {
        params.append('tipo', filtros.tipo);
      }

      const url = `${API_BASE_URL}/reportes/libro-diario${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener libro diario:', error);
      throw error;
    }
  }

  // GET /reportes/registro-huespedes - Obtener registro de huéspedes
  async obtenerRegistroHuespedes(filtros = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filtros.fecha_inicio) {
        params.append('fecha_inicio', filtros.fecha_inicio);
      }
      if (filtros.fecha_fin) {
        params.append('fecha_fin', filtros.fecha_fin);
      }
      if (filtros.documento_identidad) {
        params.append('documento_identidad', filtros.documento_identidad);
      }
      if (filtros.nombre_cliente) {
        params.append('nombre_cliente', filtros.nombre_cliente);
      }

      const url = `${API_BASE_URL}/reportes/registro-huespedes${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener registro de huéspedes:', error);
      throw error;
    }
  }

  // GET /reportes/registro-ocupacion - Obtener registro de ocupación
  async obtenerRegistroOcupacion(filtros = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filtros.fecha_inicio) {
        params.append('fecha_inicio', filtros.fecha_inicio);
      }
      if (filtros.fecha_fin) {
        params.append('fecha_fin', filtros.fecha_fin);
      }
      if (filtros.numero_habitacion) {
        params.append('numero_habitacion', filtros.numero_habitacion);
      }
      if (filtros.tipo_habitacion) {
        params.append('tipo_habitacion', filtros.tipo_habitacion);
      }

      const url = `${API_BASE_URL}/reportes/registro-ocupacion${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener registro de ocupación:', error);
      throw error;
    }
  }

  // GET /reportes/dashboard/exportar - Exportar dashboard
  async exportarDashboard(formato = 'json', periodo = 'todo', incluirMovimientos = true) {
    try {
      const params = new URLSearchParams({
        formato: formato,
        periodo: periodo,
        incluir_movimientos: incluirMovimientos.toString()
      });

      const response = await fetch(`${API_BASE_URL}/reportes/dashboard/exportar?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/csv, application/vnd.ms-excel',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Obtener el nombre del archivo del header
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'dashboard_export';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Crear blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true, filename };
    } catch (error) {
      console.error('Error al exportar dashboard:', error);
      throw error;
    }
  }

  // Métodos auxiliares para formateo
  formatearFecha(fecha) {
    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        return 'Fecha inválida';
      }
      
      return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
  }

  formatearMonto(monto) {
    try {
      return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(monto || 0);
    } catch (error) {
      console.error('Error al formatear monto:', error);
      return '$0.00';
    }
  }

  formatearFechaISO(fecha) {
    try {
      if (fecha instanceof Date) {
        return fecha.toISOString().split('T')[0];
      }
      if (typeof fecha === 'string') {
        return fecha.split('T')[0];
      }
      return fecha;
    } catch (error) {
      console.error('Error al formatear fecha ISO:', error);
      return '';
    }
  }

  // Validaciones
  validarFiltrosFechas(fechaInicio, fechaFin) {
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      
      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        throw new Error('Las fechas proporcionadas no son válidas');
      }
      
      if (inicio > fin) {
        throw new Error('La fecha de inicio no puede ser mayor que la fecha de fin');
      }
    }
    return true;
  }

  // Método para obtener los tipos de movimiento disponibles
  getTiposMovimiento() {
    return ['Ingreso', 'Egreso'];
  }

  // Método para obtener los formatos de exportación disponibles
  getFormatosExportacion() {
    return [
      { value: 'json', label: 'JSON' },
      { value: 'csv', label: 'CSV' },
      { value: 'excel', label: 'Excel' }
    ];
  }

  // Método para obtener los períodos disponibles
  getPeriodosExportacion() {
    return [
      { value: 'todo', label: 'Todo el historial' },
      { value: 'ultimos_30_dias', label: 'Últimos 30 días' },
      { value: 'mes_actual', label: 'Mes actual' },
      { value: 'año_actual', label: 'Año actual' }
    ];
  }
}

export default new ReportesService();