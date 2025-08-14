// src/pages/Usuarios.js
import React, { useState, useEffect } from 'react';
import usuariosService from '../services/usuariosService';
import './Usuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    rol_id: 1
  });

  const [stats, setStats] = useState({
    total: 0,
    administradores: 0,
    moderadores: 0,
    usuarios: 0
  });

  const roles = [
    { id: 1, nombre: 'Usuario', color: 'bg-blue-100 text-blue-800' },
    { id: 2, nombre: 'Administrador', color: 'bg-red-100 text-red-800' },
    { id: 3, nombre: 'Moderador', color: 'bg-green-100 text-green-800' }
  ];

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const usuariosData = await usuariosService.listarUsuarios();
      setUsuarios(usuariosData);
      
      // Calcular estadísticas
      const total = usuariosData.length;
      const administradores = usuariosData.filter(u => u.rol_id === 2).length;
      const moderadores = usuariosData.filter(u => u.rol_id === 3).length;
      const usuariosRegulares = usuariosData.filter(u => u.rol_id === 1).length;
      
      setStats({
        total,
        administradores,
        moderadores,
        usuarios: usuariosRegulares
      });
      
      setError(null);
    } catch (err) {
      setError('Error al cargar los usuarios: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.nombre.trim() || !formData.correo.trim()) {
        setError('Nombre y correo son requeridos');
        return;
      }

      if (!editingUser && !formData.contraseña.trim()) {
        setError('La contraseña es requerida para nuevos usuarios');
        return;
      }

      if (editingUser) {
        // Actualizar usuario existente - SOLO enviar campos que cambiaron
        const updateData = {};
        
        // Siempre incluir nombre y correo si tienen valor
        if (formData.nombre.trim()) {
          updateData.nombre = formData.nombre.trim();
        }
        
        if (formData.correo.trim()) {
          updateData.correo = formData.correo.trim();
        }
        
        // Siempre incluir rol_id
        updateData.rol_id = parseInt(formData.rol_id);
        
        // Solo incluir contraseña si el usuario escribió una nueva
        if (formData.contraseña && formData.contraseña.trim() !== '') {
          updateData.contraseña = formData.contraseña.trim();
        }
        
        console.log('Datos a enviar para actualización:', updateData);
        await usuariosService.actualizarUsuario(editingUser.id, updateData);
      } else {
        // Crear nuevo usuario - todos los campos son requeridos
        await usuariosService.crearUsuario({
          nombre: formData.nombre.trim(),
          correo: formData.correo.trim(),
          contraseña: formData.contraseña.trim(),
          rol_id: parseInt(formData.rol_id)
        });
      }

      setShowModal(false);
      setEditingUser(null);
      setFormData({
        nombre: '',
        correo: '',
        contraseña: '',
        rol_id: 1
      });
      cargarUsuarios();
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error en submit:', err);
    }
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      correo: usuario.correo,
      contraseña: '', // Siempre vacío para edición
      rol_id: usuario.rol_id
    });
    setShowModal(true);
    setError(null); // Limpiar errores previos
  };

  const handleDelete = (usuario) => {
    setUserToDelete(usuario);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await usuariosService.eliminarUsuario(userToDelete.id);
      setShowDeleteModal(false);
      setUserToDelete(null);
      cargarUsuarios();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const openNewUserModal = () => {
    setEditingUser(null);
    setFormData({
      nombre: '',
      correo: '',
      contraseña: '',
      rol_id: 1
    });
    setShowModal(true);
    setError(null); // Limpiar errores previos
  };

  const getRoleName = (rolId) => {
    const rol = roles.find(r => r.id === rolId);
    return rol ? rol.nombre : 'Sin rol';
  };

  const getRoleColor = (rolId) => {
    const rol = roles.find(r => r.id === rolId);
    return rol ? rol.color : 'bg-gray-100 text-gray-800';
  };

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || usuario.rol_id.toString() === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="usuarios-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="usuarios-container">
      {/* Header */}
      <div className="usuarios-header">
        <div className="header-content">
          <div className="header-title">
            <div className="title-icon">👥</div>
            <h1>Gestión de Usuarios</h1>
          </div>
          <p className="header-subtitle">
            Sistema integral de administración de usuarios
          </p>
        </div>
        <button onClick={openNewUserModal} className="btn-new-user">
          + Nuevo Usuario
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="error-alert">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">👥</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Usuarios</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon admin">🔴</div>
          <div className="stat-content">
            <h3>{stats.administradores}</h3>
            <p>Administradores</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon mod">🟢</div>
          <div className="stat-content">
            <h3>{stats.moderadores}</h3>
            <p>Moderadores</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon user">🔵</div>
          <div className="stat-content">
            <h3>{stats.usuarios}</h3>
            <p>Usuarios</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-section">
        <div className="search-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="role-filter"
          >
            <option value="">Todos los roles</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id.toString()}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-section">
        <div className="table-header">
          <h2>Tabla de Usuarios</h2>
          <span className="table-count">
            {usuariosFiltrados.length} usuarios encontrados
          </span>
        </div>
        
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>CORREO ELECTRÓNICO</th>
                <th>ROL</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr className="no-data-row">
                  <td colSpan="5">
                    <div className="no-data">
                      <div className="no-data-icon">📋</div>
                      <p>No se encontraron usuarios</p>
                      <small>Intenta ajustar los filtros de búsqueda</small>
                    </div>
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      <span className="user-id">#{usuario.id}</span>
                    </td>
                    <td>
                      <div className="user-name">
                        <div className="user-avatar">
                          {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                        {usuario.nombre}
                      </div>
                    </td>
                    <td>
                      <span className="user-email">{usuario.correo}</span>
                    </td>
                    <td>
                      <span className={`role-badge ${getRoleColor(usuario.rol_id)}`}>
                        {getRoleName(usuario.rol_id)}
                      </span>
                    </td>
                    <td>
                      <div className="actions-container">
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="btn-edit"
                          title="Editar usuario"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(usuario)}
                          className="btn-delete"
                          title="Eliminar usuario"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit User */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label>Nombre completo</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ingresa el nombre completo"
                />
              </div>

              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  required
                  value={formData.correo}
                  onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label>
                  Contraseña {editingUser && <small>(dejar vacío para mantener actual)</small>}
                </label>
                <input
                  type="password"
                  required={!editingUser} // Solo requerido para nuevos usuarios
                  value={formData.contraseña}
                  onChange={(e) => setFormData({...formData, contraseña: e.target.value})}
                  placeholder={editingUser ? "Nueva contraseña (opcional)" : "Contraseña segura"}
                  minLength={editingUser && formData.contraseña === '' ? 0 : 6} // Solo validar longitud si hay contenido
                />
                {editingUser && (
                  <small className="form-help">
                    💡 Si no deseas cambiar la contraseña, deja este campo vacío
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Rol</label>
                <select
                  value={formData.rol_id}
                  onChange={(e) => setFormData({...formData, rol_id: parseInt(e.target.value)})}
                >
                  {roles.map(rol => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-save"
                >
                  {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="delete-icon">⚠️</div>
            <h2>Confirmar eliminación</h2>
            <p>
              ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete.nombre}</strong>?
            </p>
            <p className="delete-warning">
              Esta acción no se puede deshacer.
            </p>
            
            <div className="form-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-cancel"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="btn-delete-confirm"
              >
                Eliminar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;