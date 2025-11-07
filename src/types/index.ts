// 🎯 TIPOS CENTRALIZADOS PARA TODA LA APLICACIÓN

// ===== TIPOS DE USUARIO =====
export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'consumidor' | 'productor';
  telefono: string;
  direccion: string;
  id_ciudad: number;
  email_verificado: boolean;
  telefono_verificado: boolean;
  fecha_registro: string;
  ultimo_acceso: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  direccion: string;
  id_ciudad: string | number;
  rol?: 'consumidor' | 'productor';
}

// ===== TIPOS DE PRODUCTO =====
export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  id_usuario: number;
  id_ciudad_origen: number;
  unidadMedida?: string;
  pesoAprox?: number;
  imagenPrincipal?: string;
  imagenUrl?: string;
  fecha_creacion: string;
  disponible: boolean;
}

export interface ProductoDetallado extends Producto {
  nombre_productor: string;
  email_productor: string;
  telefono_productor: string;
  ciudad_origen: string;
  departamento_origen: string;
  region_origen: string;
  categorias?: string[];
  calificacion_promedio?: number;
  total_resenas?: number;
}

// ===== TIPOS DE ADMINISTRACIÓN =====
export interface UsuarioAdmin {
  id_usuario: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  rol: string;
  activo: boolean;
  email_verificado: boolean;
  telefono_verificado: boolean;
  fecha_registro: string;
  ultimo_acceso: string;
  ubicacion?: {
    ciudad: string;
    departamento: string;
    region: string;
  };
  estadisticas?: {
    total_productos: number;
    total_mensajes_recibidos: number;
    total_pedidos_recibidos: number;
  };
}

export interface EstadisticasGenerales {
  total_usuarios: number;
  total_productos: number;
  total_pedidos: number;
  ingresos_totales: number;
  usuarios_nuevos?: number;
  productos_nuevos?: number;
  pedidos_nuevos?: number;
  pedidos_completados?: number;
  pedidos_pendientes?: number;
  pedidos_cancelados?: number;
  ingresos_periodo?: number;
  usuarios_por_rol?: {
    admin: number;
    consumidor: number;
    productor: number;
  };
  productos_por_categoria?: Array<{
    nombre?: string;
    categoria?: string;
    cantidad?: number;
    total?: number;
  }>;
  ventas_por_mes?: Array<{
    mes: string;
    ventas: number;
  }>;
  tasa_conversion?: number;
  ticket_promedio?: number;
  productos_por_usuario?: number;
  pedidos_por_usuario?: number;
}

export interface ActividadReciente {
  id: number;
  tipo: 'usuario_registrado' | 'producto_creado' | 'pedido_realizado' | 'reporte_creado' | 'mensaje_enviado' | 'reseña_creada';
  descripcion: string;
  fecha?: string;
  timestamp?: string;
  usuario?: string;
  datos_extra?: Record<string, any>;
}

// ===== TIPOS DE REPORTES =====
export interface Reporte {
  id_reporte: number;
  id_usuario_reportante: number;
  tipo_reporte: 'producto' | 'usuario' | 'contenido' | 'producto_inapropiado' | 'usuario_inapropiado' | 'contenido_ofensivo' | 'spam' | 'fraude' | 'otro';
  id_elemento_reportado: number;
  motivo: string;
  descripcion: string;
  estado: 'pendiente' | 'en_revision' | 'resuelto' | 'rechazado';
  fecha_reporte: string;
  fecha_resolucion?: string;
  accion_tomada?: string;
}

export interface ReporteDetallado extends Reporte {
  nombre_reportador?: string;
  email_reportador?: string;
  elemento_reportado?: string;
  tipo_elemento?: string;
}

export interface FiltrosReportes {
  tipo_reporte?: string;
  estado?: string;
  orden?: string;
  descripcion?: string;
}

// ===== TIPOS DE UBICACIÓN =====
export interface Region {
  id_region: number;
  nombre: string;
}

export interface Departamento {
  id_departamento: number;
  nombre: string;
  id_region: number;
}

export interface Ciudad {
  id_ciudad: number;
  nombre: string;
  id_departamento: number;
}

// ===== TIPOS DE RESPUESTA API =====
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
    hayMasPaginas: boolean;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  usuario: User;
  session_id: string;
  expires_in: number;
}

// ===== TIPOS DE FILTROS =====
export interface FiltrosProductos {
  nombre?: string;
  precio_min?: number;
  precio_max?: number;
  stock_min?: number;
  id_usuario?: number;
  id_ciudad_origen?: number;
  unidadMedida?: string;
  disponible?: boolean;
  orden?: 'nombre_asc' | 'nombre_desc' | 'precio_asc' | 'precio_desc' | 'stock_asc' | 'stock_desc';
  limite?: number;
  pagina?: number;
}

export interface FiltrosUsuarios {
  rol?: string;
  ciudad?: number;
  departamento?: number;
  region?: number;
  activo?: boolean;
  email_verificado?: boolean;
}

// ===== TIPOS DE NAVEGACIÓN =====
export type AppView = 'welcome' | 'auth' | 'login' | 'register' | 'admin' | 'productor' | 'consumidor' | 'productos';

export interface NavigationState {
  currentView: AppView;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// ===== TIPOS DE FORMULARIOS =====
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ===== TIPOS DE NOTIFICACIONES =====
export interface Notification {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  fecha: string;
  leida: boolean;
  datos_extra?: Record<string, any>;
}

// ===== TIPOS DE CONFIGURACIÓN =====
export interface AppConfig {
  apiBaseUrl: string;
  appName: string;
  version: string;
  environment: 'development' | 'production' | 'testing';
}

// ===== TIPOS DE ERRORES =====
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}
