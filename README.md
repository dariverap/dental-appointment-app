# DentalClinic - Sistema de Reservas de Citas

Una aplicación web moderna para la gestión de citas dentales, desarrollada con React y Tailwind CSS.

## 🦷 Características

- **Autenticación de usuarios** - Login y registro de pacientes
- **Dashboard del paciente** - Vista general de citas programadas
- **Reserva de citas** - Sistema completo de agendamiento
- **Diseño responsivo** - Optimizado para móvil y escritorio
- **Interfaz moderna** - Diseño limpio con paleta de colores dental

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd dental-clinic-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

4. **Configurar variables de entorno**
   ```bash
   # Copiar el archivo de ejemplo
   cp .env.example .env
   
   # Editar .env con tus credenciales de Firebase
   # NUNCA subas el archivo .env a GitHub
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🔐 Configuración de Firebase

### Variables de Entorno (IMPORTANTE)

Este proyecto utiliza variables de entorno para mantener las credenciales de Firebase seguras:

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Edita el archivo `.env` con tus credenciales reales de Firebase:**
   ```bash
   REACT_APP_FIREBASE_API_KEY=tu_api_key_aqui
   REACT_APP_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=tu_project_id
   # ... resto de credenciales
   ```

3. **⚠️ NUNCA subas el archivo `.env` a GitHub** - Ya está incluido en `.gitignore`

### Obtener credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a "Project Settings" > "General" > "Your apps"
4. Crea una nueva app web o selecciona una existente
5. Copia las credenciales al archivo `.env`

## 📱 Funcionalidades

### Páginas Implementadas

1. **Login** (`/login`)
   - Formulario de inicio de sesión
   - Validación de campos
   - Enlaces a registro y recuperación de contraseña

2. **Registro** (`/register`)
   - Formulario de registro de nuevos usuarios
   - Validación de contraseñas
   - Enlace de retorno al login

3. **Dashboard** (`/dashboard`)
   - Bienvenida personalizada
   - Lista de citas con estados (reservada, atendida, cancelada)
   - Estadísticas de citas
   - Botón de nueva cita

4. **Nueva Cita** (`/new-appointment`)
   - Selección de tratamiento dental
   - Selección de dentista
   - Selector de fecha y hora
   - Resumen de la cita
   - Confirmación de reserva

### Componentes

- **Navbar** - Navegación responsiva con logo y menú de usuario
- **Formularios** - Campos con validación y estados de carga
- **Tarjetas de citas** - Información detallada con iconos de estado

## 🎨 Diseño

### Paleta de Colores
- **Azul dental**: Tonos suaves de azul (#0ea5e9 y variantes)
- **Grises**: Para texto y elementos secundarios
- **Verde**: Para estados exitosos
- **Rojo**: Para errores y cancelaciones

### Iconos
- Utiliza **Lucide React** para iconos consistentes
- Iconos temáticos para cada sección (calendario, usuario, etc.)

## � Despliegue en Vercel

### Configuración de Variables de Entorno en Producción

Cuando despliegues en Vercel (o cualquier plataforma similar), las variables de entorno se configuran por separado del código:

#### **1. Preparar el repositorio**
```bash
# Subir código a GitHub (sin .env)
git add .
git commit -m "Initial commit: Dental clinic app"
git push origin main
```

#### **2. Configurar proyecto en Vercel**
1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Conecta tu cuenta de GitHub
3. Importa tu repositorio
4. Vercel detectará automáticamente que es una app React

#### **3. Configurar Variables de Entorno**
En el dashboard de Vercel:
- Ve a tu proyecto → **Settings** → **Environment Variables**
- Agrega cada variable una por una:

| Variable | Valor |
|----------|-------|
| `REACT_APP_FIREBASE_API_KEY` | Tu API Key de Firebase |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | tu-proyecto.firebaseapp.com |
| `REACT_APP_FIREBASE_PROJECT_ID` | tu-project-id |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | tu-proyecto.firebasestorage.app |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Tu Sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Tu App ID |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Tu Measurement ID |

#### **4. Redeploy automático**
- Vercel reconstruirá automáticamente tu app con las nuevas variables
- Tu app estará disponible en una URL como: `https://tu-proyecto.vercel.app`

