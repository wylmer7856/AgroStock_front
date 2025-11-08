// 🌾 SERVICIO DE PRODUCTORES
import apiService from './api';

export interface Productor {
  id_productor?: number;
  id_usuario: number;
  nombre_finca?: string | null;
  tipo_productor?: 'agricultor' | 'ganadero' | 'apicultor' | 'piscicultor' | 'avicultor' | 'mixto' | 'otro';
  id_departamento?: number | null;
  id_ciudad?: number | null;
  vereda?: string | null;
  direccion_finca?: string | null;
  numero_registro_ica?: string | null;
  certificaciones?: string | null;
  descripcion_actividad?: string | null;
  anos_experiencia?: number | null;
  hectareas?: number | null;
  metodo_produccion?: 'tradicional' | 'organico' | 'convencional' | 'mixto';
  redes_sociales?: any | null;
  sitio_web?: string | null;
  foto_perfil_finca?: string | null;
  activo?: boolean;
  // Campos adicionales de la vista
  nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad_nombre?: string;
  departamento_nombre?: string;
  region_nombre?: string;
  total_productos_activos?: number;
  total_pedidos_recibidos?: number;
}

export interface CrearProductorData {
  nombre_finca?: string;
  tipo_productor?: 'agricultor' | 'ganadero' | 'apicultor' | 'piscicultor' | 'avicultor' | 'mixto' | 'otro';
  id_departamento?: number;
  id_ciudad?: number;
  vereda?: string;
  direccion_finca?: string;
  numero_registro_ica?: string;
  certificaciones?: string;
  descripcion_actividad?: string;
  anos_experiencia?: number;
  hectareas?: number;
  metodo_produccion?: 'tradicional' | 'organico' | 'convencional' | 'mixto';
  redes_sociales?: any;
  sitio_web?: string;
  foto_perfil_finca?: string;
}

const productoresService = {
  // Obtener mi perfil de productor
  async obtenerMiPerfil(): Promise<{ success: boolean; data?: Productor; message?: string }> {
    try {
      const response = await apiService.get('/productores/mi-perfil');
      return response;
    } catch (error: any) {
      console.error('Error obteniendo mi perfil:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener tu perfil'
      };
    }
  },

  // Obtener perfil de productor por ID de usuario
  async obtenerPorUsuario(idUsuario: number): Promise<{ success: boolean; data?: Productor; message?: string }> {
    try {
      const response = await apiService.get(`/productores/usuario/${idUsuario}`);
      return response;
    } catch (error: any) {
      console.error('Error obteniendo perfil de productor:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener perfil de productor'
      };
    }
  },

  // Listar todos los productores
  async listarProductores(filtros?: {
    tipo_productor?: string;
    departamento?: number;
    ciudad?: number;
    nombre_finca?: string;
    certificaciones?: string;
  }): Promise<{ success: boolean; data?: Productor[]; message?: string; total?: number }> {
    try {
      const params = new URLSearchParams();
      if (filtros) {
        Object.entries(filtros).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      
      const queryString = params.toString();
      const url = queryString ? `/productores?${queryString}` : '/productores';
      const response = await apiService.get(url);
      return response;
    } catch (error: any) {
      console.error('Error listando productores:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al listar productores'
      };
    }
  },

  // Crear o actualizar perfil de productor
  async guardarPerfil(datos: CrearProductorData): Promise<{ success: boolean; data?: Productor; message?: string }> {
    try {
      const response = await apiService.post('/productores', datos);
      return response;
    } catch (error: any) {
      console.error('Error guardando perfil:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al guardar perfil'
      };
    }
  },

  // Actualizar perfil de productor
  async actualizarPerfil(idProductor: number, datos: Partial<CrearProductorData>): Promise<{ success: boolean; data?: Productor; message?: string }> {
    try {
      const response = await apiService.put(`/productores/${idProductor}`, datos);
      return response;
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar perfil'
      };
    }
  }
};

export default productoresService;




