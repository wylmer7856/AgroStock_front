// 📦 SERVICIO DE PEDIDOS

import apiService from './api';
import type { 
  ApiResponse 
} from '../types';

export interface Pedido {
  id_pedido: number;
  id_consumidor: number;
  id_productor: number;
  fecha: string;
  estado: 'pendiente' | 'confirmado' | 'comprado' | 'cancelado' | 'enviado' | 'entregado';
  total: number;
  direccionEntrega: string;
  notas: string;
  fecha_entrega_estimada: string;
  metodo_pago: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface DetallePedido {
  id_detalle: number;
  id_pedido: number;
  id_producto: number;
  precio_unitario: number;
  cantidad: number;
  Precio_total: string;
  producto?: {
    nombre: string;
    imagenPrincipal?: string;
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
  direccionEntrega: string;
  notas?: string;
  fecha_entrega_estimada: string;
  metodo_pago: string;
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
  async obtenerMisPedidos(tipo: 'consumidor' | 'productor'): Promise<ApiResponse<Pedido[]>> {
    try {
      const endpoint = tipo === 'consumidor' ? '/pedidos/mis-pedidos' : '/pedidos/mis-ventas';
      const response = await apiService.get<Pedido[]>(endpoint);
      return response;
    } catch (error) {
      console.error('Error obteniendo mis pedidos:', error);
      throw error;
    }
  }
}

export const pedidosService = new PedidosService();
export default pedidosService;