### 🔄 Flujo de Desarrollo vs Producción

```
Desarrollo Local:
├── Código fuente
├── .env (credenciales locales)
└── npm start

GitHub:
├── Solo código fuente
└── .env excluido por .gitignore

Vercel (Producción):
├── Código desde GitHub
├── Variables desde dashboard de Vercel
└── App desplegada automáticamente
```

### 🔧 Actualizar Variables en Producción

Para cambiar variables de entorno en producción:
1. Ve a Vercel Dashboard → Tu proyecto → Settings → Environment Variables
2. Edita la variable que necesites
3. Vercel automáticamente hará redeploy

### 💡 Ventajas de este Método

- ✅ **Seguridad**: Credenciales nunca expuestas públicamente
- ✅ **Flexibilidad**: Diferentes variables por entorno
- ✅ **Colaboración**: Cada desarrollador maneja sus propias credenciales
- ✅ **Mantenimiento**: Cambios sin tocar código fuente

## �🔥 Integración con Firebase (Próximos pasos)

El código está preparado para integración con Firebase. Busca los comentarios `TODO:` en el código:

### Autenticación
```javascript
// TODO: Replace with Firebase Auth
// Archivo: src/App.js - useAuth hook
```

### Base de datos
```javascript
// TODO: Replace with Firebase Firestore
// Archivos: src/pages/Dashboard.js, src/pages/NewAppointment.js
```

### Configuración recomendada de Firebase

1. **Firebase Auth** - Para manejo de usuarios
2. **Firestore** - Para almacenar citas y datos de usuarios
3. **Hosting** - Para despliegue de la aplicación

### Estructura de datos sugerida

```javascript
// Colección: users
{
  uid: "user_id",
  name: "Juan Pérez",
  email: "juan@email.com",
  createdAt: timestamp
}

// Colección: appointments
{
  id: "appointment_id",
  userId: "user_id",
  treatment: "limpieza",
  dentist: "juan",
  date: timestamp,
  time: "10:00",
  status: "reservada", // reservada, atendida, cancelada
  createdAt: timestamp
}

// Colección: dentists
{
  id: "dentist_id",
  name: "Dr. Juan Carlos",
  specialty: "Odontología general",
  available: true
}
```

## 📦 Dependencias Principales

- **React** - Framework de UI
- **React Router** - Navegación entre páginas
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos
- **React DatePicker** - Selector de fechas

## 🛠️ Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm eject` - Expone la configuración de webpack

## 📱 Responsive Design

La aplicación está optimizada para:
- **Móviles** (320px+)
- **Tablets** (768px+)
- **Escritorio** (1024px+)

## 🔐 Seguridad

- Validación de formularios en el frontend
- Rutas protegidas con autenticación
- Preparado para integración con Firebase Auth

## 📄 Licencia

Este proyecto es de uso educativo y demostrativo.

---

**Desarrollado con ❤️ para la gestión moderna de citas dentales**

# 🦷 Sistema de Citas Dentales

Una aplicación web moderna y completa para la gestión de citas en clínicas dentales, desarrollada con React y Firebase.

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.1.6-blue?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Descripción

Este sistema permite a los pacientes registrarse, autenticarse y gestionar sus citas dentales de manera intuitiva. Los usuarios pueden reservar nuevas citas, ver su historial, y cancelar citas existentes. La aplicación cuenta con un diseño moderno y responsivo.

## ✨ Características Principales

- 🔐 **Autenticación completa** - Registro e inicio de sesión seguro
- 📅 **Gestión de citas** - Reservar, visualizar y cancelar citas
- 👨‍⚕️ **Gestión de dentistas** - Base de datos de profesionales disponibles
- 🦷 **Catálogo de tratamientos** - Diferentes servicios dentales con precios
- 📊 **Dashboard informativo** - Estadísticas y resumen de citas
- 📱 **Diseño responsivo** - Optimizado para todos los dispositivos
- 🎨 **UI moderna** - Interfaz limpia y profesional

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.2.0** - Librería principal para la interfaz
- **React Router DOM 6.3.0** - Navegación entre páginas
- **Tailwind CSS 3.1.6** - Framework CSS utility-first
- **Lucide React** - Librería de iconos moderna
- **React DatePicker** - Componente para selección de fechas

