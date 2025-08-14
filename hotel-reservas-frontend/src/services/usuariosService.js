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

export const updateUser = async (id, userData) => {
  // Crear objeto solo con campos que tienen valor
  const dataToSend = {};
  
  if (userData.nombre && userData.nombre.trim() !== '') {
    dataToSend.nombre = userData.nombre;
  }
  
  if (userData.correo && userData.correo.trim() !== '') {
    dataToSend.correo = userData.correo;
  }
  
  // Solo incluir contraseña si no está vacía
  if (userData.contraseña && userData.contraseña.trim() !== '') {
    dataToSend.contraseña = userData.contraseña;
  }
  
  if (userData.rol_id) {
    dataToSend.rol_id = userData.rol_id;
  }
  
  const response = await fetch(`/api/usuarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend) // Solo envía campos con valor
  });
  
  return response.json();
};

const usuariosService = {
  // Obtener todos los usuarios
  listarUsuarios: async () => {
    try {
      const response = await api.get('/usuarios/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Error al obtener usuarios');
    }
  },

  // Obtener usuario por ID
  obtenerUsuario: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Error al obtener usuario');
    }
  },

  // Obtener usuario por correo
  obtenerUsuarioPorCorreo: async (correo) => {
    try {
      const response = await api.get(`/usuarios/por-correo/`, {
        params: { correo }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Error al obtener usuario por correo');
    }
  },

  // Crear nuevo usuario
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
        throw error; // Re-lanzar errores de validación
      }
      throw new Error(error.response?.data?.detail || 'Error al crear usuario');
    }
  },

  // Actualizar usuario
  actualizarUsuario: async (id, userData) => {
    try {
      // Validaciones del lado cliente
      if (!userData.nombre?.trim()) {
        throw new Error('El nombre es requerido');
      }
      if (!userData.correo?.trim()) {
        throw new Error('El correo es requerido');
      }
      if (userData.contraseña && userData.contraseña.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Preparar datos para enviar
      const updateData = {
        nombre: userData.nombre.trim(),
        correo: userData.correo.trim(),
        rol_id: userData.rol_id
      };

      // Solo incluir contraseña si se proporcionó
      if (userData.contraseña && userData.contraseña.trim()) {
        updateData.contraseña = userData.contraseña.trim();
      }

      console.log('Enviando datos de actualización:', updateData);
      
      const response = await api.put(`/usuarios/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error.response?.data);
      if (error.message.startsWith('El ') || error.message.startsWith('La ')) {
        throw error; // Re-lanzar errores de validación
      }
      
      // Manejar errores específicos del servidor
      if (error.response?.status === 422) {
        const detail = error.response.data?.detail;
        if (Array.isArray(detail)) {
          const errorMessages = detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
          throw new Error(`Error de validación: ${errorMessages}`);
        } else if (typeof detail === 'string') {
          throw new Error(detail);
        }
        throw new Error('Error de validación en los datos enviados');
      }
      
      throw new Error(error.response?.data?.detail || 'Error al actualizar usuario');
    }
  },

  // Eliminar usuario
  eliminarUsuario: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Error al eliminar usuario');
    }
  },

  // Verificar si el correo ya existe (para validaciones)
  verificarCorreoExistente: async (correo, excludeId = null) => {
    try {
      const usuarios = await usuariosService.listarUsuarios();
      return usuarios.some(usuario => 
        usuario.correo.toLowerCase() === correo.toLowerCase() && 
        (excludeId === null || usuario.id !== excludeId)
      );
    } catch (error) {
      console.warn('Error al verificar correo:', error);
      return false;
    }
  },

  // Obtener estadísticas de usuarios
  obtenerEstadisticas: async () => {
    try {
      const usuarios = await usuariosService.listarUsuarios();
      return {
        total: usuarios.length,
        administradores: usuarios.filter(u => u.rol_id === 2).length,
        moderadores: usuarios.filter(u => u.rol_id === 3).length,
        usuarios: usuarios.filter(u => u.rol_id === 1).length
      };
    } catch (error) {
      throw new Error('Error al obtener estadísticas');
    }
  },

  // Buscar usuarios por término
  buscarUsuarios: async (termino = '', rolId = null) => {
    try {
      const usuarios = await usuariosService.listarUsuarios();
      
      let resultado = usuarios;
      
      // Filtrar por término de búsqueda
      if (termino.trim()) {
        const terminoLower = termino.toLowerCase();
        resultado = resultado.filter(usuario => 
          usuario.nombre.toLowerCase().includes(terminoLower) ||
          usuario.correo.toLowerCase().includes(terminoLower)
        );
      }
      
      // Filtrar por rol
      if (rolId !== null && rolId !== '') {
        resultado = resultado.filter(usuario => usuario.rol_id === parseInt(rolId));
      }
      
      return resultado;
    } catch (error) {
      throw new Error('Error al buscar usuarios');
    }
  }
};

export default usuariosService;