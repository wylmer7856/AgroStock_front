// 🛒 DASHBOARD DEL CONSUMIDOR - EXPLORACIÓN Y COMPRAS

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Button, Badge, Loading, Toast } from '../../components/ReusableComponents';
import AgroStockLogo from '../../components/AgroStockLogo';
import { productosService, carritoService, pedidosService } from '../../services';
import type { Producto } from '../../types';
import './ConsumidorDashboard.css';

interface ConsumidorDashboardProps {
  onNavigate?: (view: string) => void;
}

export const ConsumidorDashboard: React.FC<ConsumidorDashboardProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'catalogo' | 'carrito' | 'pedidos' | 'perfil'>('catalogo');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [productosRes, carritoRes, pedidosRes] = await Promise.all([
        productosService.obtenerProductosDisponibles(),
        carritoService.obtenerCarrito(),
        pedidosService.obtenerMisPedidos('consumidor')
      ]);
      
      if (productosRes.success && productosRes.data) {
        setProductos(productosRes.data);
      }
      
      if (carritoRes.success && carritoRes.data) {
        setCarrito(carritoRes.data);
      }
      
      if (pedidosRes.success && pedidosRes.data) {
        setPedidos(pedidosRes.data);
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

  const handleAgregarAlCarrito = async (idProducto: number) => {
    try {
      const response = await carritoService.agregarAlCarrito({
        id_producto: idProducto,
        cantidad: 1
      });
      if (response.success) {
        mostrarToast('Producto agregado al carrito', 'success');
        cargarDatos();
      }
    } catch (error) {
      mostrarToast('Error agregando al carrito', 'error');
    }
  };

  const handleActualizarCantidad = async (id: number, cantidad: number) => {
    try {
      const response = await carritoService.actualizarItem(id, cantidad);
      if (response.success) {
        mostrarToast('Carrito actualizado', 'success');
        cargarDatos();
      }
    } catch (error) {
      mostrarToast('Error actualizando carrito', 'error');
    }
  };

  const handleEliminarDelCarrito = async (id: number) => {
    try {
      const response = await carritoService.eliminarItem(id);
      if (response.success) {
        mostrarToast('Producto eliminado del carrito', 'success');
        cargarDatos();
      }
    } catch (error) {
      mostrarToast('Error eliminando del carrito', 'error');
    }
  };

  const handleCheckout = async () => {
    if (!carrito || carrito.items.length === 0) {
      mostrarToast('El carrito está vacío', 'error');
      return;
    }

    try {
      const response = await carritoService.checkout({
        direccionEntrega: user?.direccion || '',
        fecha_entrega_estimada: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        metodo_pago: 'efectivo'
      });
      
      if (response.success) {
        mostrarToast('Pedido realizado exitosamente', 'success');
        cargarDatos();
        setCurrentView('pedidos');
      }
    } catch (error) {
      mostrarToast('Error procesando pedido', 'error');
    }
  };

  const productosFiltrados = productos.filter(p => 
    busqueda === '' || 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderCatalogo = () => {
    return (
      <div className="catalogo-view">
        <div className="catalogo-header">
          <h2>Catálogo de Productos</h2>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="productos-grid">
          {productosFiltrados.map(producto => (
            <Card key={producto.id_producto} className="producto-card">
              {producto.imagenPrincipal && (
                <img 
                  src={producto.imagenPrincipal} 
                  alt={producto.nombre}
                  className="producto-imagen"
                />
              )}
              <div className="producto-info">
                <h3>{producto.nombre}</h3>
                <p className="producto-descripcion">{producto.descripcion}</p>
                <div className="producto-precio">
                  ${producto.precio?.toLocaleString()}
                </div>
                <div className="producto-stock">
                  Stock: {producto.stock} {producto.unidadMedida}
                </div>
                <Button 
                  onClick={() => handleAgregarAlCarrito(producto.id_producto)}
                  disabled={!producto.disponible || producto.stock === 0}
                >
                  🛒 Agregar al Carrito
                </Button>
              </div>
            </Card>
          ))}
          {productosFiltrados.length === 0 && (
            <p>No se encontraron productos.</p>
          )}
        </div>
      </div>
    );
  };

  const renderCarrito = () => {
    if (!carrito || !carrito.items || carrito.items.length === 0) {
      return (
        <div className="carrito-vacio">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos desde el catálogo</p>
          <Button onClick={() => setCurrentView('catalogo')}>
            Ir al Catálogo
          </Button>
        </div>
      );
    }

    return (
      <div className="carrito-view">
        <h2>Mi Carrito de Compras</h2>
        
        <div className="carrito-items">
          {carrito.items.map((item: any) => (
            <Card key={item.id_item || item.id_producto} className="carrito-item">
              <div className="item-info">
                <h4>{item.producto?.nombre || 'Producto'}</h4>
                <p>Precio unitario: ${item.precio_unitario?.toLocaleString()}</p>
              </div>
              <div className="item-cantidad">
                <Button 
                  size="small"
                  onClick={() => handleActualizarCantidad(item.id_item, item.cantidad - 1)}
                >
                  ➖
                </Button>
                <span>{item.cantidad}</span>
                <Button 
                  size="small"
                  onClick={() => handleActualizarCantidad(item.id_item, item.cantidad + 1)}
                >
                  ➕
                </Button>
              </div>
              <div className="item-total">
                ${(item.precio_unitario * item.cantidad).toLocaleString()}
              </div>
              <Button 
                variant="danger" 
                size="small"
                onClick={() => handleEliminarDelCarrito(item.id_item)}
              >
                🗑️
              </Button>
            </Card>
          ))}
        </div>

        <div className="carrito-total">
          <Card>
            <div className="total-info">
              <h3>Total: ${carrito.total?.toLocaleString() || '0'}</h3>
              <p>{carrito.total_items || 0} items</p>
            </div>
            <Button variant="success" onClick={handleCheckout}>
              💳 Proceder al Pago
            </Button>
          </Card>
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
                  <p>Fecha: {new Date(pedido.fecha).toLocaleDateString()}</p>
                </div>
                <Badge variant={
                  pedido.estado === 'entregado' ? 'success' :
                  pedido.estado === 'enviado' ? 'info' :
                  pedido.estado === 'confirmado' ? 'warning' : 'default'
                }>
                  {pedido.estado}
                </Badge>
              </div>
              
              <div className="pedido-info">
                <p><strong>Total:</strong> ${pedido.total?.toLocaleString()}</p>
                <p><strong>Dirección:</strong> {pedido.direccionEntrega}</p>
                <p><strong>Fecha estimada:</strong> {new Date(pedido.fecha_entrega_estimada).toLocaleDateString()}</p>
              </div>
            </Card>
          ))}
          {pedidos.length === 0 && (
            <p>No has realizado pedidos aún.</p>
          )}
        </div>
      </div>
    );
  };

  const renderPerfil = () => {
    return (
      <div className="perfil-view">
        <h2>Mi Perfil</h2>
        <Card>
          <div className="perfil-info">
            <p><strong>Nombre:</strong> {user?.nombre}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Teléfono:</strong> {user?.telefono}</p>
            <p><strong>Dirección:</strong> {user?.direccion}</p>
          </div>
        </Card>
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'carrito':
        return renderCarrito();
      case 'pedidos':
        return renderPedidos();
      case 'perfil':
        return renderPerfil();
      case 'catalogo':
      default:
        return renderCatalogo();
    }
  };

  if (loading) {
    return <Loading message="Cargando..." />;
  }

  return (
    <div className="consumidor-dashboard">
      <div className="consumidor-sidebar">
        <div className="sidebar-header">
          <AgroStockLogo size="small" variant="full" />
          <span className="panel-text">Panel Consumidor</span>
        </div>
        
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${currentView === 'catalogo' ? 'active' : ''}`}
            onClick={() => setCurrentView('catalogo')}
          >
            🛍️ Catálogo
          </button>
          <button
            className={`nav-item ${currentView === 'carrito' ? 'active' : ''}`}
            onClick={() => setCurrentView('carrito')}
          >
            🛒 Carrito {carrito && carrito.total_items > 0 && `(${carrito.total_items})`}
          </button>
          <button
            className={`nav-item ${currentView === 'pedidos' ? 'active' : ''}`}
            onClick={() => setCurrentView('pedidos')}
          >
            📦 Mis Pedidos
          </button>
          <button
            className={`nav-item ${currentView === 'perfil' ? 'active' : ''}`}
            onClick={() => setCurrentView('perfil')}
          >
            👤 Mi Perfil
          </button>
        </nav>

        <div className="sidebar-footer">
          <Button variant="danger" onClick={logout}>
            🚪 Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="consumidor-main">
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

export default ConsumidorDashboard;

