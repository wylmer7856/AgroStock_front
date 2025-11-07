import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigation, Breadcrumb } from './components/Navigation';
import WelcomeProfessional from './Screens/WelcomeProfessional';
import AuthScreen from './Screens/AuthScreen';
import AdminDashboard from './Screens/ADMIN/Dashboard';
import ProductorDashboard from './Screens/PRODUCTOR/Dashboard';
import ConsumidorDashboard from './Screens/CONSUMIDOR/Dashboard';
import ProductosScreen from './Screens/Productos/ProductosScreen';
import type { AppView } from './types';
import './App.css';

// ===== COMPONENTE PRINCIPAL DE LA APLICACIÓN =====
const AppContent: React.FC = () => {
  const { currentView, setCurrentView, user, isAuthenticated, isLoading } = useAuth();

  // ===== FUNCIONES DE NAVEGACIÓN =====
  const handleNavigate = (view: string) => {
    setCurrentView(view as AppView);
  };

  // ===== RENDERIZADO DE VISTAS =====
  const renderCurrentView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeProfessional onNavigate={handleNavigate} />;
      
      case 'auth':
        return <AuthScreen onNavigate={handleNavigate} />;
      
      case 'productos':
        return <ProductosScreen onNavigate={handleNavigate} />;
      
      case 'admin':
        return <AdminDashboard />;
      
      case 'productor':
        return (
          <ProductorDashboard onNavigate={handleNavigate} />
        );
      
      case 'consumidor':
        return (
          <ConsumidorDashboard onNavigate={handleNavigate} />
        );
      
      default:
        return <WelcomeProfessional onNavigate={handleNavigate} />;
    }
  };

  // ===== LOADING STATE =====
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <div className="loading-spinner" />
          <p>Cargando AgroStock...</p>
        </div>
      </div>
    );
  }

  // ===== LAYOUT PRINCIPAL =====
  return (
    <div className="App">
      {/* Navegación lateral para usuarios autenticados */}
      {isAuthenticated && user && (
        <div className="app-layout">
          <Navigation 
            onNavigate={handleNavigate}
            currentView={currentView}
            className="app-navigation"
          />
          
          <div className="app-main">
            {/* Breadcrumb */}
            <Breadcrumb 
              currentView={currentView}
              onNavigate={handleNavigate}
              className="app-breadcrumb"
            />
            
            {/* Contenido principal */}
            <main className="app-content">
              {renderCurrentView()}
            </main>
          </div>
        </div>
      )}

      {/* Layout simple para usuarios no autenticados */}
      {!isAuthenticated && (
        <div className="app-public">
          {renderCurrentView()}
        </div>
      )}
    </div>
  );
};

// ===== COMPONENTE PRINCIPAL CON PROVIDER =====
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;