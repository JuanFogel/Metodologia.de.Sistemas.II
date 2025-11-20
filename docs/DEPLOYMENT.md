# 🚀 Guía de Despliegue

*(Esta guía se completará durante el desarrollo)*

## Entornos

### Desarrollo
- Frontend: `http://localhost:5173` (Vite default port)
- Backend: `http://localhost:3000`
- Base de Datos: SQLite (opcional) o PostgreSQL local

### Producción
- Frontend: Vercel/Netlify
- Backend: Render
- Base de Datos: PostgreSQL (Render o servicio externo)

## Backend (Render)

1. Conectar repositorio de GitHub
2. Configurar variables de entorno:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`

## Frontend (Vercel/Netlify)

1. Conectar repositorio de GitHub
2. Configurar variables de entorno:
   - `VITE_API_URL` (URL del backend en Render)
3. Build command: `npm run build`
4. Output directory: `dist`

## Variables de Entorno

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/auri_db
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

---

*Guía en desarrollo*

