# Componentes de Autenticación - AgroStock

## Descripción
Sistema completo de autenticación para la aplicación AgroStock, incluyendo componentes de Login y Registro desarrollados en React con TypeScript.

## Componentes Incluidos

### 🔐 Login
- **Validación de formulario**: Email y contraseña
- **Interfaz moderna**: Diseño atractivo con gradientes
- **Responsive**: Adaptable a diferentes pantallas
- **Estados de carga**: Indicador visual durante login
- **Mostrar/ocultar contraseña**: Toggle de visibilidad
- **Recordarme**: Checkbox para mantener sesión
- **Enlace de recuperación**: Opción para recuperar contraseña

### 📝 Registrar
- **Formulario completo**: Nombre, apellido, email, teléfono, contraseña
- **Validación robusta**: Validaciones específicas para cada campo
- **Confirmación de contraseña**: Verificación de coincidencia
- **Términos y condiciones**: Checkbox obligatorio
- **Validación de contraseña**: Requisitos de seguridad
- **Navegación fluida**: Cambio automático a login tras registro exitoso

## Características Generales

### ✨ Funcionalidades
- **Validación en tiempo real**: Feedback inmediato al usuario
- **Interfaz moderna**: Diseño consistente y atractivo
- **Responsive**: Optimizado para móviles y desktop
- **Accesibilidad**: Labels apropiados y navegación por teclado
- **Estados de carga**: Indicadores visuales durante procesos
- **Navegación fluida**: Cambio entre login y registro
- **TypeScript**: Tipado completo y interfaces bien definidas

### 🎨 Diseño
- Gradiente de fondo atractivo
- Tarjetas con sombras y bordes redondeados
- Animaciones suaves y transiciones
- Colores temáticos para AgroStock (verde)
- Tipografía moderna y legible
- Estados de error y éxito visuales

## Uso

### Importación
```tsx
import Login from './Screens/Auth/Login';
import Registrar from './Screens/Auth/Registrar';
```

### Uso básico con navegación
```tsx
import React, { useState } from 'react';
import Login from './Screens/Auth/Login';
import Registrar from './Screens/Auth/Registrar';

function App() {
  const [currentView, setCurrentView] = useState('login');

  return (
    <div className="App">
      {currentView === 'login' ? (
        <Login 
          onLogin={(data) => console.log('Login:', data)}
          onSwitchToRegister={() => setCurrentView('register')}
        />
      ) : (
        <Registrar 
          onRegister={(data) => console.log('Register:', data)}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      )}
    </div>
  );
}
```

## Props

### Login Props
| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `onLogin` | `(formData: LoginFormData) => void` | No | Callback ejecutado al hacer login exitoso |
| `onSwitchToRegister` | `() => void` | No | Callback para cambiar a vista de registro |

### Registrar Props
| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `onRegister` | `(formData: RegisterFormData) => void` | No | Callback ejecutado al hacer registro exitoso |
| `onSwitchToLogin` | `() => void` | No | Callback para cambiar a vista de login |

## Interfaces

### LoginFormData
```typescript
interface LoginFormData {
  email: string;
  password: string;
}
```

### RegisterFormData
```typescript
interface RegisterFormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
  aceptaTerminos: boolean;
}
```

## Validaciones

### Login
- **Email**: Campo requerido, formato válido
- **Contraseña**: Campo requerido, mínimo 6 caracteres

### Registrar
- **Nombre**: Campo requerido, mínimo 2 caracteres
- **Apellido**: Campo requerido, mínimo 2 caracteres
- **Email**: Campo requerido, formato válido
- **Teléfono**: Campo requerido, mínimo 10 dígitos
- **Contraseña**: Campo requerido, mínimo 8 caracteres, debe contener mayúscula, minúscula y número
- **Confirmar Contraseña**: Campo requerido, debe coincidir con contraseña
- **Términos**: Checkbox obligatorio

## Estilos

Cada componente incluye estilos CSS completos:
- `Login.css` - Estilos del componente Login
- `Registrar.css` - Estilos del componente Registrar

### Características de diseño:
- Diseño responsive
- Animaciones y transiciones
- Estados de error y carga
- Tema personalizable
- Accesibilidad mejorada

## Personalización

### Colores principales
- Verde principal: `#4CAF50`
- Verde secundario: `#45a049`
- Grises: `#2c3e50`, `#7f8c8d`
- Error: `#e74c3c`

### Modificar colores
Edita las variables CSS en los archivos correspondientes:
```css
.login-title, .register-title {
  background: linear-gradient(135deg, #TU_COLOR_1, #TU_COLOR_2);
}
```

## Ejemplo Completo con API

```tsx
import React, { useState } from 'react';
import Login from './Screens/Auth/Login';
import Registrar from './Screens/Auth/Registrar';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = async (formData) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        console.log('Login exitoso:', userData);
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleRegister = async (formData) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Cuenta creada exitosamente');
        setCurrentView('login');
      } else {
        alert('Error al crear la cuenta');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  if (user) {
    return <div>¡Bienvenido, {user.nombre}!</div>;
  }

  return (
    <div className="App">
      {currentView === 'login' ? (
        <Login 
          onLogin={handleLogin}
          onSwitchToRegister={() => setCurrentView('register')}
        />
      ) : (
        <Registrar 
          onRegister={handleRegister}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      )}
    </div>
  );
}

export default App;
```

## Archivos Incluidos

### Componentes
- `Login.tsx` - Componente de login
- `Registrar.tsx` - Componente de registro
- `App.tsx` - Ejemplo de uso con navegación

### Estilos
- `Login.css` - Estilos del login
- `Registrar.css` - Estilos del registro

### Documentación
- `LOGIN_README.md` - Esta documentación

## Requisitos

- React 18+
- TypeScript
- CSS3 (para animaciones y gradientes)

## Notas

- Los componentes son completamente funcionales sin props adicionales
- Incluyen validación del lado del cliente
- Compatibles con React 19+
- Optimizados para rendimiento
- Incluyen manejo de estados de carga y error
- Navegación fluida entre componentes
