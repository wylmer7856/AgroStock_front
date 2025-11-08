// 📦 SERVICIO DE PEDIDOS

import apiService from './api';
import type { 
  ApiResponse 
} from '../types';

export interface Pedido {
  id_pedido: number;
  id_consumidor: number;
  id_productor: number;
  total: number;
  estado: 'pendiente' | 'confirmado' | 'en_preparacion' | 'en_camino' | 'entregado' | 'cancelado';
  direccion_entrega: string;
  id_ciudad_entrega?: number | null;
  metodo_pago: 'efectivo' | 'transferencia' | 'nequi' | 'daviplata' | 'pse' | 'tarjeta';
  estado_pago?: 'pendiente' | 'pagado' | 'reembolsado';
  notas?: string | null;
  fecha_pedido?: string | null;
  fecha_entrega?: string | null;
}

export interface DetallePedido {
  id_detalle: number;
  id_pedido: number;
  id_producto: number;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
  producto?: {
    nombre: string;
    imagen_principal?: string;
    descripcion?: string;
  };
}

export interface CrearPedidoData {
  id_consumidor: number;
  id_productor: number;
  productos: Array<{
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
  }>;
  direccion_entrega: string;
  id_ciudad_entrega?: number;
  notas?: string;
  metodo_pago: 'efectivo' | 'transferencia' | 'nequi' | 'daviplata' | 'pse' | 'tarjeta';
}

class PedidosService {
  
  // ===== LISTAR PEDIDOS =====
  async listarPedidos(filtros?: {
    id_consumidor?: number;
    id_productor?: number;
    estado?: string;
  }): Promise<ApiResponse<Pedido[]>> {
    try {
      const queryString = filtros ? apiService.buildQueryString(filtros) : '';
      const response = await apiService.get<Pedido[]>(
        `/pedidos${queryString}`
      );
      return response;
    } catch (error) {
      console.error('Error listando pedidos:', error);
      throw error;
    }
  }

  // ===== OBTENER PEDIDO POR ID =====
  async obtenerPedido(id: number): Promise<ApiResponse<Pedido & { detalles: DetallePedido[] }>> {
    try {
      const response = await apiService.get<Pedido & { detalles: DetallePedido[] }>(
        `/pedidos/${id}`
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo pedido:', error);
      throw error;
    }
  }

  // ===== CREAR PEDIDO =====
  async crearPedido(pedidoData: CrearPedidoData): Promise<ApiResponse<Pedido>> {
    try {
      const response = await apiService.post<Pedido>(
        `/pedidos`,
        pedidoData
      );
      return response;
    } catch (error) {
      console.error('Error creando pedido:', error);
      throw error;
    }
  }

  // ===== ACTUALIZAR ESTADO DEL PEDIDO =====
  async actualizarEstado(id: number, estado: Pedido['estado']): Promise<ApiResponse<Pedido>> {
    try {
      const response = await apiService.put<Pedido>(
        `/pedidos/${id}`,
        { estado }
      );
      return response;
    } catch (error) {
      console.error('Error actualizando estado del pedido:', error);
      throw error;
    }
  }

  // ===== CANCELAR PEDIDO =====
  async cancelarPedido(id: number): Promise<ApiResponse> {
    try {
      const response = await apiService.put(
        `/pedidos/${id}/cancelar`,
        {}
      );
      return response;
    } catch (error) {
      console.error('Error cancelando pedido:', error);
      throw error;
    }
  }

  // ===== OBTENER PEDIDOS DEL USUARIO ACTUAL =====
  async obtenerMisPedidos(tipo: 'consumidor' | 'productor', userId?: number): Promise<ApiResponse<Pedido[]>> {
    try {
<<<<<<< HEAD
      // Obtener todos los pedidos (el backend filtra por usuario autenticado)
      const response = await apiService.get<Pedido[]>('/pedidos');
      
      if (response.success && response.data && userId) {
        // Filtrar según el tipo y el ID del usuario
        const pedidosFiltrados = response.data.filter((pedido: Pedido) => {
          if (tipo === 'consumidor') {
            return pedido.id_consumidor === userId;
          } else {
            return pedido.id_productor === userId;
          }
        });
        
        return {
          ...response,
          data: pedidosFiltrados
        };
      }
      
=======
      // Usar el endpoint específico para obtener mis pedidos (el backend filtra automáticamente por usuario autenticado)
      const response = await apiService.get<Pedido[]>('/pedidos/mis-pedidos');
>>>>>>> 981c03b2e72622b605b6649da12a5fbfd455951e
      return response;
    } catch (error) {
      console.error('Error obteniendo mis pedidos:', error);
      throw error;
    }
  }
}

export const pedidosService = new PedidosService();
export default pedidosService;


