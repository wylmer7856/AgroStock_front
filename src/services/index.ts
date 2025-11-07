// 📦 EXPORTACIÓN CENTRALIZADA DE SERVICIOS

export { default as apiService } from './api';
export { default as authService } from './auth';
export { default as adminService } from './admin';
export { default as productosService } from './productos';
export { default as pedidosService } from './pedidos';
export { default as carritoService } from './carrito';
export { default as ubicacionesService } from './ubicaciones';

// Re-exportar tipos de servicios
export type { Pedido, DetallePedido, CrearPedidoData } from './pedidos';
export type { Carrito, ItemCarrito, AgregarAlCarritoData } from './carrito';

