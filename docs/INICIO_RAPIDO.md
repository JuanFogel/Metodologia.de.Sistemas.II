# 🚀 Guía de Inicio Rápido

Esta guía te ayudará a configurar el proyecto Auri en tu máquina local.

## Prerrequisitos

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **PostgreSQL** (para producción) o **SQLite** (para desarrollo)
- **Git**

## Instalación

### 1. Clonar el repositorio

```bash
git clone [url-del-repositorio]
cd auri-veterinaria
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/auri_db
# O para SQLite:
# DB_PATH=./database.sqlite
JWT_SECRET=tu-clave-secreta-aqui
CORS_ORIGIN=http://localhost:5173
```

### 3. Configurar Base de Datos

#### Opción A: PostgreSQL

```bash
# Crear base de datos
createdb auri_db

# Ejecutar migraciones (cuando estén listas)
npm run migrate
```

#### Opción B: SQLite (Desarrollo)

SQLite se configurará automáticamente si usas `DB_PATH` en el `.env`.

### 4. Iniciar Backend

```bash
npm run dev
```

El servidor debería estar corriendo en `http://localhost:3000`

### 5. Configurar Frontend

En una nueva terminal:

```bash
cd frontend
npm install
```

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 6. Iniciar Frontend

```bash
npm run dev
```

El frontend debería estar corriendo en `http://localhost:5173`

## Verificar Instalación

1. Backend: Visita `http://localhost:3000/api/health` - Deberías ver un JSON con status "OK"
2. Frontend: Visita `http://localhost:5173` - Deberías ver la aplicación

## Estructura de Comandos

### Backend
- `npm run dev` - Inicia servidor en modo desarrollo
- `npm start` - Inicia servidor en modo producción
- `npm run migrate` - Ejecuta migraciones de BD
- `npm run seed` - Ejecuta seeders (datos de prueba)

### Frontend
- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build de producción

## Próximos Pasos

1. Configurar autenticación
2. Crear modelos de base de datos
3. Implementar rutas y controladores
4. Desarrollar componentes del frontend

## Solución de Problemas

### Error de conexión a base de datos
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en `.env`
- Asegúrate de que la base de datos existe

### Error de CORS
- Verifica que `CORS_ORIGIN` en backend coincida con la URL del frontend
- Por defecto: `http://localhost:5173`

### Puerto ya en uso
- Cambia el `PORT` en `.env` del backend
- O cambia el puerto en `vite.config.js` del frontend

---

*Guía en desarrollo - se actualizará conforme avance el proyecto*

