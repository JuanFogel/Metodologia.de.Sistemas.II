# 🐾 Auri - Plataforma Integral para Gestión Veterinaria

**Plataforma integral para gestión veterinaria, turnos de urgencia, historias clínicas digitales y adopciones responsables.**

## 👥 Integrantes del Proyecto

- **Fogel Juan Gabriel**
- **Moraga Geronimo**
- **Granito Quiñones Esteban Julian**

## 📋 Descripción del Proyecto

Auri es una plataforma web innovadora que centraliza en un solo lugar:
- **Localización en tiempo real** de veterinarias abiertas
- **Gestión de turnos** de urgencia y programados
- **Digitalización** de historias clínicas de cada mascota
- **Publicación y seguimiento** de adopciones responsables

### 🎯 Objetivo General

Desarrollar una plataforma web integral que integre frontend, backend y base de datos, para optimizar la gestión de servicios veterinarios, turnos, historias clínicas digitales y adopciones de mascotas.

### 🎯 Objetivos Específicos

- Implementar un mapa interactivo que muestre en tiempo real veterinarias abiertas, cerradas y de guardia
- Permitir la reserva ágil y centralizada de turnos (urgencia y programados)
- Gestionar y consultar historias clínicas digitales de mascotas (vacunas, consultas, diagnósticos, tratamientos)
- Brindar a refugios la capacidad de publicar mascotas en adopción y registrar su seguimiento post-adopción
- Generar reportes en PDF/XLS de información relevante (turnos, vacunas pendientes, adopciones por estado)

## 🚀 Plan de Desarrollo (Avance Gradual)

### **Fase 1: Fundamentos y Estructura Base** ⚙️
- [x] Estructura inicial del proyecto
- [x] Configuración del entorno de desarrollo (React + Vite, Node.js + Express)
- [x] Configuración de base de datos (PostgreSQL/SQLite)
- [x] Configuración de Sequelize ORM
- [x] Sistema de autenticación con roles (Tutor, Veterinario, Refugio, Admin)

### **Fase 2: Módulo de Usuarios y Mascotas** 👥🐕
- [x] ABM de usuarios (Tutores, Veterinarios, Refugios, Admins)
- [x] ABM de mascotas
- [x] Relación usuario-mascota
- [x] Perfiles de usuario según rol
- [x] Búsqueda y filtros

### **Fase 3: Módulo de Veterinarias** 🏥
- [x] ABM de veterinarias
- [x] Gestión de estados (abierta, cerrada, guardia)
- [x] Información de contacto y horarios
- [x] Integración con mapa interactivo (Leaflet)

### **Fase 4: Mapa Interactivo** 🗺️
- [x] Implementación de Leaflet
- [x] Visualización de veterinarias en mapa
- [x] Filtros por estado (abierta/cerrada/guardia)
- [x] Información detallada al hacer clic
- [x] Geolocalización del usuario

### **Fase 5: Sistema de Turnos y Agenda** 📅
- [x] ABM de turnos
- [x] Agenda de turnos con gestión de urgencias
- [x] Vista de agenda diaria/semanal/mensual
- [x] Asignación de turnos a veterinarias
- [x] Validaciones de disponibilidad

### **Fase 6: Historias Clínicas Digitales** 📋
- [x] ABM de historias clínicas
- [x] Carga y consulta por mascota
- [x] Registro de vacunas
- [x] Registro de consultas, diagnósticos y tratamientos
- [x] Archivos adjuntos (opcional para MVP)

### **Fase 7: Módulo de Adopciones** 🐾
- [x] ABM de adopciones
- [x] Publicación de mascotas en adopción
- [x] Registro de seguimientos básicos post-adopción
- [x] Gestión de estados de adopción
- [ ] Perfil de refugio

### **Fase 8: Reportes** 📊
- [ ] Generación de reportes en PDF
- [ ] Generación de reportes en XLS
- [ ] Reportes de turnos
- [ ] Reportes de vacunas pendientes
- [ ] Reportes de adopciones por estado

