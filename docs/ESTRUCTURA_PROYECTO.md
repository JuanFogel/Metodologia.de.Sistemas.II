# 📐 Estructura Detallada del Proyecto Auri

## Organización General

Este documento describe la estructura completa del proyecto Auri y cómo está organizado cada módulo.

## Frontend (`/frontend`)

### Estructura de Carpetas

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── common/         # Componentes comunes (Button, Input, Card, etc.)
│   │   ├── layout/         # Layout components (Header, Footer, Sidebar)
│   │   ├── map/            # Componentes del mapa (MapView, Marker, etc.)
│   │   └── forms/          # Formularios reutilizables
│   ├── pages/              # Páginas de la aplicación
│   │   ├── auth/           # Login, Register
│   │   ├── dashboard/      # Dashboard según rol
│   │   ├── pets/           # Gestión de mascotas
│   │   ├── appointments/   # Gestión de turnos
│   │   ├── clinical-histories/ # Historias clínicas
│   │   ├── veterinaries/   # Gestión de veterinarias
│   │   ├── adoptions/      # Gestión de adopciones
│   │   └── reports/        # Reportes
│   ├── services/           # Servicios API
│   │   ├── api.js          # Configuración de axios
│   │   ├── auth.service.js
│   │   ├── pets.service.js
│   │   ├── appointments.service.js
│   │   └── ...
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.js
│   │   ├── usePets.js
│   │   └── ...
│   ├── context/            # Context API
│   │   ├── AuthContext.js
│   │   └── AppContext.js
│   ├── utils/              # Utilidades
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── styles/             # Estilos globales
│   │   └── index.css
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Punto de entrada
├── public/                 # Archivos estáticos
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Backend (`/backend`)

### Estructura de Carpetas

```
backend/
├── src/
│   ├── models/             # Modelos Sequelize
│   │   ├── User.js
│   │   ├── Pet.js
│   │   ├── Veterinary.js
│   │   ├── Appointment.js
│   │   ├── ClinicalHistory.js
│   │   ├── Adoption.js
│   │   └── index.js        # Configuración de Sequelize
│   ├── routes/             # Rutas de la API
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── pets.routes.js
│   │   ├── veterinaries.routes.js
│   │   ├── appointments.routes.js
│   │   ├── clinical-histories.routes.js
│   │   ├── adoptions.routes.js
│   │   └── reports.routes.js
│   ├── controllers/        # Controladores
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── pets.controller.js
│   │   └── ...
│   ├── middleware/         # Middlewares
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   └── error.middleware.js
│   ├── services/           # Lógica de negocio
│   │   ├── auth.service.js
│   │   ├── pets.service.js
│   │   └── ...
│   ├── utils/              # Utilidades
│   │   ├── jwt.js
│   │   ├── bcrypt.js
│   │   └── validators.js
│   ├── config/             # Configuraciones
│   │   └── database.js
│   └── server.js           # Servidor principal
├── migrations/             # Migraciones de BD
├── seeders/                # Datos de prueba
├── package.json
└── .env.example
```

## Convenciones de Nomenclatura

### Frontend
- **Componentes**: PascalCase (ej: `PetCard.jsx`, `AppointmentForm.jsx`)
- **Hooks**: camelCase con prefijo `use` (ej: `useAuth.js`, `usePets.js`)
- **Servicios**: camelCase con sufijo `.service.js` (ej: `auth.service.js`)
- **Utilidades**: camelCase (ej: `helpers.js`, `validators.js`)

### Backend
- **Modelos**: PascalCase (ej: `User.js`, `Pet.js`)
- **Controladores**: camelCase con sufijo `.controller.js` (ej: `auth.controller.js`)
- **Rutas**: camelCase con sufijo `.routes.js` (ej: `auth.routes.js`)
- **Servicios**: camelCase con sufijo `.service.js` (ej: `auth.service.js`)
- **Middlewares**: camelCase con sufijo `.middleware.js` (ej: `auth.middleware.js`)

## Flujo de Datos

1. **Frontend** → Realiza petición HTTP a través de servicios
2. **Backend** → Recibe petición en ruta → Middleware (auth/validación) → Controller
3. **Controller** → Llama a Service para lógica de negocio
4. **Service** → Interactúa con Models (Sequelize) → Base de Datos
5. **Response** → Controller → Frontend

## Roles y Permisos

- **Tutor**: Puede gestionar sus mascotas, crear turnos, ver historias clínicas
- **Veterinario**: Puede gestionar turnos, crear historias clínicas, gestionar veterinarias
- **Refugio**: Puede publicar adopciones, registrar seguimientos
- **Admin**: Acceso completo al sistema

---

*Documento en desarrollo - se actualizará conforme avance el proyecto*

