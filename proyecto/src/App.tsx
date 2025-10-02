import React, { useState } from 'react';
import Welcome from './Screens/Welcome';
import Login from './Screens/Auth/Login';
import Registrar from './Screens/Auth/Registrar';

// Tipos para los datos de formulario
interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
  aceptaTerminos: boolean;
}

// Tipos para las vistas de la aplicación
type AppView = 'welcome' | 'login' | 'register';

// Componente principal con navegación completa
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [user, setUser] = useState<RegisterFormData | null>(null);

  // Handlers para navegación
  const navigateToWelcome = () => setCurrentView('welcome');
  const navigateToLogin = () => setCurrentView('login');
  const navigateToRegister = () => setCurrentView('register');

  // Handlers para autenticación
  const handleLogin = (formData: LoginFormData) => {
    console.log('Datos de login recibidos:', formData);
    
    // Simular datos de usuario (en la realidad vendrían del servidor)
    const mockUser: RegisterFormData = {
      nombre: 'Usuario',
      apellido: 'Demo',
      email: formData.email,
      telefono: '+57 300 123 4567',
      password: '',
      confirmPassword: '',
      aceptaTerminos: true
    };
    
    setUser(mockUser);
    alert(`¡Bienvenido! Login exitoso para: ${formData.email}`);
    
    // Después del login exitoso, volver al welcome
    setTimeout(() => {
      setCurrentView('welcome');
    }, 1000);
  };

  const handleRegister = (formData: RegisterFormData) => {
    console.log('Datos de registro recibidos:', formData);
    
    setUser(formData);
    alert(`¡Cuenta creada exitosamente! Bienvenido ${formData.nombre} ${formData.apellido}`);
    
    // Después del registro exitoso, cambiar automáticamente a login
    setTimeout(() => {
      setCurrentView('login');
    }, 1000);
  };

  // Renderizar vista actual
  const renderCurrentView = () => {
    switch (currentView) {
      case 'welcome':
        return (
          <Welcome 
            onNavigateToLogin={navigateToLogin}
            onNavigateToRegister={navigateToRegister}
          />
        );
      
      case 'login':
        return (
          <Login 
            onLogin={handleLogin}
            onSwitchToRegister={navigateToRegister}
          />
        );
      
      case 'register':
        return (
          <Registrar 
            onRegister={handleRegister}
            onSwitchToLogin={navigateToLogin}
          />
        );
      
      default:
        return (
          <Welcome 
            onNavigateToLogin={navigateToLogin}
            onNavigateToRegister={navigateToRegister}
          />
        );
    }
  };

  return (
    <div className="App">
      {/* Indicador de usuario logueado */}
      {user && (
        <div className="user-indicator">
          <div className="user-info">
            <span className="user-icon">👤</span>
            <span className="user-name">{user.nombre} {user.apellido}</span>
            <span className="user-email">({user.email})</span>
          </div>
          <button 
            className="logout-btn"
            onClick={() => {
              setUser(null);
              setCurrentView('welcome');
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      )}

      {/* Navegación de breadcrumb */}
      {currentView !== 'welcome' && (
        <div className="breadcrumb-nav">
          <button 
            className="breadcrumb-btn"
            onClick={navigateToWelcome}
          >
            ← Volver al Inicio
          </button>
          <div className="breadcrumb-steps">
            <span className={`step ${currentView === 'login' ? 'active' : ''}`}>
              {currentView === 'login' ? '🔐 Login' : 'Login'}
            </span>
            <span className={`step ${currentView === 'register' ? 'active' : ''}`}>
              {currentView === 'register' ? '📝 Registro' : 'Registro'}
            </span>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {renderCurrentView()}
    </div>
  );
};

export default App;