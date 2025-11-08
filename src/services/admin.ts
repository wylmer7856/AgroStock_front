// 👨‍💼 SERVICIO ESPECÍFICO PARA ADMINISTRACIÓN

import apiService from './api';
import { APP_CONFIG } from '../config';
import type { 
  UsuarioAdmin, 
  EstadisticasGenerales, 
  ActividadReciente,
  ProductoDetallado,
  Reporte,
  FiltrosUsuarios,
  FiltrosProductos,
  ApiResponse 
} from '../types';

class AdminService {
  
  // ===== GESTIÓN DE USUARIOS =====
  
  // Obtener todos los usuarios con filtros
  async getUsuarios(filtros?: FiltrosUsuarios): Promise<ApiResponse<UsuarioAdmin[]>> {
    try {
      const queryString = filtros ? apiService.buildQueryString(filtros) : '';
      // ✅ Endpoint correcto del backend - AdminRouter
      const response = await apiService.get<{usuarios: UsuarioAdmin[], total: number} | UsuarioAdmin[]>(
        `/admin/usuarios${queryString}`
      );
      
      // Adaptar la respuesta según la estructura del backend
      if (response.success && Array.isArray(response.data)) {
        // Si la respuesta viene como array directo
        return {
          success: response.success,
          data: response.data as UsuarioAdmin[],
          message: response.message,
        };
      } else if (response.data && 'usuarios' in response.data) {
        // Si viene con estructura {usuarios, total}
        return {
          success: response.success,
          data: (response.data as any).usuarios || [],
          message: response.message,
          pagination: {
            total: (response.data as any).total || 0,
            pagina: 1,
            limite: 20,
            totalPaginas: Math.ceil(((response.data as any).total || 0) / 20),
            hayMasPaginas: false
          }
        };
      }
      
      return {
        success: response.success,
        data: [],
        message: response.message,
      };
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  }

  // Crear usuario manualmente
  async crearUsuario(userData: Partial<UsuarioAdmin>): Promise<ApiResponse<UsuarioAdmin>> {
    try {
      // ✅ Endpoint correcto del backend - AdminRouter
      const response = await apiService.post<UsuarioAdmin>(
        `/admin/usuarios/crear`,
        userData
      );
      return response;
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  }

  // Editar usuario
  async editarUsuario(id: number, userData: Partial<UsuarioAdmin>): Promise<ApiResponse> {
    try {
      const response = await apiService.put(
        `/admin/usuario/${id}`,
        userData
      );
      return response;
    } catch (error) {
      console.error('Error editando usuario:', error);
      throw error;
    }
  }

  // Eliminar usuario
  async eliminarUsuario(id: number): Promise<ApiResponse> {
    try {
      const response = await apiService.delete(
        `/admin/usuario/${id}`
      );
      return response;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  }

  // ===== GESTIÓN DE PRODUCTOS =====
  
  // Obtener todos los productos para admin
  async getProductos(filtros?: FiltrosProductos): Promise<ApiResponse<ProductoDetallado[]>> {
    try {
      const queryString = filtros ? apiService.buildQueryString(filtros) : '';
      // ✅ Endpoint correcto del backend - AdminRouter
      const response = await apiService.get<{productos: ProductoDetallado[], total: number} | ProductoDetallado[]>(
        `/admin/productos${queryString}`
      );
      
      // Adaptar respuesta según estructura del backend
      if (response.success && Array.isArray(response.data)) {
        return {
          success: response.success,
          data: response.data,
          message: response.message,
        };
      } else if (response.data && 'productos' in response.data) {
        return {
          success: response.success,
          data: (response.data as any).productos || [],
          message: response.message,
        };
      }
      
      return {
        success: response.success,
        data: [],
        message: response.message,
      };
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw error;
    }
  }

  // Eliminar producto inapropiado
  async eliminarProductoInapropiado(id: number, _motivo: string): Promise<ApiResponse> {
    try {
      const response = await apiService.delete(
        `/admin/producto/${id}`
      );
      return response;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw error;
    }
  }

  // ===== GESTIÓN DE REPORTES =====
  
  // Obtener todos los reportes
  async getReportes(filtros?: any): Promise<ApiResponse<Reporte[]>> {
    try {
      const queryString = filtros ? apiService.buildQueryString(filtros) : '';
      // ✅ Endpoint correcto del backend - AdminRouter
      const response = await apiService.get<{reportes: Reporte[], total: number} | Reporte[]>(
        `/admin/reportes${queryString}`
      );
      
      // Adaptar respuesta
      if (response.success && Array.isArray(response.data)) {
        return {
          success: response.success,
          data: response.data,
          message: response.message,
        };
      } else if (response.data && 'reportes' in response.data) {
        return {
          success: response.success,
          data: (response.data as any).reportes || [],
          message: response.message,
        };
      }
      
      return {
        success: response.success,
        data: [],
        message: response.message,
      };
    } catch (error) {
      console.error('Error obteniendo reportes:', error);
      throw error;
    }
  }

  // Resolver reporte
  async resolverReporte(id: number, accionTomada: string, estado: string = 'resuelto'): Promise<ApiResponse> {
    try {
      // ✅ Endpoint y parámetros correctos del backend
      const response = await apiService.put(
        `/admin/reporte/${id}`,
        { estado, accion_tomada: accionTomada }
      );
      return response;
    } catch (error) {
      console.error('Error resolviendo reporte:', error);
      throw error;
    }
  }

  // Eliminar reporte resuelto
  async eliminarReporteResuelto(id: number): Promise<ApiResponse> {
    try {
      const response = await apiService.delete(
        `/admin/reporte/${id}`
      );
      return response;
    } catch (error) {
      console.error('Error eliminando reporte:', error);
      throw error;
    }
  }

  // ===== ESTADÍSTICAS Y MÉTRICAS =====
  
  // Obtener estadísticas generales
  async getEstadisticasGenerales(periodo?: string): Promise<ApiResponse<EstadisticasGenerales>> {
    try {
      const queryString = periodo ? `?periodo=${periodo}` : '';
      // ✅ Endpoint correcto del backend - AdminRouter
      const response = await apiService.get<EstadisticasGenerales>(
        `/admin/estadisticas${queryString}`
      );
      
      // Adaptar respuesta según estructura del backend
      if (response.success && response.data) {
        return {
          success: response.success,
          data: response.data as EstadisticasGenerales,
          message: response.message,
        };
      }
      
      return {
        success: response.success,
        data: response.data as EstadisticasGenerales,
        message: response.message,
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  // Obtener actividad reciente
  async getActividadReciente(): Promise<ApiResponse<ActividadReciente[]>> {
    try {
      // ✅ Endpoint correcto del backend - AdminRouter
      const response = await apiService.get<{actividad: ActividadReciente[]} | ActividadReciente[]>(
        `/admin/actividad-reciente`
      );
      
      // Adaptar respuesta
      if (response.success && Array.isArray(response.data)) {
        return {
          success: response.success,
          data: response.data,
          message: response.message,
        };
      } else if (response.data && 'actividad' in response.data) {
        return {
          success: response.success,
          data: (response.data as any).actividad || [],
          message: response.message,
        };
      }
      
      return {
        success: response.success,
        data: [],
        message: response.message,
      };
    } catch (error) {
      console.error('Error obteniendo actividad reciente:', error);
      throw error;
    }
  }

  // ===== ACCESO A PANELES =====
  
  // Acceder a panel de productor
  async accederPanelProductor(idUsuario: number): Promise<ApiResponse> {
    try {
      const response = await apiService.get(
        `${APP_CONFIG.API_ENDPOINTS.ADMIN.USUARIOS}/${idUsuario}/productor`
      );
      return response;
    } catch (error) {
      console.error('Error accediendo a panel de productor:', error);
      throw error;
    }
  }

  // Acceder a panel de consumidor
  async accederPanelConsumidor(idUsuario: number): Promise<ApiResponse> {
    try {
      const response = await apiService.get(
        `${APP_CONFIG.API_ENDPOINTS.ADMIN.USUARIOS}/${idUsuario}/consumidor`
      );
      return response;
    } catch (error) {
      console.error('Error accediendo a panel de consumidor:', error);
      throw error;
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====
  
  // Obtener métricas del dashboard
  async getDashboardMetrics(): Promise<{
    usuarios: ApiResponse<UsuarioAdmin[]>;
    productos: ApiResponse<ProductoDetallado[]>;
    reportes: ApiResponse<Reporte[]>;
    estadisticas: ApiResponse<EstadisticasGenerales>;
    actividad: ApiResponse<ActividadReciente[]>;
  }> {
    try {
      const [usuarios, productos, reportes, estadisticas, actividad] = await Promise.all([
        this.getUsuarios(),
        this.getProductos(),
        this.getReportes(),
        this.getEstadisticasGenerales(),
        this.getActividadReciente()
      ]);

      return {
        usuarios,
        productos,
        reportes,
        estadisticas,
        actividad
      };
    } catch (error) {
      console.error('Error obteniendo métricas del dashboard:', error);
      throw error;
    }
  }

  // Exportar datos (para futuras implementaciones)
  async exportarDatos(tipo: 'usuarios' | 'productos' | 'reportes'): Promise<Blob> {
    try {
      const response = await fetch(
        `${APP_CONFIG.API_BASE_URL}/admin/export/${tipo}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(apiService.isAuthenticated() && {
              'Authorization': `Bearer ${localStorage.getItem(APP_CONFIG.AUTH.TOKEN_KEY)}`
            })
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error exportando datos');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error exportando datos:', error);
      throw error;
    }
  }
}

// Instancia singleton del servicio de administración
export const adminService = new AdminService();
export default adminService;
