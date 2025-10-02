import React from "react";

const Welcome: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenido a mi aplicación</h1>
      <p style={styles.text}>Esta es la pantalla de inicio llamada Welcome</p>
      <button style={styles.button}>Entrar</button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #4facfe, #00f2fe)",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "10px",
  },
  text: {
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    background: "#fff",
    color: "#0077ff",
    cursor: "pointer",
  },
};

export default Welcome;
