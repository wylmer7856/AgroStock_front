import React, { useState, useEffect } from "react";

const Welcome: React.FC = () => {
  const [productos, setProductos] = useState<{ id: number; nombre: string; precio: number; imagen: string }[]>([]);

  useEffect(() => {
    const nuevosProductos = [
      { id: 1, nombre: "Semillas de Maíz", precio: 20000, imagen: "https://via.placeholder.com/150" },
      { id: 2, nombre: "Fertilizante Orgánico", precio: 35000, imagen: "https://via.placeholder.com/150" },
      { id: 3, nombre: "Tractor Mini", precio: 2000000, imagen: "https://via.placeholder.com/150" },
    ];
    setProductos(nuevosProductos);
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f9fafb" }}>
      {/* 🔹 NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>🌾 AGROSTOCK</div>
        <ul style={styles.navLinks}>
          <li>Marketplace</li>
          <li>Nosotros</li>
          <li>Login</li>
          <li style={styles.registerBtn}>Registrar</li>
        </ul>
      </nav>

      {/* 🔹 CARRUSEL */}
      <section style={styles.carousel}>
        <div style={styles.carouselContainer}>
          <div style={styles.slide}>
            <img src="https://picsum.photos/1200/500" alt="Slide 1" style={styles.slideImg} />
            <div style={styles.textOverlay}>
              <h1 style={{ fontSize: "3rem", marginBottom: "10px", fontWeight: "bold" }}>🌱 Bienvenido a Agrostock</h1>
              <p style={{ fontSize: "1.2rem" }}>Innovación y calidad para el campo colombiano</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 CATEGORÍAS */}
      <section style={styles.section}>
        <h2 style={{ fontSize: "2.5rem", color: "#567D46", marginBottom: "40px" }}>Categorías</h2>
        <div style={styles.categories}>
          <div style={styles.card}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🌾</div>
            <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Semillas</div>
          </div>
          <div style={styles.card}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🧪</div>
            <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Fertilizantes</div>
          </div>
          <div style={styles.card}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🚜</div>
            <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Maquinaria</div>
          </div>
          <div style={styles.card}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🛠️</div>
            <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Accesorios</div>
          </div>
        </div>
      </section>

      {/* 🔹 PRODUCTOS NUEVOS */}
      <section style={styles.section}>
        <h2 style={{ fontSize: "2.5rem", color: "#567D46", marginBottom: "40px" }}>Productos Nuevos</h2>
        <div style={styles.products}>
          {productos.map((p) => (
            <div key={p.id} style={styles.productCard}>
              <img src={p.imagen} alt={p.nombre} style={styles.productImg} />
              <h4 style={{ color: "#2d3748", marginBottom: "5px" }}>{p.nombre}</h4>
              <p style={{ color: "#567D46", fontWeight: "bold", fontSize: "1.2rem" }}>
                ${p.precio.toLocaleString()}
              </p>
              <button style={styles.addButton}>Agregar al carrito</button>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 MISIÓN Y VISIÓN */}
      <section style={styles.misionVisionSection}>
        <div style={styles.misionVisionContainer}>
          <div style={styles.misionCard}>
            <div style={styles.imageContainer}>
              <img src="https://picsum.photos/500/400" alt="Misión" style={styles.misionVisionImg} />
            </div>
            <div style={styles.textContainer}>
              <h2 style={{ color: "#567D46", fontSize: "2rem", marginBottom: "20px" }}>Nuestra Misión</h2>
              <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#4a5568" }}>
                En <b>Agrostock</b> nos dedicamos a ofrecer soluciones innovadoras y accesibles para el campo,
                brindando a los agricultores insumos y tecnología de calidad que potencien la productividad
                y sostenibilidad de sus cultivos.
              </p>
            </div>
          </div>

          <div style={styles.visionCard}>
            <div style={styles.textContainer}>
              <h2 style={{ color: "#567D46", fontSize: "2rem", marginBottom: "20px" }}>Nuestra Visión</h2>
              <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#4a5568" }}>
                Ser la plataforma líder en comercio agropecuario en Latinoamérica, conectando a productores,
                distribuidores y clientes en un ecosistema digital confiable, sostenible y próspero.
              </p>
            </div>
            <div style={styles.imageContainer}>
              <img src="https://picsum.photos/500/401" alt="Visión" style={styles.misionVisionImg} />
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 FOOTER */}
      <footer style={styles.footer}>
        <p>© 2025 Agrostock - Todos los derechos reservados 🌾</p>
        <p style={{ fontSize: "0.9rem", marginTop: "10px" }}>Conectando el campo con la tecnología</p>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(86, 125, 70, 0.9)",
    color: "#fff",
    padding: "15px 40px",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backdropFilter: "blur(10px)",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "24px",
  },
  navLinks: {
    display: "flex",
    listStyle: "none",
    gap: "30px",
    cursor: "pointer",
    alignItems: "center",
  },
  registerBtn: {
    background: "#8FB585",
    padding: "8px 20px",
    borderRadius: "20px",
    fontWeight: "bold",
  },
  carousel: {
    position: "relative",
    textAlign: "center",
    marginTop: "60px",
  },
  carouselContainer: {
    width: "100%",
  },
  slide: {
    position: "relative",
  },
  slideImg: {
    width: "100%",
    height: "500px",
    objectFit: "cover",
  },
  textOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "white",
    textAlign: "center",
    backgroundColor: "rgba(86, 125, 70, 0.7)",
    padding: "30px 50px",
    borderRadius: "15px",
    backdropFilter: "blur(5px)",
  },
  section: {
    padding: "60px 40px",
    textAlign: "center",
  },
  categories: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "30px",
    marginTop: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "15px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.3s, box-shadow 0.3s",
    border: "2px solid #E5E5E5",
  },
  products: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  productCard: {
    width: "250px",
    border: "2px solid #E5E5E5",
    borderRadius: "15px",
    padding: "20px",
    background: "#fff",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.3s",
  },
  productImg: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  addButton: {
    background: "#567D46",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "20px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold",
    width: "100%",
  },
  misionVisionSection: {
    background: "#fff",
    padding: "80px 20px",
  },
  misionVisionContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  misionCard: {
    display: "flex",
    alignItems: "center",
    gap: "60px",
    marginBottom: "80px",
  },
  visionCard: {
    display: "flex",
    alignItems: "center",
    gap: "60px",
    flexDirection: "row",
  },
  imageContainer: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    textAlign: "left",
  },
  misionVisionImg: {
    width: "100%",
    borderRadius: "20px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
  },
  footer: {
    background: "#567D46",
    color: "#fff",
    textAlign: "center",
    padding: "30px",
    marginTop: "0",
  },
};

export default Welcome;