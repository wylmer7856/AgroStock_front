// 👥 PANTALLA DE GESTIÓN DE USUARIOS - ADMIN

import React, { useState, useEffect } from 'react';
import { usePagination, useDebounce } from '../../hooks';
import adminService from '../../services/admin';
import { ubicacionesService } from '../../services';
import { Card, Button, Input, Modal, Loading, Badge, Avatar, Toast } from '../../components/ReusableComponents';
import type { UsuarioAdmin, FiltrosUsuarios, Ciudad } from '../../types';
import './AdminScreens.css';

// ===== FUNCIONES HELPER =====
const formatearFecha = (fecha: string | null | undefined): string => {
  if (!fecha) return 'N/A';
  
  try {
    const date = new Date(fecha);
    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    // Formato: DD/MM/YYYY
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};

const formatearTelefono = (telefono: string | null | undefined): string => {
  if (!telefono) return 'N/A';
  
  // Remover espacios y caracteres especiales
  const numero = telefono.replace(/\D/g, '');
  
  // Formato colombiano: +57 300 123 4567 o 300 123 4567
  if (numero.length === 10) {
    return `${numero.substring(0, 3)} ${numero.substring(3, 6)} ${numero.substring(6)}`;
  } else if (numero.length === 12 && numero.startsWith('57')) {
    return `+57 ${numero.substring(2, 5)} ${numero.substring(5, 8)} ${numero.substring(8)}`;
  }
  
  return telefono;
};

interface UsuariosScreenProps {
  onNavigate: (view: string) => void;
}

export const UsuariosScreen: React.FC<UsuariosScreenProps> = () => {
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
      
      const response = await adminService.getUsuarios(filtrosCompletos);
      
      if (response.success && response.data) {
        setUsuarios(response.data);
      } else {
        setError(response.message || 'Error cargando usuarios');
      }
    } catch {
      setError('Error desconocido');
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
        mostrarToast(response.message || 'Error actualizando usuario', 'error');
      }
    } catch {
      mostrarToast('Error actualizando usuario', 'error');
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

  const usuariosFiltrados = usuarios.filter(usuario =>
    !busquedaDebounced || 
    usuario.nombre.toLowerCase().includes(busquedaDebounced.toLowerCase()) ||
    usuario.email.toLowerCase().includes(busquedaDebounced.toLowerCase()) ||
    usuario.telefono.includes(busquedaDebounced)
  );

  return (
    <div className="usuarios-screen">
      {/* Header */}
      <div className="screen-header">
        <div className="header-content">
          <h1>Usuarios</h1>
        </div>
        <div className="header-actions">
          <Button
            variant="primary"
            icon="➕"
            onClick={() => setShowCreateModal(true)}
          >
            + Crear Usuario
          </Button>
          <Button
            variant="secondary"
            icon="🔄"
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
              icon="🔍"
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
              <option value="admin">Administrador</option>
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
              <option value="">Todos los estados</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Verificación:</label>
            <select
              value={filtros.email_verificado === undefined ? '' : filtros.email_verificado.toString()}
              onChange={(e) => setFiltros(prev => ({ 
                ...prev, 
                email_verificado: e.target.value === '' ? undefined : e.target.value === 'true'
              }))}
            >
              <option value="">Todos</option>
              <option value="true">Email verificado</option>
              <option value="false">Email no verificado</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de usuarios */}
      <Card 
        title={`Usuarios (${usuariosFiltrados.length})`}
        className="usuarios-list-card"
      >
        {loading ? (
          <Loading text="Cargando usuarios..." />
        ) : error ? (
          <div className="error-message">
            <p>❌ {error}</p>
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
          <div className="usuarios-table">
            {/* Header de la tabla */}
            <div className="table-header">
              <div className="table-cell-header">Contacto</div>
              <div className="table-cell-header">Rol</div>
              <div className="table-cell-header">Estado</div>
              <div className="table-cell-header">Registro</div>
              <div className="table-cell-header">Acciones</div>
            </div>
            
            {/* Filas de usuarios */}
            {usuariosFiltrados.map((usuario) => (
              <div key={usuario.id_usuario} className="table-row">
                {/* Información de contacto */}
                <div className="table-cell">
                  <div className="contact-info">
                    <div className="contact-main">
                      <div className="contact-item">
                        <span className="contact-value">{usuario.email || 'N/A'}</span>
                      </div>
                      <div className="contact-item">
                        <span className="contact-value">{formatearTelefono(usuario.telefono)}</span>
                      </div>
                    </div>
                    <div className="verification-badges">
                      {usuario.email_verificado && (
                        <Badge variant="success" size="small">Email ✓</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Rol */}
                <div className="table-cell">
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
                </div>
                
                {/* Estado */}
                <div className="table-cell">
                  <div className="status-info">
                    <Badge 
                      variant={usuario.activo ? 'success' : 'error'}
                      size="medium"
                    >
                      {usuario.activo ? '✅ Activo' : '❌ Inactivo'}
                    </Badge>
                    {usuario.ubicacion && (
                      <div className="location-info">
                        📍 {usuario.ubicacion.ciudad}, {usuario.ubicacion.departamento}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Fecha de registro */}
                <div className="table-cell">
                  <div className="registration-info">
                    <div className="registration-date">
                      {formatearFecha(usuario.fecha_registro)}
                    </div>
                    <div className="last-access">
                      Último acceso: {usuario.ultimo_acceso ? 
                        formatearFecha(usuario.ultimo_acceso) : 
                        'Nunca'
                      }
                    </div>
                  </div>
                </div>
                
                {/* Acciones */}
                <div className="table-cell">
                  <div className="action-buttons">
                    <Button
                      size="small"
                      variant="secondary"
                      icon="✏️"
                      onClick={() => handleEditarUsuario(usuario)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant={usuario.activo ? 'warning' : 'success'}
                      icon={usuario.activo ? '⏸️' : '▶️'}
                      onClick={() => handleCambiarEstadoUsuario(usuario.id_usuario, !usuario.activo)}
                    >
                      {usuario.activo ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button
                      size="small"
                      variant="danger"
                      icon="🗑️"
                      onClick={() => handleEliminarUsuario(usuario.id_usuario)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
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

      {/* Modales */}
      {showCreateModal && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            cargarUsuarios();
            mostrarToast('Usuario creado exitosamente', 'success');
          }}
        />
      )}

      {showEditModal && usuarioSeleccionado && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setUsuarioSeleccionado(null);
          }}
          usuario={usuarioSeleccionado}
          onSuccess={() => {
            setShowEditModal(false);
            setUsuarioSeleccionado(null);
            cargarUsuarios();
            mostrarToast('Usuario actualizado exitosamente', 'success');
          }}
        />
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

// ===== MODAL PARA CREAR USUARIO =====
interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    id_ciudad: '',
    rol: 'consumidor' as 'admin' | 'consumidor' | 'productor'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [loadingCiudades, setLoadingCiudades] = useState(false);

  // Cargar ciudades al abrir el modal
  useEffect(() => {
    if (isOpen) {
      const cargarCiudades = async () => {
        try {
          setLoadingCiudades(true);
          const response = await ubicacionesService.listarCiudades();
          if (response.success && response.data) {
            setCiudades(response.data);
          }
        } catch (error) {
          console.error('Error cargando ciudades:', error);
        } finally {
          setLoadingCiudades(false);
        }
      };
      cargarCiudades();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.crearUsuario({
        ...formData,
        id_ciudad: Number(formData.id_ciudad)
      });
      
      if (response.success) {
        onSuccess();
        // Resetear formulario
        setFormData({
          nombre: '',
          email: '',
          password: '',
          telefono: '',
          direccion: '',
          id_ciudad: '',
          rol: 'consumidor'
        });
      } else {
        setError(response.message || 'Error creando usuario');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Usuario"
      size="large"
    >
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-grid">
          <div className="form-group">
            <Input
              label="Nombre completo"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              required
              placeholder="Ej: Juan Pérez"
            />
          </div>
          
          <div className="form-group">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              placeholder="usuario@ejemplo.com"
            />
          </div>
          
          <div className="form-group">
            <Input
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          
          <div className="form-group">
            <Input
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              required
              placeholder="+57 300 123 4567"
            />
          </div>
          
          <div className="form-group">
            <Input
              label="Dirección"
              value={formData.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              required
              placeholder="Dirección completa"
            />
          </div>
          
          <div className="form-group">
            <label>Ciudad:</label>
            <select
              value={formData.id_ciudad}
              onChange={(e) => handleInputChange('id_ciudad', e.target.value)}
              required
              disabled={loadingCiudades}
            >
              <option value="">{loadingCiudades ? 'Cargando ciudades...' : 'Selecciona una ciudad'}</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                  {ciudad.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Rol del usuario:</label>
            <select
              value={formData.rol}
              onChange={(e) => handleInputChange('rol', e.target.value)}
            >
              <option value="consumidor">🛒 Consumidor</option>
              <option value="productor">🌱 Productor</option>
              <option value="admin">👨‍💼 Administrador</option>
            </select>
          </div>
        </div>
        
        {error && (
          <div className="form-error">
            <span className="error-icon">❌</span>
            <span>{error}</span>
          </div>
        )}
        
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon="➕"
          >
            Crear Usuario
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ===== MODAL PARA EDITAR USUARIO =====
interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: UsuarioAdmin;
  onSuccess: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  usuario,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    nombre: usuario.nombre,
    email: usuario.email,
    telefono: usuario.telefono,
    direccion: usuario.direccion,
    id_ciudad: usuario.id_ciudad?.toString() || '',
    rol: usuario.rol,
    activo: usuario.activo
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [loadingCiudades, setLoadingCiudades] = useState(false);

  // Cargar ciudades al abrir el modal
  useEffect(() => {
    if (isOpen) {
      const cargarCiudades = async () => {
        try {
          setLoadingCiudades(true);
          const response = await ubicacionesService.listarCiudades();
          if (response.success && response.data) {
            setCiudades(response.data);
          }
        } catch (error) {
          console.error('Error cargando ciudades:', error);
        } finally {
          setLoadingCiudades(false);
        }
      };
      cargarCiudades();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.editarUsuario(usuario.id_usuario, {
        ...formData,
        id_ciudad: formData.id_ciudad ? Number(formData.id_ciudad) : undefined
      });
      
      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || 'Error actualizando usuario');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar Usuario: ${usuario.nombre}`}
      size="large"
    >
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-grid">
          <div className="form-group">
            <Input
              label="Nombre completo"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <Input
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <Input
              label="Dirección"
              value={formData.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Ciudad:</label>
            <select
              value={formData.id_ciudad}
              onChange={(e) => handleInputChange('id_ciudad', e.target.value)}
              required
              disabled={loadingCiudades}
            >
              <option value="">{loadingCiudades ? 'Cargando ciudades...' : 'Selecciona una ciudad'}</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                  {ciudad.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Rol del usuario:</label>
            <select
              value={formData.rol}
              onChange={(e) => handleInputChange('rol', e.target.value)}
            >
              <option value="consumidor">🛒 Consumidor</option>
              <option value="productor">🌱 Productor</option>
              <option value="admin">👨‍💼 Administrador</option>
            </select>
          </div>

          <div className="form-group">
            <label>Estado del usuario:</label>
            <select
              value={formData.activo.toString()}
              onChange={(e) => handleInputChange('activo', e.target.value === 'true')}
            >
              <option value="true">✅ Activo</option>
              <option value="false">❌ Inactivo</option>
            </select>
          </div>
        </div>
        
        {error && (
          <div className="form-error">
            <span className="error-icon">❌</span>
            <span>{error}</span>
          </div>
        )}
        
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon="💾"
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UsuariosScreen;




