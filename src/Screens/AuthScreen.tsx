// 🌾 PANTALLA DE AUTENTICACIÓN PROFESIONAL - AGROSTOCK
// Diseño basado en imágenes de referencia con colores del campo

import React, { useState } from 'react';
// Importación removida - usando emoji directo
import { authService } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from '../components/ReusableComponents';
import './AuthScreen.css';

interface AuthScreenProps {
  onNavigate?: (view: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'consumidor' | 'productor'>('consumidor');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { login: contextLogin } = useAuth();

  // Estados para formularios
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    direccion: '',
    id_ciudad: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Manejar login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await authService.login(loginData);
      
      if (response.success) {
        setToast({ message: '¡Bienvenido a AgroStock!', type: 'success' });
        contextLogin(response.usuario);
        
        setTimeout(() => {
          if (response.usuario.rol === 'admin') {
            onNavigate?.('admin');
          } else if (response.usuario.rol === 'productor') {
            onNavigate?.('productor');
          } else {
            onNavigate?.('consumidor');
          }
        }, 1500);
      }
    } catch (error: any) {
      setToast({ 
        message: error.message || 'Error al iniciar sesión', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Validar registro
  const validateRegister = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!registerData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!registerData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!registerData.telefono) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!registerData.direccion) {
      newErrors.direccion = 'La dirección es requerida';
    }

    if (!registerData.id_ciudad) {
      newErrors.id_ciudad = 'La ciudad es requerida';
    }

    if (!registerData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegister()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        ...registerData,
        rol: selectedRole
      });
      
      if (response.success) {
        setToast({ message: '¡Cuenta creada exitosamente!', type: 'success' });
        setTimeout(() => {
          setIsLogin(true);
          setLoginData({ email: registerData.email, password: '' });
        }, 1500);
      }
    } catch (error: any) {
      setToast({ 
        message: error.message || 'Error al crear la cuenta', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      {/* Logo y título superior */}
      <div className="auth-header">
        <div className="auth-logo-container">
          <div className="auth-logo-icon">🌾</div>
          <span className="auth-logo-text">AGROSTOCK</span>
        </div>
        <h1 className="auth-main-title">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h1>
        <p className="auth-subtitle">
          {isLogin 
            ? 'Accede a tu cuenta para continuar'
            : 'Únete a nuestra comunidad agrícola'
          }
        </p>
      </div>

      {/* Tabs de rol - Solo en registro */}
      {!isLogin && (
        <div className="role-tabs">
          <button
            type="button"
            className={`role-tab ${selectedRole === 'consumidor' ? 'active' : ''}`}
            onClick={() => setSelectedRole('consumidor')}
          >
            Consumidor
          </button>
          <button
            type="button"
            className={`role-tab ${selectedRole === 'productor' ? 'active' : ''}`}
            onClick={() => setSelectedRole('productor')}
          >
            Productor
          </button>
        </div>
      )}

      {/* Tarjeta del formulario */}
      <div className="auth-card">
        {/* Título dentro de la tarjeta - Solo en registro */}
        {!isLogin && (
          <div className="auth-card-header">
            <h2 className="auth-card-title">
              Registro de {selectedRole === 'consumidor' ? 'Consumidor' : 'Productor'}
            </h2>
            <p className="auth-card-subtitle">
              {selectedRole === 'consumidor'
                ? 'Crea tu cuenta para explorar y comprar productos locales'
                : 'Crea tu cuenta para vender y gestionar tus productos'
              }
            </p>
          </div>
        )}

        {/* Formulario de Login */}
        {isLogin ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-field">
              <label htmlFor="login-email" className="form-label">
                Correo Electrónico
              </label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="login-email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="form-input"
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="login-password" className="form-label">
                Contraseña
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="login-password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="form-input"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        ) : (
          /* Formulario de Registro */
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-field">
              <label htmlFor="register-nombre" className="form-label">
                Nombre Completo
              </label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="register-nombre"
                  value={registerData.nombre}
                  onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                  className={`form-input ${errors.nombre ? 'error' : ''}`}
                  placeholder="Tu nombre completo"
                  required
                  disabled={loading}
                />
              </div>
              {errors.nombre && <span className="error-text">{errors.nombre}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="register-telefono" className="form-label">
                Teléfono
              </label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  type="tel"
                  id="register-telefono"
                  value={registerData.telefono}
                  onChange={(e) => setRegisterData({ ...registerData, telefono: e.target.value })}
                  className={`form-input ${errors.telefono ? 'error' : ''}`}
                  placeholder="3001234567"
                  required
                  disabled={loading}
                />
              </div>
              {errors.telefono && <span className="error-text">{errors.telefono}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="register-email" className="form-label">
                Correo Electrónico
              </label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="register-email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="register-password" className="form-label">
                Contraseña
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="register-password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="register-confirm" className="form-label">
                Confirmar Contraseña
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="register-confirm"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="register-direccion" className="form-label">
                Dirección
              </label>
              <div className="input-wrapper">
                <span className="input-icon">📍</span>
                <input
                  type="text"
                  id="register-direccion"
                  value={registerData.direccion}
                  onChange={(e) => setRegisterData({ ...registerData, direccion: e.target.value })}
                  className={`form-input ${errors.direccion ? 'error' : ''}`}
                  placeholder="Tu dirección completa"
                  required
                  disabled={loading}
                />
              </div>
              {errors.direccion && <span className="error-text">{errors.direccion}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="register-ciudad" className="form-label">
                Ubicación
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🏙️</span>
                <select
                  id="register-ciudad"
                  value={registerData.id_ciudad}
                  onChange={(e) => setRegisterData({ ...registerData, id_ciudad: e.target.value })}
                  className={`form-select ${errors.id_ciudad ? 'error' : ''}`}
                  required
                  disabled={loading}
                >
                  <option value="">Selecciona tu departamento</option>
                  <option value="1">Bogotá D.C.</option>
                  <option value="2">Antioquia</option>
                  <option value="3">Valle del Cauca</option>
                  <option value="4">Atlántico</option>
                  <option value="5">Bolívar</option>
                  <option value="6">Boyacá</option>
                  <option value="7">Cundinamarca</option>
                </select>
              </div>
              {errors.id_ciudad && <span className="error-text">{errors.id_ciudad}</span>}
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
        )}
      </div>

      {/* Enlaces de navegación */}
      <div className="auth-footer">
        {isLogin ? (
          <>
            <p className="auth-footer-text">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                className="auth-footer-link"
                onClick={() => {
                  setIsLogin(false);
                  setSelectedRole('consumidor');
                }}
              >
                Regístrate aquí
              </button>
            </p>
            <button
              type="button"
              className="auth-back-link"
              onClick={() => onNavigate?.('welcome')}
            >
              - Volver al inicio
            </button>
          </>
        ) : (
          <>
            <p className="auth-footer-text">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                className="auth-footer-link"
                onClick={() => setIsLogin(true)}
              >
                Inicia sesión aquí
              </button>
            </p>
            <button
              type="button"
              className="auth-back-link"
              onClick={() => onNavigate?.('welcome')}
            >
              - Volver al inicio
            </button>
          </>
        )}
      </div>

      {/* Toast para mensajes */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AuthScreen;
