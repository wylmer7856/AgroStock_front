// 👥 PANTALLA DE GESTIÓN DE USUARIOS - ADMIN

import React, { useState, useEffect } from 'react';
import { usePagination, useDebounce } from '../../hooks';
import adminService from '../../services/admin';
import { ubicacionesService } from '../../services';
import { Card, Button, Input, Modal, Loading, Badge, Avatar, Toast } from '../../components/ReusableComponents';
import type { UsuarioAdmin, FiltrosUsuarios, Ciudad } from '../../types';
import './AdminScreens.css';

interface UsuariosScreenProps {
  onNavigate: (view: string) => void;
}

export const UsuariosScreen: React.FC<UsuariosScreenProps> = ({ onNavigate }) => {
  // ===== ESTADOS =====
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState<FiltrosUsuarios>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioAdmin | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ===== FUNCIONES =====
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filtrosCompletos = {
        ...filtros,
        ...(busquedaDebounced && { busqueda: busquedaDebounced })
      };
      
      console.log('[UsuariosScreen] Cargando usuarios con filtros:', filtrosCompletos);
      const response = await adminService.getUsuarios(filtrosCompletos);
      console.log('[UsuariosScreen] Respuesta recibida:', response);
      
      if (response.success && response.data) {
        setUsuarios(response.data);
        console.log('[UsuariosScreen] Usuarios cargados:', response.data.length);
      } else {
        const errorMsg = response.message || 'Error cargando usuarios';
        console.error('[UsuariosScreen] Error:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      console.error('[UsuariosScreen] Excepción:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ===== PAGINACIÓN =====
  const pagination = usePagination({
    initialPage: 1,
    initialLimit: 20,
    total: usuarios.length
  });

  // ===== DEBOUNCE PARA BÚSQUEDA =====
  const busquedaDebounced = useDebounce(busqueda, 300);

  // ===== EFECTOS =====
  useEffect(() => {
    cargarUsuarios();
  }, [filtros, busquedaDebounced]);

  const handleEliminarUsuario = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await adminService.eliminarUsuario(id);
      
      if (response.success) {
        setUsuarios(prev => prev.filter(u => u.id_usuario !== id));
        mostrarToast('Usuario eliminado exitosamente', 'success');
      } else {
        mostrarToast(response.message || 'Error eliminando usuario', 'error');
      }
    } catch {
      mostrarToast('Error eliminando usuario', 'error');
    }
  };

  const handleCambiarEstadoUsuario = async (id: number, activo: boolean) => {
    try {
      const response = await adminService.editarUsuario(id, { activo });
      
      if (response.success) {
        setUsuarios(prev =>
          prev.map(u => u.id_usuario === id ? { ...u, activo } : u)
        );
        mostrarToast(`Usuario ${activo ? 'activado' : 'desactivado'} exitosamente`, 'success');
      } else {
        mostrarToast(response.message || 'Error cambiando estado', 'error');
      }
    } catch {
      mostrarToast('Error cambiando estado', 'error');
    }
  };

  const handleEditarUsuario = (usuario: UsuarioAdmin) => {
    setUsuarioSeleccionado(usuario);
    setShowEditModal(true);
  };

  const mostrarToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Filtrar usuarios localmente
  const usuariosFiltrados = usuarios.filter(usuario =>
    !busquedaDebounced || 
    usuario.nombre?.toLowerCase().includes(busquedaDebounced.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(busquedaDebounced.toLowerCase()) ||
    usuario.telefono?.toLowerCase().includes(busquedaDebounced.toLowerCase())
  );

  return (
    <div className="screen-container">
      <div className="screen-header">
        <div className="header-content">
          <h1>Gestión de Usuarios</h1>
          <p>Administra todos los usuarios del sistema</p>
        </div>
        <div className="header-actions">
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            Nuevo Usuario
          </Button>
          <Button
            variant="secondary"
            onClick={cargarUsuarios}
            loading={loading}
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card title="Filtros y Búsqueda" className="filters-card">
        <div className="filters-grid">
          <div className="search-group">
            <Input
              label="Buscar usuarios"
              placeholder="Nombre, email o teléfono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label>Rol:</label>
            <select
              value={filtros.rol || ''}
              onChange={(e) => setFiltros(prev => ({ 
                ...prev, 
                rol: e.target.value || undefined
              }))}
            >
              <option value="">Todos los roles</option>
              <option value="admin">Admin</option>
              <option value="productor">Productor</option>
              <option value="consumidor">Consumidor</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Estado:</label>
            <select
              value={filtros.activo === undefined ? '' : filtros.activo.toString()}
              onChange={(e) => setFiltros(prev => ({ 
                ...prev, 
                activo: e.target.value === '' ? undefined : e.target.value === 'true'
              }))}
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de usuarios en tarjetas */}
      <Card 
        title={`Usuarios encontrados (${usuariosFiltrados.length})`}
        className="usuarios-list-card"
      >
        {loading ? (
          <Loading text="Cargando usuarios..." />
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <Button variant="primary" onClick={cargarUsuarios}>
              Reintentar
            </Button>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No se encontraron usuarios</h3>
            <p>Intenta ajustar los filtros o crear un nuevo usuario.</p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Crear Primer Usuario
            </Button>
          </div>
        ) : (
          <div className="usuarios-cards-grid">
            {usuariosFiltrados.map((usuario) => (
              <Card key={usuario.id_usuario} className="usuario-card">
                <div className="usuario-card-header">
                  <div className="usuario-avatar-section">
                    <Avatar name={usuario.nombre} size="large" />
                    <div className="usuario-basic-info">
                      <h3 className="usuario-nombre">{usuario.nombre}</h3>
                      <div className="usuario-id">ID: {usuario.id_usuario}</div>
                    </div>
                  </div>
                  <div className="usuario-badges">
                    <Badge 
                      variant={
                        usuario.rol === 'admin' ? 'error' : 
                        usuario.rol === 'productor' ? 'warning' : 'info'
                      }
                      size="medium"
                    >
                      {usuario.rol === 'admin' && '👨‍💼'}
                      {usuario.rol === 'productor' && '🌱'}
                      {usuario.rol === 'consumidor' && '🛒'}
                      {' '}{usuario.rol}
                    </Badge>
                    <Badge 
                      variant={usuario.activo ? 'success' : 'error'}
                      size="medium"
                    >
                      {usuario.activo ? '✅ Activo' : '❌ Inactivo'}
                    </Badge>
                  </div>
                </div>

                <div className="usuario-card-body">
                  <div className="usuario-contact-info">
                    <div className="contact-item">
                      <span className="contact-icon">📧</span>
                      <span className="contact-value">{usuario.email}</span>
                      {usuario.email_verificado && (
                        <Badge variant="success" size="small">✓</Badge>
                      )}
                    </div>
                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      <span className="contact-value">{usuario.telefono || 'N/A'}</span>
                      {usuario.telefono_verificado && (
                        <Badge variant="success" size="small">✓</Badge>
                      )}
                    </div>
                    {usuario.ubicacion && (
                      <div className="contact-item">
                        <span className="contact-icon">📍</span>
                        <span className="contact-value">
                          {usuario.ubicacion.ciudad}, {usuario.ubicacion.departamento}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="usuario-meta-info">
                    <div className="meta-item">
                      <span className="meta-label">Registro:</span>
                      <span className="meta-value">
                        {new Date(usuario.fecha_registro).toLocaleDateString()}
                      </span>
                    </div>
                    {usuario.ultimo_acceso && (
                      <div className="meta-item">
                        <span className="meta-label">Último acceso:</span>
                        <span className="meta-value">
                          {new Date(usuario.ultimo_acceso).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="usuario-card-footer">
                  <div className="usuario-actions">
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => handleEditarUsuario(usuario)}
                    >
                      Editar
                    </Button>
                    {usuario.rol === 'productor' && (
                      <Button
                        size="small"
                        variant="info"
                        onClick={() => onNavigate('productor')}
                      >
                        Panel Productor
                      </Button>
                    )}
                    {usuario.rol === 'consumidor' && (
                      <Button
                        size="small"
                        variant="info"
                        onClick={() => onNavigate('consumidor')}
                      >
                        Panel Consumidor
                      </Button>
                    )}
                    <Button
                      size="small"
                      variant={usuario.activo ? 'warning' : 'success'}
                      onClick={() => handleCambiarEstadoUsuario(usuario.id_usuario, !usuario.activo)}
                    >
                      {usuario.activo ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button
                      size="small"
                      variant="danger"
                      onClick={() => handleEliminarUsuario(usuario.id_usuario)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Paginación */}
      {usuariosFiltrados.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Mostrando {((pagination.currentPage - 1) * pagination.limit) + 1} - {Math.min(pagination.currentPage * pagination.limit, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuarios
          </div>
          <div className="pagination-controls">
            <Button
              size="small"
              variant="secondary"
              onClick={pagination.prevPage}
              disabled={!pagination.hasPrevPage}
            >
              ← Anterior
            </Button>
            <span className="pagination-page">
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>
            <Button
              size="small"
              variant="secondary"
              onClick={pagination.nextPage}
              disabled={!pagination.hasNextPage}
            >
              Siguiente →
            </Button>
          </div>
        </div>
      )}

      {/* Toast de notificaciones */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
