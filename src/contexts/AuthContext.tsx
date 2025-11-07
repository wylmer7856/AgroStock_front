// 🔐 CONTEXTO DE AUTENTICACIÓN GLOBAL

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import authService from '../services/auth';
import type { User, LoginCredentials, RegisterData, AppView } from '../types';

// ===== TIPOS DEL CONTEXTO =====
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  currentView: AppView;
}

interface AuthContextType extends AuthState {
  login: (user: User) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentView: (view: AppView) => void;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
}

// ===== ACCIONES DEL REDUCER =====
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_VIEW'; payload: AppView }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

// ===== ESTADO INICIAL =====
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  currentView: 'welcome',
};

// ===== REDUCER =====
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        currentView: 'welcome',
      };
    
    default:
      return state;
  }
}

// ===== CONTEXTO =====
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== PROVIDER =====
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ===== EFECTOS =====
  
  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const user = authService.getCurrentUser();
        if (user && authService.isAuthenticated()) {
          // Verificar si el token sigue siendo válido
          const isValid = await authService.refreshTokenIfNeeded();
          if (isValid) {
            dispatch({ type: 'SET_USER', payload: user });
          } else {
            dispatch({ type: 'LOGOUT' });
          }
        } else {
          dispatch({ type: 'SET_USER', payload: null });
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Error verificando autenticación' });
      }
    };

    checkAuth();
  }, []);

  // ===== FUNCIONES DEL CONTEXTO =====
  
  const login = async (user: User): Promise<void> => {
    try {
      dispatch({ type: 'SET_USER', payload: user });
      
      // Redirigir según el rol
      const view: AppView = user.rol === 'admin' ? 'admin' : 
                           user.rol === 'productor' ? 'productor' : 'consumidor';
      dispatch({ type: 'SET_VIEW', payload: view });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el login';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      await authService.register(userData);
      
      // Después del registro exitoso, cambiar a login
      dispatch({ type: 'SET_VIEW', payload: 'login' });
      dispatch({ type: 'SET_LOADING', payload: false });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
      
    } catch (error) {
      console.error('Error en logout:', error);
      // Aún así limpiar el estado local
      dispatch({ type: 'LOGOUT' });
    }
  };

  const setCurrentView = (view: AppView): void => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const isValid = await authService.refreshTokenIfNeeded();
      if (!isValid) {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Error refrescando autenticación:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  // ===== VALOR DEL CONTEXTO =====
  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    setCurrentView,
    clearError,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ===== HOOK PERSONALIZADO =====
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// ===== HOOKS ESPECÍFICOS =====

// Hook para verificar si el usuario es admin
export const useIsAdmin = (): boolean => {
  const { user } = useAuth();
  return user?.rol === 'admin';
};

// Hook para verificar si el usuario es productor
export const useIsProducer = (): boolean => {
  const { user } = useAuth();
  return user?.rol === 'productor';
};

// Hook para verificar si el usuario es consumidor
export const useIsConsumer = (): boolean => {
  const { user } = useAuth();
  return user?.rol === 'consumidor';
};

// Hook para obtener el ID del usuario actual
export const useCurrentUserId = (): number | null => {
  const { user } = useAuth();
  return user?.id || null;
};

export default AuthContext;
