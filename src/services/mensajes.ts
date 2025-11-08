// 💬 SERVICIO DE MENSAJES

import apiService from './api';
import type { 
  Mensaje,
  ApiResponse 
} from '../types';

class MensajesService {
  
  // ===== ENVIAR MENSAJE =====
  async enviarMensaje(mensajeData: {
    id_destinatario: number;
    id_producto?: number;
    asunto: string;
    mensaje: string;
    tipo_mensaje?: 'consulta' | 'pedido' | 'general';
  }): Promise<ApiResponse<Mensaje>> {
    try {
      const response = await apiService.post<Mensaje>(
        `/mensajes/enviar`,
        mensajeData
      );
      return response;
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      throw error;
    }
  }

  // ===== OBTENER MENSAJES RECIBIDOS =====
  async obtenerMensajesRecibidos(): Promise<ApiResponse<Mensaje[]>> {
    try {
      const response = await apiService.get<Mensaje[]>(
        `/mensajes/recibidos`
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo mensajes recibidos:', error);
      throw error;
    }
  }

  // ===== OBTENER MENSAJES ENVIADOS =====
  async obtenerMensajesEnviados(): Promise<ApiResponse<Mensaje[]>> {
    try {
      const response = await apiService.get<Mensaje[]>(
        `/mensajes/enviados`
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo mensajes enviados:', error);
      throw error;
    }
  }

  // ===== MARCAR MENSAJE COMO LEÍDO =====
  async marcarComoLeido(id_mensaje: number): Promise<ApiResponse> {
    try {
      const response = await apiService.put(
        `/mensajes/${id_mensaje}/leer`,
        {}
      );
      return response;
    } catch (error) {
      console.error('Error marcando mensaje como leído:', error);
      throw error;
    }
  }

  // ===== ELIMINAR MENSAJE =====
  async eliminarMensaje(id_mensaje: number): Promise<ApiResponse> {
    try {
      const response = await apiService.delete(
        `/mensajes/${id_mensaje}`
      );
      return response;
    } catch (error) {
      console.error('Error eliminando mensaje:', error);
      throw error;
    }
  }

  // ===== OBTENER MENSAJES NO LEÍDOS =====
  async obtenerMensajesNoLeidos(): Promise<ApiResponse<{ total_no_leidos: number }>> {
    try {
      const response = await apiService.get<{ total_no_leidos: number }>(
        `/mensajes/no-leidos`
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo mensajes no leídos:', error);
      throw error;
    }
  }

  // ===== OBTENER CONVERSACIÓN =====
  async obtenerConversacion(id_usuario: number): Promise<ApiResponse<Mensaje[]>> {
    try {
      const response = await apiService.get<Mensaje[]>(
        `/mensajes/conversacion/${id_usuario}`
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo conversación:', error);
      throw error;
    }
  }

  // ===== CONTACTAR PRODUCTOR (SIN LOGIN) =====
  async contactarProductor(contactoData: {
    id_producto: number;
    nombre_contacto: string;
    email_contacto: string;
    telefono_contacto?: string;
    mensaje: string;
  }): Promise<ApiResponse> {
    try {
      const response = await apiService.post(
        `/mensajes/contactar-productor`,
        contactoData,
        false // No requiere autenticación
      );
      return response;
    } catch (error) {
      console.error('Error contactando productor:', error);
      throw error;
    }
  }
}

export const mensajesService = new MensajesService();
export default mensajesService;


<<<<<<< HEAD

=======
>>>>>>> 981c03b2e72622b605b6649da12a5fbfd455951e
