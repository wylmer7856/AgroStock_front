// 👨‍💼 DASHBOARD PRINCIPAL DEL ADMIN - PANEL DE CONTROL

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Loading, Toast } from '../../components/ReusableComponents';
import AgroStockLogo from '../../components/AgroStockLogo';
import { UsuariosScreen } from './UsuariosScreen';
import { ProductosScreen } from './ProductosScreen';
import { ReportesScreen } from './ReportesScreen';
import { EstadisticasScreen } from './EstadisticasScreen';
import adminService from '../../services/admin';
import './AdminScreens.css';

interface AdminDashboardProps {
  onNavigate?: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  // ===== ESTADOS =====
  const [currentView, setCurrentView] = useState<'overview' | 'usuarios' | 'productos' | 'reportes' | 'estadisticas'>('overview');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ===== FUNCIONES =====
  const mostrarToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as any);
    if (onNavigate) {
      onNavigate(view);
    }
  };

  // ===== RENDERIZADO DE VISTAS =====
  const renderCurrentView = () => {
    switch (currentView) {
      case 'usuarios':
        return <UsuariosScreen onNavigate={handleNavigate} />;
      case 'productos':
        return <ProductosScreen onNavigate={handleNavigate} />;
      case 'reportes':
        return <ReportesScreen onNavigate={handleNavigate} />;
      case 'estadisticas':
        return <EstadisticasScreen onNavigate={handleNavigate} />;
      case 'overview':
      default:
        return <OverviewScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar de navegación */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <div className="admin-logo">
            <AgroStockLogo size="small" variant="full" />
            <span className="admin-panel-text">Admin Panel</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Panel Principal</div>
            <button
              className={`nav-item ${currentView === 'overview' ? 'active' : ''}`}
              onClick={() => setCurrentView('overview')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Resumen</span>
            </button>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Gestión</div>
            <button
              className={`nav-item ${currentView === 'usuarios' ? 'active' : ''}`}
              onClick={() => setCurrentView('usuarios')}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-text">Usuarios</span>
            </button>
            <button
              className={`nav-item ${currentView === 'productos' ? 'active' : ''}`}
              onClick={() => setCurrentView('productos')}
            >
              <span className="nav-icon">🛍️</span>
              <span className="nav-text">Productos</span>
            </button>
            <button
              className={`nav-item ${currentView === 'reportes' ? 'active' : ''}`}
              onClick={() => setCurrentView('reportes')}
            >
              <span className="nav-icon">📋</span>
              <span className="nav-text">Reportes</span>
            </button>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Análisis</div>
            <button
              className={`nav-item ${currentView === 'estadisticas' ? 'active' : ''}`}
              onClick={() => setCurrentView('estadisticas')}
            >
              <span className="nav-icon">📈</span>
              <span className="nav-text">Estadísticas</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">👨‍💼</div>
            <div className="admin-details">
              <div className="admin-name">Administrador</div>
              <div className="admin-role">Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="admin-main">
        <div className="admin-content">
          {renderCurrentView()}
        </div>
      </div>

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

// ===== PANTALLA DE RESUMEN (OVERVIEW) =====
interface OverviewScreenProps {
  onNavigate: (view: string) => void;
}

const OverviewScreen: React.FC<OverviewScreenProps> = ({ onNavigate }) => {
  // ✅ Estados para cargar datos reales
  const [resumenData, setResumenData] = useState({
    totalUsuarios: 0,
    totalProductos: 0,
    totalPedidos: 0,
    ingresosTotales: 0,
    usuariosNuevos: 0,
    productosNuevos: 0,
    pedidosPendientes: 0,
    reportesPendientes: 0
  });
  const [loading, setLoading] = useState(true);
  const [usuariosPorRol, setUsuariosPorRol] = useState({
    admin: 0,
    productor: 0,
    consumidor: 0
  });

  // ✅ Cargar datos reales al montar
  useEffect(() => {
    cargarDatosResumen();
  }, []);

  const cargarDatosResumen = async () => {
    try {
      setLoading(true);
      // Cargar estadísticas, usuarios, productos y reportes en paralelo
      const [estadisticas, usuarios, productos, reportes] = await Promise.all([
        adminService.getEstadisticasGenerales(),
        adminService.getUsuarios(),
        adminService.getProductos(),
        adminService.getReportes()
      ]);

      if (estadisticas.success && estadisticas.data) {
        const stats = estadisticas.data;
        setResumenData({
          totalUsuarios: stats.total_usuarios || 0,
          totalProductos: stats.total_productos || 0,
          totalPedidos: stats.total_pedidos || 0,
          ingresosTotales: stats.ingresos_totales || 0,
          usuariosNuevos: stats.usuarios_nuevos || 0,
          productosNuevos: stats.productos_nuevos || 0,
          pedidosPendientes: stats.pedidos_pendientes || 0,
          reportesPendientes: reportes.success && reportes.data ? 
            reportes.data.filter((r: any) => r.estado === 'pendiente').length : 0
        });

        if (stats.usuarios_por_rol) {
          setUsuariosPorRol(stats.usuarios_por_rol);
        } else {
          // Calcular desde lista de usuarios
          const usuariosList = usuarios.success && usuarios.data ? usuarios.data : [];
          setUsuariosPorRol({
            admin: usuariosList.filter((u: any) => u.rol === 'admin').length,
            productor: usuariosList.filter((u: any) => u.rol === 'productor').length,
            consumidor: usuariosList.filter((u: any) => u.rol === 'consumidor').length
          });
        }
      }
    } catch (error) {
      console.error('Error cargando datos del resumen:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(cantidad);
  };

  const formatearNumero = (numero: number) => {
    return numero.toLocaleString('es-CO');
  };

  if (loading) {
    return (
      <div className="overview-screen">
        <Loading text="Cargando datos del sistema..." />
      </div>
    );
  }

  return (
    <div className="overview-screen">
      {/* Header */}
      <div className="overview-header">
        <div className="header-content">
          <h1>Resumen del Sistema</h1>
          <p>Vista general de la plataforma AgroStock</p>
        </div>
        <div className="header-actions">
          <Button
            variant="primary"
            icon="🔄"
            onClick={cargarDatosResumen}
            loading={loading}
          >
            Actualizar Datos
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="metrics-grid">
        <Card className="metric-card primary">
          <div className="metric-content">
            <div className="metric-icon">👥</div>
            <div className="metric-info">
              <div className="metric-number">{formatearNumero(resumenData.totalUsuarios)}</div>
              <div className="metric-label">Total Usuarios</div>
              <div className="metric-change">
                <Badge variant="success" size="small">
                  +{resumenData.usuariosNuevos} nuevos
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="metric-card success">
          <div className="metric-content">
            <div className="metric-icon">🛍️</div>
            <div className="metric-info">
              <div className="metric-number">{formatearNumero(resumenData.totalProductos)}</div>
              <div className="metric-label">Total Productos</div>
              <div className="metric-change">
                <Badge variant="success" size="small">
                  +{resumenData.productosNuevos} nuevos
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="metric-card warning">
          <div className="metric-content">
            <div className="metric-icon">📦</div>
            <div className="metric-info">
              <div className="metric-number">{formatearNumero(resumenData.totalPedidos)}</div>
              <div className="metric-label">Total Pedidos</div>
              <div className="metric-change">
                <Badge variant="warning" size="small">
                  {resumenData.pedidosPendientes} pendientes
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="metric-card info">
          <div className="metric-content">
            <div className="metric-icon">💰</div>
            <div className="metric-info">
              <div className="metric-number">{formatearMoneda(resumenData.ingresosTotales)}</div>
              <div className="metric-label">Ingresos Totales</div>
              <div className="metric-change">
                <Badge variant="info" size="small">
                  Este mes
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <div className="quick-actions-grid">
        <Card title="Acciones Rápidas" className="quick-actions-card">
          <div className="quick-actions">
            <Button
              variant="primary"
              icon="👥"
              onClick={() => onNavigate('usuarios')}
              className="quick-action-btn"
            >
              Gestionar Usuarios
            </Button>
            <Button
              variant="success"
              icon="🛍️"
              onClick={() => onNavigate('productos')}
              className="quick-action-btn"
            >
              Gestionar Productos
            </Button>
            <Button
              variant="warning"
              icon="📋"
              onClick={() => onNavigate('reportes')}
              className="quick-action-btn"
            >
              Ver Reportes
            </Button>
            <Button
              variant="info"
              icon="📈"
              onClick={() => onNavigate('estadisticas')}
              className="quick-action-btn"
            >
              Ver Estadísticas
            </Button>
          </div>
        </Card>

        <Card title="Alertas y Notificaciones" className="alerts-card">
          <div className="alerts-list">
            <div className="alert-item warning">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <div className="alert-title">Reportes Pendientes</div>
                <div className="alert-description">
                  Tienes {resumenData.reportesPendientes} reportes pendientes de revisión
                </div>
              </div>
              <Button
                size="small"
                variant="warning"
                onClick={() => onNavigate('reportes')}
              >
                Revisar
              </Button>
            </div>

            <div className="alert-item info">
              <div className="alert-icon">📦</div>
              <div className="alert-content">
                <div className="alert-title">Pedidos Pendientes</div>
                <div className="alert-description">
                  {resumenData.pedidosPendientes} pedidos esperando procesamiento
                </div>
              </div>
              <Button
                size="small"
                variant="info"
                onClick={() => onNavigate('productos')}
              >
                Ver
              </Button>
            </div>

            <div className="alert-item success">
              <div className="alert-icon">✅</div>
              <div className="alert-content">
                <div className="alert-title">Sistema Operativo</div>
                <div className="alert-description">
                  Todos los servicios funcionando correctamente
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Estadísticas rápidas */}
      <div className="quick-stats-grid">
        <Card title="Usuarios por Rol" className="stats-card">
          <div className="role-stats">
          <div className="role-item">
            <div className="role-icon">👨‍💼</div>
            <div className="role-info">
              <div className="role-name">Administradores</div>
              <div className="role-count">{usuariosPorRol.admin}</div>
            </div>
          </div>
          <div className="role-item">
            <div className="role-icon">🌱</div>
            <div className="role-info">
              <div className="role-name">Productores</div>
              <div className="role-count">{usuariosPorRol.productor}</div>
            </div>
          </div>
          <div className="role-item">
            <div className="role-icon">🛒</div>
            <div className="role-info">
              <div className="role-name">Consumidores</div>
              <div className="role-count">{usuariosPorRol.consumidor}</div>
            </div>
          </div>
          </div>
        </Card>

        <Card title="Actividad Reciente" className="activity-card">
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">👤</div>
              <div className="activity-content">
                <div className="activity-description">Nuevo usuario registrado</div>
                <div className="activity-time">Hace 5 minutos</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🛍️</div>
              <div className="activity-content">
                <div className="activity-description">Producto agregado</div>
                <div className="activity-time">Hace 15 minutos</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📦</div>
              <div className="activity-content">
                <div className="activity-description">Pedido completado</div>
                <div className="activity-time">Hace 30 minutos</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;