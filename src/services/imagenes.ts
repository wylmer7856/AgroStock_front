// 🖼️ SERVICIO DE IMÁGENES
// Maneja la subida de imágenes al backend

import apiService from './api';
import { APP_CONFIG } from '../config';

export interface ImageUploadResponse {
  success: boolean;
  message?: string;
  data?: {
    path: string;
    url: string;
  };
  error?: string;
}

const imagenesService = {
  /**
   * Subir imagen de producto
   */
  async subirImagenProducto(
    idProducto: number,
    imagen: File | string
  ): Promise<ImageUploadResponse> {
    try {
      let response: ImageUploadResponse;

      if (imagen instanceof File) {
        // Subir con FormData
        const formData = new FormData();
        formData.append('image', imagen);

        const result = await fetch(
          `${apiService.baseURL}/images/producto/${idProducto}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('agrostock_token')}`
            },
            body: formData
          }
        );

        response = await result.json();
      } else {
        // Subir con base64
        response = await apiService.post<ImageUploadResponse>(
          `/images/producto/${idProducto}`,
          { imageData: imagen }
        );
      }

      return response;
    } catch (error: unknown) {
      console.error('Error subiendo imagen de producto:', error);
      return {
        success: false,
        error: 'UPLOAD_ERROR',
        message: error instanceof Error ? error.message : 'Error al subir la imagen'
      };
    }
  },

  /**
   * Subir imagen de perfil de productor
   */
  async subirImagenPerfilProductor(
    imagen: File | string
  ): Promise<ImageUploadResponse> {
    try {
      let response: ImageUploadResponse;

      if (imagen instanceof File) {
        // Subir con FormData
        const formData = new FormData();
        formData.append('image', imagen);

        const result = await fetch(
          `${apiService.baseURL}/images/productor/perfil`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('agrostock_token')}`
            },
            body: formData
          }
        );

        response = await result.json();
      } else {
        // Subir con base64
        response = await apiService.post<ImageUploadResponse>(
          '/images/productor/perfil',
          { imageData: imagen }
        );
      }

      return response;
    } catch (error: unknown) {
      console.error('Error subiendo imagen de perfil:', error);
      return {
        success: false,
        error: 'UPLOAD_ERROR',
        message: error instanceof Error ? error.message : 'Error al subir la imagen'
      };
    }
  },

  /**
   * Convertir archivo a base64
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Error al convertir archivo a base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * Validar archivo de imagen
   */
  validarImagen(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de archivo no permitido. Use JPEG, PNG, GIF o WebP'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `El archivo es demasiado grande. Tamaño máximo: ${maxSize / 1024 / 1024}MB`
      };
    }

    return { valid: true };
  },

  /**
   * Construir URL de imagen
   */
  construirUrlImagen(path: string | null | undefined): string | null {
    if (!path) return null;
    
    const baseUrl = apiService.baseURL;
    
    // Si ya es una URL completa, retornarla
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Si empieza con /uploads, solo agregar el baseUrl
    if (path.startsWith('/uploads')) {
      return `${baseUrl}${path}`;
    }
    
    // Si no tiene /uploads, agregarlo
    if (!path.startsWith('uploads')) {
      return `${baseUrl}/uploads/${path}`;
    }
    
    return `${baseUrl}/${path}`;
  }
};

export default imagenesService;

