// 📂 SERVICIO DE CATEGORÍAS

import apiService from './api';
import type { 
  Categoria,
  ApiResponse 
} from '../types';

class CategoriasService {
  
<<<<<<< HEAD
  // ===== LISTAR CATEGORÍAS (PÚBLICO - SIN AUTENTICACIÓN) =====
  async listarCategorias(): Promise<ApiResponse<Categoria[]>> {
    try {
      // ✅ Endpoint público - no requiere autenticación
      const response = await apiService.get<Categoria[]>(
        `/categorias`,
        false // No incluir token de autenticación
      );
      
      // Normalizar respuesta del backend
      let categoriasData: Categoria[] = [];
      if (response.success) {
        if (Array.isArray(response.data)) {
          categoriasData = response.data;
        } else if ((response as any).categorias && Array.isArray((response as any).categorias)) {
          categoriasData = (response as any).categorias;
        }
      }
      
      return {
        success: response.success,
        data: categoriasData,
        message: response.message || `${categoriasData.length} categorías encontradas`
=======
  // ===== LISTAR CATEGORÍAS =====
  async listarCategorias(): Promise<ApiResponse<Categoria[]>> {
    try {
      const response = await apiService.get<any>(
        `/categorias`
      );
      
      // El backend devuelve { success: true, categorias: [...], total: ... }
      // Necesitamos adaptarlo al formato esperado { success: true, data: [...] }
      if (response.success && (response.categorias || response.data)) {
        return {
          success: true,
          data: response.categorias || response.data,
          message: response.message || `${(response.categorias || response.data || []).length} categorías encontradas`
        };
      }
      
      return {
        success: response.success || false,
        data: response.categorias || response.data || [],
        message: response.message || 'No se encontraron categorías'
>>>>>>> 981c03b2e72622b605b6649da12a5fbfd455951e
      };
    } catch (error) {
      console.error('Error listando categorías:', error);
      throw error;
    }
  }

<<<<<<< HEAD
  // ===== OBTENER CATEGORÍA POR ID (PÚBLICO - SIN AUTENTICACIÓN) =====
  async obtenerCategoria(id: number): Promise<ApiResponse<Categoria>> {
    try {
      // ✅ Endpoint público - no requiere autenticación
      const response = await apiService.get<Categoria>(
        `/categorias/${id}`,
        false // No incluir token de autenticación
      );
      return response;
=======
  // ===== OBTENER CATEGORÍA POR ID =====
  async obtenerCategoria(id: number): Promise<ApiResponse<Categoria>> {
    try {
      const response = await apiService.get<any>(
        `/categorias/${id}`
      );
      
      // El backend devuelve { success: true, categoria: {...} }
      // Necesitamos adaptarlo al formato esperado { success: true, data: {...} }
      if (response.success && (response.categoria || response.data)) {
        return {
          success: true,
          data: response.categoria || response.data,
          message: response.message || 'Categoría encontrada'
        };
      }
      
      return {
        success: response.success || false,
        data: response.categoria || response.data,
        message: response.message || 'Categoría no encontrada'
      };
>>>>>>> 981c03b2e72622b605b6649da12a5fbfd455951e
    } catch (error) {
      console.error('Error obteniendo categoría:', error);
      throw error;
    }
  }

  // ===== CREAR CATEGORÍA (ADMIN) =====
  async crearCategoria(categoriaData: {
    nombre: string;
    descripcion?: string;
    activa?: boolean;
  }): Promise<ApiResponse<Categoria>> {
    try {
      const response = await apiService.post<Categoria>(
        `/categorias`,
        categoriaData
      );
      return response;
    } catch (error) {
      console.error('Error creando categoría:', error);
      throw error;
    }
  }

  // ===== ACTUALIZAR CATEGORÍA (ADMIN) =====
  async actualizarCategoria(id: number, categoriaData: {
    nombre?: string;
    descripcion?: string;
    activa?: boolean;
  }): Promise<ApiResponse<Categoria>> {
    try {
      const response = await apiService.put<Categoria>(
        `/categorias/${id}`,
        categoriaData
      );
      return response;
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      throw error;
    }
  }

  // ===== ELIMINAR CATEGORÍA (ADMIN) =====
  async eliminarCategoria(id: number): Promise<ApiResponse> {
    try {
      const response = await apiService.delete(
        `/categorias/${id}`
      );
      return response;
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      throw error;
    }
  }

<<<<<<< HEAD
  // ===== OBTENER PRODUCTOS POR CATEGORÍA (PÚBLICO - SIN AUTENTICACIÓN) =====
  async obtenerProductosPorCategoria(id_categoria: number): Promise<ApiResponse<any[]>> {
    try {
      // ✅ Endpoint público - no requiere autenticación
      const response = await apiService.get<any[]>(
        `/categorias/${id_categoria}/productos`,
        false // No incluir token de autenticación
=======
  // ===== OBTENER PRODUCTOS POR CATEGORÍA =====
  async obtenerProductosPorCategoria(id_categoria: number): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiService.get<any[]>(
        `/categorias/${id_categoria}/productos`
>>>>>>> 981c03b2e72622b605b6649da12a5fbfd455951e
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo productos por categoría:', error);
      throw error;
    }
  }
}

export const categoriasService = new CategoriasService();
export default categoriasService;


<<<<<<< HEAD

=======
>>>>>>> 981c03b2e72622b605b6649da12a5fbfd455951e
