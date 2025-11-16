# 📡 Documentación de la API

*(Esta documentación se completará durante el desarrollo)*

## Base URL

```
http://localhost:3000/api (desarrollo)
https://auri-api.onrender.com/api (producción)
```

## Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación.

### Endpoints de Autenticación

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

## Roles

- **Tutor** - Dueño de mascotas
- **Veterinario** - Profesional veterinario
- **Refugio** - Organización de adopciones
- **Admin** - Administrador del sistema

## Endpoints por Módulo

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Mascotas
- `GET /api/pets` - Listar mascotas
- `GET /api/pets/:id` - Obtener mascota
- `POST /api/pets` - Crear mascota
- `PUT /api/pets/:id` - Actualizar mascota
- `DELETE /api/pets/:id` - Eliminar mascota

### Veterinarias
- `GET /api/veterinaries` - Listar veterinarias
- `GET /api/veterinaries/:id` - Obtener veterinaria
- `POST /api/veterinaries` - Crear veterinaria
- `PUT /api/veterinaries/:id` - Actualizar veterinaria
- `DELETE /api/veterinaries/:id` - Eliminar veterinaria

### Turnos
- `GET /api/appointments` - Listar turnos
- `GET /api/appointments/:id` - Obtener turno
- `POST /api/appointments` - Crear turno
- `PUT /api/appointments/:id` - Actualizar turno
- `DELETE /api/appointments/:id` - Eliminar turno

### Historias Clínicas
- `GET /api/clinical-histories` - Listar historias clínicas
- `GET /api/clinical-histories/:id` - Obtener historia clínica
- `GET /api/clinical-histories/pet/:petId` - Obtener historias por mascota
- `POST /api/clinical-histories` - Crear historia clínica
- `PUT /api/clinical-histories/:id` - Actualizar historia clínica

### Adopciones
- `GET /api/adoptions` - Listar adopciones
- `GET /api/adoptions/:id` - Obtener adopción
- `POST /api/adoptions` - Crear adopción
- `PUT /api/adoptions/:id` - Actualizar adopción
- `POST /api/adoptions/:id/follow-up` - Registrar seguimiento

### Reportes
- `GET /api/reports/appointments` - Reporte de turnos (PDF/XLS)
- `GET /api/reports/vaccines` - Reporte de vacunas pendientes (PDF/XLS)
- `GET /api/reports/adoptions` - Reporte de adopciones (PDF/XLS)

---

*Documentación en desarrollo*

