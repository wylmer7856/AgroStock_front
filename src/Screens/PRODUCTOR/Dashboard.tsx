// 🌾 DASHBOARD DEL PRODUCTOR - GESTIÓN DE PRODUCTOS Y VENTAS

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Button, Badge, Loading, Toast } from '../../components/ReusableComponents';
import AgroStockLogo from '../../components/AgroStockLogo';
import { productosService, pedidosService, productoresService } from '../../services';
import type { Producto, ProductorProfile } from '../../types';
import PerfilProductor from './PerfilProductor';
import './ProductorDashboard.css';

interface ProductorDashboardProps {
  onNavigate?: (view: string) => void;
}

export const ProductorDashboard: React.FC<ProductorDashboardProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'overview' | 'productos' | 'pedidos' | 'nuevo-producto' | 'perfil'>('overview');
  const [perfilProductor, setPerfilProductor] = useState<ProductorProfile | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const userId = user?.id_usuario || user?.id;
      if (userId) {
        const [productosRes, pedidosRes, perfilRes] = await Promise.all([
          productosService.obtenerProductosPorUsuario(userId),
          pedidosService.obtenerMisPedidos('productor', userId),
          productoresService.obtenerMiPerfil()
        ]);
        
        if (productosRes.success && productosRes.data) {
          setProductos(productosRes.data);
        }
        
        if (pedidosRes.success && pedidosRes.data) {
          setPedidos(pedidosRes.data);
        }

        if (perfilRes.success && perfilRes.data) {
          setPerfilProductor(perfilRes.data);
        }
      }
    } catch (error) {
      mostrarToast('Error cargando datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mostrarToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleEliminarProducto = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      const response = await productosService.eliminarProducto(id);
      if (response.success) {
        mostrarToast('Producto eliminado exitosamente', 'success');
        cargarDatos();
      }
    } catch (error) {
      mostrarToast('Error eliminando producto', 'error');
    }
  };

  const handleActualizarEstadoPedido = async (id: number, estado: string) => {
    try {
      const response = await pedidosService.actualizarEstado(id, estado as any);
      if (response.success) {
        mostrarToast('Estado del pedido actualizado', 'success');
        cargarDatos();
      }
    } catch (error) {
      mostrarToast('Error actualizando pedido', 'error');
    }
  };

  const renderOverview = () => {
    const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;
    const pedidosConfirmados = pedidos.filter(p => p.estado === 'confirmado').length;
    const totalVentas = pedidos
      .filter(p => p.estado === 'comprado' || p.estado === 'entregado')
      .reduce((sum, p) => sum + (p.total || 0), 0);

    return (
      <div className="productor-overview">
        <div className="overview-header">
          <h2>📊 Resumen</h2>
          {!perfilProductor && (
            <Button onClick={() => setCurrentView('perfil')} variant="primary">
              ✏️ Completar Perfil
            </Button>
          )}
        </div>

        {perfilProductor && (
          <Card className="perfil-resumen">
            <h3>🌾 {perfilProductor.nombre_finca || 'Mi Finca'}</h3>
            <div className="perfil-info-grid">
              <div>
                <strong>Tipo:</strong> {perfilProductor.tipo_productor || 'No especificado'}
              </div>
              {perfilProductor.departamento_nombre && (
                <div>
                  <strong>Ubicación:</strong> {perfilProductor.vereda ? `${perfilProductor.vereda}, ` : ''}
                  {perfilProductor.ciudad_nombre}, {perfilProductor.departamento_nombre}
                </div>
              )}
              {perfilProductor.numero_registro_ica && (
                <div>
                  <strong>Registro ICA:</strong> {perfilProductor.numero_registro_ica}
                </div>
              )}
              {perfilProductor.certificaciones && (
                <div>
                  <strong>Certificaciones:</strong> {perfilProductor.certificaciones}
                </div>
              )}
            </div>
            <Button onClick={() => setCurrentView('perfil')} variant="secondary" size="small">
              Editar Perfil
            </Button>
          </Card>
        )}
        
        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-icon">🛍️</div>
            <div className="stat-value">{productos.length}</div>
            <div className="stat-label">Productos Activos</div>
          </Card>
          
          <Card className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-value">{pedidosPendientes}</div>
            <div className="stat-label">Pedidos Pendientes</div>
          </Card>
          
          <Card className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{pedidosConfirmados}</div>
            <div className="stat-label">Pedidos Confirmados</div>
          </Card>
          
          <Card className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">${totalVentas.toLocaleString()}</div>
            <div className="stat-label">Total Ventas</div>
          </Card>
        </div>

        <div className="recent-section">
          <h3>Productos Recientes</h3>
          <div className="productos-list">
            {productos.slice(0, 5).map(producto => (
              <Card key={producto.id_producto} className="producto-card">
                <div className="producto-info">
                  <h4>{producto.nombre}</h4>
                  <p>Stock: {producto.stock} {producto.unidad_medida}</p>
                  <p>Precio: ${producto.precio?.toLocaleString()}</p>
                </div>
                <Badge 
                  variant={producto.disponible ? 'success' : 'warning'}
                >
                  {producto.disponible ? 'Disponible' : 'Agotado'}
                </Badge>
              </Card>
            ))}
            {productos.length === 0 && (
              <p>No tienes productos aún. ¡Crea tu primer producto!</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProductos = () => {
    return (
      <div className="productos-view">
        <div className="view-header">
          <h2>Mis Productos</h2>
          <Button onClick={() => setCurrentView('nuevo-producto')}>
            ➕ Crear Producto
          </Button>
        </div>

        <div className="productos-grid">
          {productos.map(producto => (
            <Card key={producto.id_producto} className="producto-card-detalle">
              {producto.imagen_principal && (
                <img 
                  src={producto.imagen_principal} 
                  alt={producto.nombre}
                  className="producto-imagen"
                />
              )}
              <div className="producto-detalle">
                <h3>{producto.nombre}</h3>
                <p>{producto.descripcion}</p>
                <div className="producto-meta">
                  <span>💰 ${producto.precio?.toLocaleString()}</span>
                  <span>📦 Stock: {producto.stock} {producto.unidad_medida}</span>
                  <span>⚠️ Mínimo: {producto.stock_minimo}</span>
                </div>
                <div className="producto-actions">
                  <Button variant="secondary" size="small">
                    ✏️ Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="small"
                    onClick={() => handleEliminarProducto(producto.id_producto)}
                  >
                    🗑️ Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {productos.length === 0 && (
            <p>No tienes productos. ¡Crea tu primer producto!</p>
          )}
        </div>
      </div>
    );
  };

  const renderPedidos = () => {
    return (
      <div className="pedidos-view">
        <h2>Mis Pedidos</h2>
        
        <div className="pedidos-list">
          {pedidos.map(pedido => (
            <Card key={pedido.id_pedido} className="pedido-card">
              <div className="pedido-header">
                <div>
                  <h3>Pedido #{pedido.id_pedido}</h3>
                  <p>Fecha: {new Date(pedido.fecha_pedido || Date.now()).toLocaleDateString()}</p>
                </div>
                <Badge variant={
                  pedido.estado === 'entregado' ? 'success' :
                  pedido.estado === 'en_camino' ? 'info' :
                  pedido.estado === 'confirmado' ? 'warning' :
                  pedido.estado === 'pendiente' ? 'warning' : 'default'
                }>
                  {pedido.estado}
                </Badge>
              </div>
              
              <div className="pedido-info">
                <p><strong>Total:</strong> ${pedido.total?.toLocaleString()}</p>
                <p><strong>Dirección:</strong> {pedido.direccion_entrega}</p>
                <p><strong>Método de pago:</strong> {pedido.metodo_pago}</p>
                <p><strong>Estado pago:</strong> {pedido.estado_pago || 'pendiente'}</p>
              </div>

              {pedido.estado === 'pendiente' && (
                <div className="pedido-actions">
                  <Button 
                    variant="success" 
                    size="small"
                    onClick={() => handleActualizarEstadoPedido(pedido.id_pedido, 'confirmado')}
                  >
                    ✅ Confirmar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="small"
                    onClick={() => handleActualizarEstadoPedido(pedido.id_pedido, 'cancelado')}
                  >
                    ❌ Rechazar
                  </Button>
                </div>
              )}
              
              {pedido.estado === 'confirmado' && (
                <div className="pedido-actions">
                  <Button 
                    variant="info" 
                    size="small"
                    onClick={() => handleActualizarEstadoPedido(pedido.id_pedido, 'en_preparacion')}
                  >
                    📦 En Preparación
                  </Button>
                </div>
              )}
              
              {pedido.estado === 'en_preparacion' && (
                <div className="pedido-actions">
                  <Button 
                    variant="info" 
                    size="small"
                    onClick={() => handleActualizarEstadoPedido(pedido.id_pedido, 'en_camino')}
                  >
                    🚚 En Camino
                  </Button>
                </div>
              )}
              
              {pedido.estado === 'en_camino' && (
                <div className="pedido-actions">
                  <Button 
                    variant="success" 
                    size="small"
                    onClick={() => handleActualizarEstadoPedido(pedido.id_pedido, 'entregado')}
                  >
                    ✅ Marcar Entregado
                  </Button>
                </div>
              )}
            </Card>
          ))}
          {pedidos.length === 0 && (
            <p>No tienes pedidos aún.</p>
          )}
        </div>
      </div>
    );
  };

  const renderNuevoProducto = () => {
    return (
      <div className="nuevo-producto-view">
        <h2>Crear Nuevo Producto</h2>
        <p>Formulario de creación de producto en desarrollo...</p>
        <Button onClick={() => setCurrentView('productos')}>
          ← Volver a Productos
        </Button>
      </div>
    );
  };

  const renderPerfil = () => {
    return (
      <PerfilProductor
        onClose={() => {
          setCurrentView('overview');
          cargarDatos(); // Recargar datos después de guardar
        }}
      />
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'productos':
        return renderProductos();
      case 'pedidos':
        return renderPedidos();
      case 'nuevo-producto':
        return renderNuevoProducto();
      case 'perfil':
        return renderPerfil();
      case 'overview':
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return <Loading message="Cargando dashboard..." />;
  }

  return (
    <div className="productor-dashboard">
      <div className="productor-sidebar">
        <div className="sidebar-header">
          <AgroStockLogo size="small" variant="full" />
          <span className="panel-text">Panel Productor</span>
        </div>
        
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${currentView === 'overview' ? 'active' : ''}`}
            onClick={() => setCurrentView('overview')}
          >
            📊 Resumen
          </button>
          <button
            className={`nav-item ${currentView === 'perfil' ? 'active' : ''}`}
            onClick={() => setCurrentView('perfil')}
          >
            🌾 Mi Perfil
          </button>
          <button
            className={`nav-item ${currentView === 'productos' ? 'active' : ''}`}
            onClick={() => setCurrentView('productos')}
          >
            🛍️ Mis Productos
          </button>
          <button
            className={`nav-item ${currentView === 'pedidos' ? 'active' : ''}`}
            onClick={() => setCurrentView('pedidos')}
          >
            📦 Mis Pedidos
          </button>
        </nav>

        <div className="sidebar-footer">
          <Button variant="danger" onClick={logout}>
            🚪 Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="productor-main">
        <div className="main-header">
          <h1>Bienvenido, {user?.nombre}</h1>
        </div>
        
        <main className="main-content">
          {renderCurrentView()}
        </main>
      </div>

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

export default ProductorDashboard;


