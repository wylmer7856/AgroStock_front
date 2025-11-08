// 🎯 TIPOS CENTRALIZADOS PARA TODA LA APLICACIÓN

// ===== TIPOS DE USUARIO =====
export interface User {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'consumidor' | 'productor';
  telefono: string | null;
  direccion: string | null;
  id_ciudad: number | null;
  activo: boolean;
  email_verificado: boolean;
  foto_perfil?: string | null;
  fecha_registro: string | null;
  ultimo_acceso: string | null;
  // Compatibilidad
  id?: number;
}

// Tipo de productor extendido
export interface ProductorProfile {
  id_productor?: number | null;
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
  redes_sociales?: any | null; // JSON
  sitio_web?: string | null;
  foto_perfil_finca?: string | null;
  activo?: boolean;
  fecha_creacion?: string | null;
  fecha_actualizacion?: string | null;
  // Campos de la vista completa
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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  id_ciudad?: number | null;
  rol: 'consumidor' | 'productor';
}

// ===== TIPOS DE PRODUCTO =====
export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  stock: number;
  stock_minimo: number;
  unidad_medida: string;
  id_usuario: number;
  id_categoria?: number | null;
  id_ciudad_origen?: number | null;
  imagen_principal?: string | null;
  imagenes_adicionales?: string | string[] | null; // JSON array
  disponible: boolean;
  fecha_creacion?: string | null;
  fecha_actualizacion?: string | null;
  // Campos adicionales de respuesta (no en BD)
  categoria_nombre?: string;
  categoria_imagen?: string;
  nombre_productor?: string;
  imagenUrl?: string | null; // URL completa de la imagen construida por el backend
}

export interface ProductoDetallado extends Producto {
  nombre_productor?: string;
  email_productor?: string;
  telefono_productor?: string;
  foto_productor?: string;
  ciudad_origen?: string;
  departamento_origen?: string;
  region_origen?: string;
  categoria_nombre?: string;
  categoria_imagen?: string;
  calificacion_promedio?: number;
  total_resenas?: number;
}

// ===== TIPOS DE ADMINISTRACIÓN =====
export interface UsuarioAdmin {
  id_usuario: number;
  nombre: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  id_ciudad: number | null;
  rol: 'admin' | 'consumidor' | 'productor';
  activo: boolean;
  email_verificado: boolean;
  foto_perfil?: string | null;
  fecha_registro: string | null;
  ultimo_acceso: string | null;
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
  id_region: number | null;
}

export interface Ciudad {
  id_ciudad: number;
  nombre: string;
  id_departamento: number | null;
}

// ===== TIPOS DE CATEGORÍAS =====
export interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion?: string | null;
  imagen_url?: string | null;
  activa: boolean;
}

// ===== TIPOS DE MENSAJES =====
export interface Mensaje {
  id_mensaje: number;
  id_remitente: number;
  id_destinatario: number;
  id_producto?: number | null;
  asunto: string;
  mensaje: string;
  fecha_envio: string;
  leido: boolean;
  tipo_mensaje: 'consulta' | 'pedido' | 'general';
  nombre_remitente?: string;
  email_remitente?: string;
  nombre_destinatario?: string;
  email_destinatario?: string;
  nombre_producto?: string;
}

// ===== TIPOS DE RESEÑAS =====
export interface Resena {
  id_resena: number;
  id_usuario: number | null;
  id_producto: number | null;
  id_pedido: number;
  comentario?: string | null;
  calificacion: number | null; // 1-5
  fecha: string;
  nombre_usuario?: string;
  nombre_producto?: string;
}

// ===== TIPOS DE PEDIDOS =====
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
  id_categoria?: number;
  id_ciudad_origen?: number;
  unidad_medida?: string;
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
