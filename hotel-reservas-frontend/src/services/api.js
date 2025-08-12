import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:8000'; // Ajusta según tu backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Servicios para cada entidad
export const reservasAPI = {
  // Obtener todas las reservas
  getAll: () => api.get('/reservas/'),
  
  // Obtener reserva por ID
  getById: (id) => api.get(`/reservas/${id}`),
  
  // Crear nueva reserva
  create: (data) => api.post('/reservas/', data),
  
  // Actualizar reserva
  update: (id, data) => api.put(`/reservas/${id}`, data),
  
  // Eliminar reserva
  delete: (id) => api.delete(`/reservas/${id}`)
};

export const usuariosAPI = {
  getAll: () => api.get('/usuarios/'),
  getById: (id) => api.get(`/usuarios/${id}`),
  create: (data) => api.post('/usuarios/', data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`)
};

export const habitacionesAPI = {
  getAll: () => api.get('/habitaciones/'),
  getById: (id) => api.get(`/habitaciones/${id}`),
  create: (data) => api.post('/habitaciones/', data),
  update: (id, data) => api.put(`/habitaciones/${id}`, data),
  delete: (id) => api.delete(`/habitaciones/${id}`)
};

// Agregar más servicios según tus endpoints
export default api;