### **Fase 9: Optimización y Despliegue** ✨
- [ ] Optimización de rendimiento
- [ ] Pruebas con Postman (API)
- [ ] Despliegue en Render (Backend)
- [ ] Despliegue en Vercel/Netlify (Frontend)
- [ ] Documentación final

## 🛠️ Stack Tecnológico

### Frontend
- **React** + **Vite** - Framework y build tool
- **Tailwind CSS** - Estilos y diseño
- **Leaflet** - Mapa interactivo

### Backend
- **Node.js** + **Express** - Servidor y API REST
- **Sequelize** - ORM para gestión de base de datos

### Base de Datos
- **PostgreSQL** - Base de datos para entorno productivo
- **SQLite** - Base de datos opcional para desarrollo

### Despliegue
- **Render** - Hosting de API (Backend)
- **Vercel/Netlify** - Hosting de Frontend

### Herramientas de Desarrollo
- **GitHub** - Control de versiones y repositorio
- **Jira** - Gestión de tareas y sprints
- **Postman** - Pruebas y documentación de API

## 📁 Estructura del Proyecto

```
auri-veterinaria/
├── README.md
├── .gitignore
├── docs/                    # Documentación del proyecto
│   ├── API.md              # Documentación de endpoints
│   ├── DATABASE.md         # Esquema de base de datos
│   └── DEPLOYMENT.md       # Guía de despliegue
├── frontend/                # Aplicación React + Vite
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/      # Servicios API
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # Context API
│   │   ├── utils/          # Utilidades
│   │   ├── styles/         # Estilos globales
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── models/         # Modelos Sequelize
│   │   ├── routes/         # Rutas de la API
│   │   ├── controllers/    # Controladores
│   │   ├── middleware/     # Middlewares (auth, validación)
│   │   ├── services/       # Lógica de negocio
│   │   ├── utils/          # Utilidades
│   │   └── server.js
│   ├── migrations/         # Migraciones de BD
│   ├── seeders/            # Datos de prueba
│   ├── package.json
│   └── .env.example
└── tests/                   # Pruebas unitarias e integración
    ├── frontend/
    └── backend/
```

## 📦 Alcance del MVP

### ✅ Incluye:
- Sistema de autenticación con roles (Tutor, Veterinario, Refugio, Admin)
- ABM de usuarios, mascotas, turnos, historias clínicas, veterinarias y adopciones
- Mapa interactivo con veterinarias y su estado de disponibilidad
- Agenda de turnos con gestión de urgencias
- Carga y consulta de historias clínicas por mascota
- Publicación de adopciones y registro de seguimientos básicos
- Reportes básicos en PDF/XLS

### ❌ No incluye en esta primera etapa:
- Integración con pasarelas de pago
- Notificaciones push o integración con WhatsApp/SMS
- Mensajería en tiempo real entre usuarios
- Firma digital de recetas

## 🚀 Inicio Rápido

Para comenzar a trabajar en el proyecto, sigue la guía completa en [docs/INICIO_RAPIDO.md](docs/INICIO_RAPIDO.md)

### Resumen rápido:

```bash
# Backend
cd backend
npm install
cp .env.example .env  # Editar con tus configuraciones
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

## 📝 Documentación

- [Guía de Inicio Rápido](docs/INICIO_RAPIDO.md) - Configuración inicial del proyecto
- [Documentación de la API](docs/API.md) - Endpoints y uso de la API
- [Esquema de Base de Datos](docs/DATABASE.md) - Modelos y relaciones
- [Guía de Despliegue](docs/DEPLOYMENT.md) - Despliegue en producción
- [Estructura del Proyecto](docs/ESTRUCTURA_PROYECTO.md) - Organización detallada

## 👥 Equipo

- **Fogel Juan Gabriel**
- **Moraga Geronimo**
- **Granito Quiñones Esteban Julian**

---

*Última actualización: noviembre 2025*

