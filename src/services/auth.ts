// 🔐 SERVICIO DE AUTENTICACIÓN

import apiService from './api';
import { APP_CONFIG } from '../config';
import type { 
  LoginCredentials, 
  RegisterData, 
  LoginResponse, 
  User, 
  ApiResponse 
} from '../types';

class AuthService {
  
  // ===== LOGIN =====
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(
        `/auth/login`,
        credentials,
        false // No incluir token de autenticación para login
      );

      // El backend puede devolver directamente LoginResponse o dentro de data
      const loginData = response.data || response;
      
      if (loginData && loginData.token) {
        // Guardar token y datos del usuario
        apiService.setToken(loginData.token);
        this.saveUserData(loginData.usuario);
        if (loginData.session_id) {
          this.saveSessionData(loginData.session_id);
        }
        
        return loginData;
      } else if (response.success && response.data) {
        // Si viene envuelto en response.data
        apiService.setToken(response.data.token);
        this.saveUserData(response.data.usuario);
        if (response.data.session_id) {
          this.saveSessionData(response.data.session_id);
        }
        return response.data;
      } else {
        throw new Error(response.message || 'Error en el login');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
  }

  // ===== REGISTRO =====
  async register(userData: RegisterData): Promise<ApiResponse<User>> {
    try {
      const response = await apiService.post<ApiResponse<User>>(
        `/auth/register`,
        userData,
        false // No incluir token de autenticación para registro
      );

      return response;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  // ===== LOGOUT =====
  async logout(): Promise<void> {
    try {
      // Intentar hacer logout en el servidor
      await apiService.post(`/auth/logout`);
    } catch (error) {
      console.warn('Error en logout del servidor:', error);
    } finally {
      // Limpiar datos locales independientemente del resultado del servidor
      this.clearUserData();
    }
  }

  // ===== VERIFICAR TOKEN =====
  async verifyToken(): Promise<boolean> {
    try {
      const response = await apiService.get(`/auth/verify`);
      return response.success;
    } catch (error) {
      console.error('Error verificando token:', error);
      return false;
    }
  }

  // ===== CAMBIAR CONTRASEÑA =====
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await apiService.post(
        `/auth/change-password`,
        { currentPassword, newPassword }
      );

      return response;
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      throw error;
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====
  
  // Obtener usuario actual
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(APP_CONFIG.AUTH.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  }

  // Guardar datos del usuario
  private saveUserData(user: User): void {
    localStorage.setItem(APP_CONFIG.AUTH.USER_KEY, JSON.stringify(user));
  }

  // Guardar datos de sesión
  private saveSessionData(sessionId: string): void {
    localStorage.setItem(APP_CONFIG.AUTH.SESSION_KEY, sessionId);
  }

  // Limpiar todos los datos de usuario
  private clearUserData(): void {
    apiService.clearToken();
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return apiService.isAuthenticated() && !!this.getCurrentUser();
  }

  // Obtener rol del usuario actual
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.rol || null;
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }

  // Verificar si el usuario es admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Verificar si el usuario es productor
  isProducer(): boolean {
    return this.hasRole('productor');
  }

  // Verificar si el usuario es consumidor
  isConsumer(): boolean {
    return this.hasRole('consumidor');
  }

  // Obtener ID del usuario actual
  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user?.id || null;
  }

  // Verificar si el token está próximo a expirar
  isTokenExpiring(): boolean {
    return apiService.isTokenExpiring();
  }

  // Renovar token si es necesario
  async refreshTokenIfNeeded(): Promise<boolean> {
    if (this.isTokenExpiring()) {
      try {
        const isValid = await this.verifyToken();
        if (!isValid) {
          this.clearUserData();
          return false;
        }
        return true;
      } catch (error) {
        this.clearUserData();
        return false;
      }
    }
    return true;
  }
}

// Instancia singleton del servicio de autenticación
export const authService = new AuthService();
export default authService;
