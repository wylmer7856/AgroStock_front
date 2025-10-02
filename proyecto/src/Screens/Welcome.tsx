import React, { useState, useEffect } from "react";
import './Welcome.css';

interface WelcomeProps {
  onNavigateToLogin?: () => void;
  onNavigateToRegister?: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const [productos, setProductos] = useState<{ id: number; nombre: string; precio: number; imagen: string }[]>([]);

  useEffect(() => {
    const nuevosProductos = [
      { id: 1, nombre: "Semillas de Maíz Premium", precio: 20000, imagen: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&h=200&fit=crop" },
      { id: 2, nombre: "Fertilizante Orgánico", precio: 35000, imagen: "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=300&h=200&fit=crop" },
      { id: 3, nombre: "Tractor Mini Agrícola", precio: 2000000, imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop" },
      { id: 4, nombre: "Sistema de Riego", precio: 450000, imagen: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&h=200&fit=crop" },
      { id: 5, nombre: "Herramientas Agrícolas", precio: 85000, imagen: "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=300&h=200&fit=crop" },
      { id: 6, nombre: "Invernadero Modular", precio: 1200000, imagen: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&h=200&fit=crop" },
    ];
    setProductos(nuevosProductos);
  }, []);

  return (
    <div className="welcome-container">
      {/* 🔹 NAVBAR MEJORADO */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">
            <span className="logo-icon">🌾</span>
            <span className="logo-text">AGROSTOCK</span>
          </div>
          <ul className="nav-links">
            <li className="nav-item">Marketplace</li>
            <li className="nav-item">Nosotros</li>
            <li className="nav-item">Contacto</li>
            <li className="nav-item" onClick={onNavigateToLogin}>Login</li>
            <li className="nav-item register-btn" onClick={onNavigateToRegister}>Registrar</li>
          </ul>
        </div>
      </nav>

      {/* 🔹 HERO SECTION MEJORADO */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-icon">🌱</span>
              Bienvenido a AgroStock
            </h1>
            <p className="hero-subtitle">Innovación y calidad para el campo colombiano</p>
            <p className="hero-description">
              Conectamos agricultores con las mejores herramientas, semillas y tecnología 
              para maximizar la productividad y sostenibilidad de sus cultivos.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={onNavigateToRegister}>
                Comenzar Ahora
              </button>
              <button className="btn-secondary" onClick={onNavigateToLogin}>
                Iniciar Sesión
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop" 
              alt="Agricultura moderna" 
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* 🔹 CATEGORÍAS MEJORADAS */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Nuestras Categorías</h2>
          <p className="section-subtitle">Encuentra todo lo que necesitas para tu campo</p>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">🌾</div>
              <h3 className="category-title">Semillas</h3>
              <p className="category-description">Variedades premium para máximo rendimiento</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🧪</div>
              <h3 className="category-title">Fertilizantes</h3>
              <p className="category-description">Nutrientes orgánicos y químicos</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🚜</div>
              <h3 className="category-title">Maquinaria</h3>
              <p className="category-description">Equipos modernos para el campo</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🛠️</div>
              <h3 className="category-title">Herramientas</h3>
              <p className="category-description">Accesorios y herramientas especializadas</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 PRODUCTOS DESTACADOS */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Productos Destacados</h2>
          <p className="section-subtitle">Los más vendidos esta temporada</p>
          <div className="products-grid">
            {productos.map((producto) => (
              <div key={producto.id} className="product-card">
                <div className="product-image-container">
                  <img src={producto.imagen} alt={producto.nombre} className="product-image" />
                  <div className="product-badge">Nuevo</div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{producto.nombre}</h3>
                  <p className="product-price">${producto.precio.toLocaleString()}</p>
                  <button className="product-button">Agregar al carrito</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 MISIÓN Y VISIÓN MEJORADAS */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mission-card">
            <div className="mission-content">
              <div className="mission-text">
                <h2 className="mission-title">Nuestra Misión</h2>
                <p className="mission-description">
                  En <strong>AgroStock</strong> nos dedicamos a ofrecer soluciones innovadoras y accesibles 
                  para el campo, brindando a los agricultores insumos y tecnología de calidad que potencien 
                  la productividad y sostenibilidad de sus cultivos.
                </p>
                <div className="mission-features">
                  <div className="feature">
                    <span className="feature-icon">✅</span>
                    <span>Calidad garantizada</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🚚</span>
                    <span>Envío rápido</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">💬</span>
                    <span>Soporte 24/7</span>
                  </div>
                </div>
              </div>
              <div className="mission-image">
                <img 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=400&fit=crop" 
                  alt="Misión AgroStock" 
                  className="mission-img"
                />
              </div>
            </div>
          </div>

          <div className="vision-card">
            <div className="vision-content">
              <div className="vision-image">
                <img 
                  src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=400&fit=crop" 
                  alt="Visión AgroStock" 
                  className="vision-img"
                />
              </div>
              <div className="vision-text">
                <h2 className="vision-title">Nuestra Visión</h2>
                <p className="vision-description">
                  Ser la plataforma líder en comercio agropecuario en Latinoamérica, conectando a productores, 
                  distribuidores y clientes en un ecosistema digital confiable, sostenible y próspero.
                </p>
                <div className="vision-stats">
                  <div className="stat">
                    <span className="stat-number">10K+</span>
                    <span className="stat-label">Productos</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">5K+</span>
                    <span className="stat-label">Clientes</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Ciudades</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 FOOTER MEJORADO */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <span className="footer-icon">🌾</span>
                <span className="footer-text">AGROSTOCK</span>
              </div>
              <p className="footer-description">
                Conectando el campo con la tecnología para un futuro más sostenible.
              </p>
            </div>
            <div className="footer-section">
              <h3 className="footer-title">Enlaces Rápidos</h3>
              <ul className="footer-links">
                <li><a href="#marketplace">Marketplace</a></li>
                <li><a href="#nosotros">Nosotros</a></li>
                <li><a href="#contacto">Contacto</a></li>
                <li><a href="#ayuda">Ayuda</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3 className="footer-title">Categorías</h3>
              <ul className="footer-links">
                <li><a href="#semillas">Semillas</a></li>
                <li><a href="#fertilizantes">Fertilizantes</a></li>
                <li><a href="#maquinaria">Maquinaria</a></li>
                <li><a href="#herramientas">Herramientas</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3 className="footer-title">Contacto</h3>
              <div className="contact-info">
                <p>📧 info@agrostock.com</p>
                <p>📞 +57 (1) 234-5678</p>
                <p>📍 Bogotá, Colombia</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 AgroStock - Todos los derechos reservados</p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">🐦</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default Welcome;