### Backend & Base de Datos
- **Firebase 10.7.1** - Backend as a Service
  - **Firestore** - Base de datos NoSQL
  - **Authentication** - Sistema de autenticación
  - **Hosting** - Despliegue de la aplicación

## 📁 Estructura del Proyecto

```
src/
├── components/
│   └── Navbar.js              # Barra de navegación
├── pages/
│   ├── Dashboard.js           # Panel principal del usuario
│   ├── Login.js              # Página de inicio de sesión
│   ├── Register.js           # Página de registro
│   └── NewAppointment.js     # Formulario de nueva cita
├── firebase/
│   ├── config.js             # Configuración de Firebase
│   ├── auth.js               # Funciones de autenticación
│   └── firestore.js          # Operaciones de base de datos
├── scripts/
│   └── loadAllData.js        # Script de inicialización de datos
└── App.js                    # Componente principal
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn
- Cuenta de Firebase

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/dental-clinic-app.git
cd dental-clinic-app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication (Email/Password)
3. Crea una base de datos Firestore
4. Copia las credenciales de configuración

### 4. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_FIREBASE_API_KEY=tu_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
REACT_APP_FIREBASE_APP_ID=tu_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

### 5. Configurar reglas de Firestore

En Firebase Console, configura las siguientes reglas para Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura de dentistas y tratamientos a usuarios autenticados
    match /dentists/{document} {
      allow read: if request.auth != null;
    }
    
    match /treatments/{document} {
      allow read: if request.auth != null;
    }
    
    // Solo permitir acceso a citas del usuario autenticado
    match /appointments/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 6. Ejecutar la aplicación
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📊 Funcionalidades Detalladas

### Autenticación
- Registro de nuevos usuarios con email y contraseña
- Inicio de sesión seguro
- Protección de rutas privadas
- Cierre de sesión

### Dashboard
- Visualización de todas las citas del usuario
- Estadísticas de citas (programadas, completadas, canceladas)
- Estado visual de cada cita con iconos
- Información detallada de dentista y tratamiento

### Gestión de Citas
- Formulario intuitivo para nueva cita
- Selección de tratamiento y dentista
- Calendario para selección de fecha
- Horarios disponibles
- Resumen antes de confirmar
- Cancelación de citas existentes

### Datos Maestros
- Catálogo de tratamientos dentales
- Base de datos de dentistas especializados
- Inicialización automática de datos de prueba

## 🎨 Diseño y UX

- **Paleta de colores profesional** - Azules y grises para transmitir confianza
- **Tipografía clara** - Fácil lectura en todos los dispositivos
- **Iconografía consistente** - Lucide React para iconos modernos
- **Feedback visual** - Estados de carga, errores y éxito
- **Responsive design** - Adaptado a móviles, tablets y desktop

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start          # Inicia el servidor de desarrollo

# Producción
npm run build      # Construye la aplicación para producción
npm test           # Ejecuta las pruebas
npm run eject      # Expone la configuración de Webpack
```

## 🚀 Despliegue

### Firebase Hosting

1. Instala Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Inicia sesión en Firebase:
```bash
firebase login
```

3. Inicializa el proyecto:
```bash
firebase init hosting
```

4. Construye y despliega:
```bash
npm run build
firebase deploy
```

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

- [ ] Sistema de notificaciones por email
- [ ] Recordatorios automáticos de citas
- [ ] Panel de administración para dentistas
- [ ] Integración con calendario externo
- [ ] Sistema de calificaciones y reseñas
- [ ] Historial médico del paciente
- [ ] Reportes y analytics

## 🐛 Problemas Conocidos

- Las consultas de Firestore requieren índices compuestos para ordenamiento
- Es necesario inicializar datos de dentistas y tratamientos en el primer uso

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)

## 🙏 Agradecimientos

- [React](https://reactjs.org/) por la librería principal
- [Firebase](https://firebase.google.com/) por el backend
- [Tailwind CSS](https://tailwindcss.com/) por el framework CSS
- [Lucide](https://lucide.dev/) por los iconos

---

⭐ Si este proyecto te ha sido útil, ¡no olvides darle una estrella!
