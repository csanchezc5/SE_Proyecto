// src/services/usuariosService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en API:', error.response?.data || error.message);
    throw error;
  }
);

const usuariosService = {
  // Actualizar usuario - VERSIÓN CORREGIDA
  actualizarUsuario: async (id, userData) => {
    try {
      console.log('📄 Datos recibidos para actualización:', userData);
      
      // Validaciones del lado cliente
      if (userData.nombre !== undefined && !userData.nombre?.trim()) {
        throw new Error('El nombre no puede estar vacío');
      }
      if (userData.correo !== undefined && !userData.correo?.trim()) {
        throw new Error('El correo no puede estar vacío');
      }
      
      // Solo validar contraseña si se proporciona
      if (userData.contraseña && userData.contraseña.trim() && userData.contraseña.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Preparar datos para enviar - SOLO campos que tienen valores válidos
      const updateData = {};
      
      // Solo incluir campos que realmente necesitan actualizarse
      if (userData.nombre && userData.nombre.trim()) {
        updateData.nombre = userData.nombre.trim();
      }
      
      if (userData.correo && userData.correo.trim()) {
        updateData.correo = userData.correo.trim();
      }
      
      // Incluir rol_id si está definido (puede ser 0)
      if (userData.rol_id !== undefined && userData.rol_id !== null) {
        updateData.rol_id = parseInt(userData.rol_id);
      }
      
      // Solo incluir contraseña si se proporcionó Y no está vacía
      if (userData.contraseña && userData.contraseña.trim() !== '') {
        updateData.contraseña = userData.contraseña.trim();
      }
      // IMPORTANTE: NO incluir contraseña en updateData si está vacía

      console.log('📤 Datos que se enviarán al backend:', updateData);
      
      // Verificar que hay datos para actualizar
      if (Object.keys(updateData).length === 0) {
        throw new Error('No hay datos válidos para actualizar');
      }
      
      const response = await api.put(`/usuarios/${id}`, updateData);
      
      console.log('✅ Respuesta del servidor:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Re-lanzar errores de validación del cliente
      if (error.message.startsWith('El ') || 
          error.message.startsWith('La ') || 
          error.message.startsWith('No hay datos')) {
        throw error;
      }
      
      // Manejar errores específicos del servidor
      if (error.response?.status === 422) {
        const detail = error.response.data?.detail;
        
        if (Array.isArray(detail)) {
          // Errores de validación de Pydantic
          const errorMessages = detail.map(err => {
            const field = err.loc ? err.loc[err.loc.length - 1] : 'campo';
            let fieldName = field;
            
            // Traducir nombres de campos
            switch (field) {
              case 'nombre': fieldName = 'nombre'; break;
              case 'correo': fieldName = 'correo'; break;
              case 'contraseña': fieldName = 'contraseña'; break;
              case 'rol_id': fieldName = 'rol'; break;
              default: fieldName = field;
            }
            
            return `${fieldName}: ${err.msg}`;
          }).join(', ');
          
          throw new Error(`Error de validación: ${errorMessages}`);
          
        } else if (typeof detail === 'string') {
          throw new Error(detail);
        } else {
          throw new Error('Error de validación. Verifica que todos los campos sean correctos.');
        }
      }
      
      if (error.response?.status === 404) {
        throw new Error('Usuario no encontrado');
      }
      
      if (error.response?.status === 409) {
        throw new Error('El correo electrónico ya está en uso por otro usuario');
      }
      
      if (error.response?.status === 400) {
        throw new Error('Datos inválidos enviados al servidor');
      }
      
      throw new Error(
        error.response?.data?.detail || 
        error.message || 
        'Error desconocido al actualizar usuario'
      );
    }
  },

  // Resto de métodos...
  listarUsuarios: async () => {
    try {
      const response = await api.get('/usuarios/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Error al obtener usuarios');
    }
  },

  obtenerUsuario: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Error al obtener usuario');
    }
  },

  crearUsuario: async (userData) => {
    try {
      // Validaciones del lado cliente
      if (!userData.nombre?.trim()) {
        throw new Error('El nombre es requerido');
      }
      if (!userData.correo?.trim()) {
        throw new Error('El correo es requerido');
      }
      if (!userData.contraseña?.trim()) {
        throw new Error('La contraseña es requerida');
      }
      if (userData.contraseña.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const response = await api.post('/usuarios/', userData);
      return response.data;
    } catch (error) {
      if (error.message.startsWith('El ') || error.message.startsWith('La ')) {
        throw error;
      }
      throw new Error(error.response?.data?.detail || 'Error al crear usuario');
    }
  },

  eliminarUsuario: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Error al eliminar usuario');
    }
  }
};

export default usuariosService;