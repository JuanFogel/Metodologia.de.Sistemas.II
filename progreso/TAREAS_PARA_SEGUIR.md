# 📋 Tareas para Continuar el Desarrollo

**Proyecto:** Auri - Plataforma de Gestión Veterinaria  
**Estado actual:** 45% completado  
**Última actualización:**

---

## 🎯 Tareas Disponibles por Prioridad

### 🔥 ALTA PRIORIDAD - Funcionalidades Core

#### 1. **Mapa Interactivo con Leaflet** 🗺️ 
**Estado:** Pendiente

**Tareas específicas:**
- [ ] Instalar y configurar react-leaflet en el frontend
- [ ] Crear componente `MapView.jsx` en `frontend/src/components/`
- [ ] Crear página `Map.jsx` en `frontend/src/pages/`
- [ ] Obtener veterinarias desde la API (`GET /api/veterinaries`)
- [ ] Mostrar marcadores en el mapa con diferentes colores según estado:
  - 🟢 Verde: Abierta
  - 🔴 Rojo: Cerrada
  - 🟡 Amarillo: Guardia
- [ ] Agregar popups al hacer clic en marcadores con información de la veterinaria
- [ ] Implementar geolocalización del usuario
- [ ] Agregar filtros por estado (Abierta/Cerrada/Guardia)
- [ ] Agregar ruta en `App.jsx`: `/map`
- [ ] Agregar botón en Dashboard para ir al mapa

**Archivos a crear/modificar:**
- `frontend/src/components/MapView.jsx` (nuevo)
- `frontend/src/pages/Map.jsx` (nuevo)
- `frontend/src/App.jsx` (agregar ruta)
- `frontend/src/pages/Dashboard.jsx` (agregar botón)

**Recursos útiles:**
- Documentación: https://react-leaflet.js.org/
- Ejemplo básico: https://react-leaflet.js.org/docs/start-installation/

---

#### 2. **Frontend de Turnos** 📅  
**Estado:** Pendiente

**Tareas específicas:**
- [ ] Crear página `Appointments.jsx` en `frontend/src/pages/`
- [ ] Listar turnos del usuario (GET `/api/appointments`)
- [ ] Crear formulario para nuevo turno:
  - Selector de mascota (del usuario)
  - Selector de veterinaria
  - Selector de fecha y hora
  - Tipo: Urgencia o Programado
  - Campo de notas
- [ ] Mostrar turnos en formato de lista o tarjetas
- [ ] Agregar filtros: por fecha, estado, tipo
- [ ] Permitir cancelar turnos (cambiar estado a "Cancelado")
- [ ] Vista de agenda (opcional): calendario con turnos
- [ ] Agregar ruta en `App.jsx`: `/appointments`

**Archivos a crear/modificar:**
- `frontend/src/pages/Appointments.jsx` (nuevo)
- `frontend/src/components/AppointmentForm.jsx` (nuevo, opcional)
- `frontend/src/App.jsx` (agregar ruta)
- `frontend/src/pages/Dashboard.jsx` (agregar enlace)

**Endpoints a usar:**
- `GET /api/appointments` - Listar turnos
- `POST /api/appointments` - Crear turno
- `PUT /api/appointments/:id` - Actualizar turno
- `DELETE /api/appointments/:id` - Eliminar turno

---

#### 3. **Frontend de Historias Clínicas** 📋 
**Estado:** Pendiente

**Tareas específicas:**
- [ ] Crear página `ClinicalHistories.jsx` en `frontend/src/pages/`
- [ ] Listar historias clínicas (GET `/api/clinical-histories`)
- [ ] Crear formulario para nueva historia clínica:
  - Selector de mascota
  - Selector de veterinaria
  - Tipo: Consulta, Vacunación, Cirugía, Control, Otro
  - Campos: Diagnóstico, Tratamiento, Notas
  - Fecha
- [ ] Vista de historias por mascota (GET `/api/clinical-histories/pet/:petId`)
- [ ] Mostrar historias en formato de tarjetas o lista
- [ ] Agregar filtros: por mascota, tipo, fecha
- [ ] Vista detallada de cada historia clínica
- [ ] Agregar ruta en `App.jsx`: `/clinical-histories`

**Archivos a crear/modificar:**
- `frontend/src/pages/ClinicalHistories.jsx` (nuevo)
- `frontend/src/components/ClinicalHistoryForm.jsx` (nuevo, opcional)
- `frontend/src/pages/PetDetail.jsx` (nuevo, para ver historias de una mascota)
- `frontend/src/App.jsx` (agregar rutas)

**Endpoints a usar:**
- `GET /api/clinical-histories` - Listar historias
- `GET /api/clinical-histories/pet/:petId` - Historias de una mascota
- `POST /api/clinical-histories` - Crear historia
- `PUT /api/clinical-histories/:id` - Actualizar historia

---

### ⚠️ MEDIA PRIORIDAD - Funcionalidades Importantes

#### 4. **Módulo de Adopciones - Backend** 🐾 
**Estado:** Pendiente

**Tareas específicas:**
- [ ] Crear `backend/src/controllers/adoptionController.js`:
  - `getAllAdoptions` - Listar adopciones (con filtros)
  - `getAdoptionById` - Obtener adopción
  - `createAdoption` - Crear adopción
  - `updateAdoption` - Actualizar adopción
  - `deleteAdoption` - Eliminar adopción
- [ ] Crear `backend/src/controllers/adoptionFollowUpController.js`:
  - `getFollowUpsByAdoption` - Listar seguimientos
  - `createFollowUp` - Crear seguimiento
- [ ] Crear `backend/src/routes/adoptionRoutes.js` con todas las rutas
- [ ] Agregar rutas en `backend/src/server.js`
- [ ] Probar endpoints con Postman

**Archivos a crear:**
- `backend/src/controllers/adoptionController.js` (nuevo)
- `backend/src/controllers/adoptionFollowUpController.js` (nuevo)
- `backend/src/routes/adoptionRoutes.js` (nuevo)

**Endpoints a crear:**
- `GET /api/adoptions` - Listar adopciones
- `GET /api/adoptions/:id` - Obtener adopción
- `POST /api/adoptions` - Crear adopción
- `PUT /api/adoptions/:id` - Actualizar adopción
- `DELETE /api/adoptions/:id` - Eliminar adopción
- `GET /api/adoptions/:id/follow-ups` - Listar seguimientos
- `POST /api/adoptions/:id/follow-ups` - Crear seguimiento

---

#### 5. **Módulo de Adopciones - Frontend** 🐾   
**Estado:** Pendiente

**Tareas específicas:**
- [ ] Crear página `Adoptions.jsx` - Lista de adopciones disponibles
- [ ] Crear página `AdoptionDetail.jsx` - Detalle de adopción
- [ ] Crear formulario para publicar adopción (solo Refugios)
- [ ] Crear formulario de seguimiento post-adopción
- [ ] Agregar filtros: por estado, especie, etc.
- [ ] Agregar rutas en `App.jsx`

**Archivos a crear:**
- `frontend/src/pages/Adoptions.jsx` (nuevo)
- `frontend/src/pages/AdoptionDetail.jsx` (nuevo)
- `frontend/src/components/AdoptionForm.jsx` (nuevo)
- `frontend/src/components/FollowUpForm.jsx` (nuevo)

---

#### 6. **Mejoras en Veterinarias - Frontend** 🏥 
**Estado:** Pendiente

**Tareas específicas:**
- [ ] Crear página `Veterinaries.jsx` - Lista de veterinarias
- [ ] Crear página `VeterinaryDetail.jsx` - Detalle de veterinaria
- [ ] Agregar filtros por estado (Abierta/Cerrada/Guardia)
- [ ] Agregar búsqueda por nombre/dirección
- [ ] Crear formulario para crear/editar veterinaria (Veterinarios/Admins)
- [ ] Agregar rutas en `App.jsx`

**Archivos a crear:**
- `frontend/src/pages/Veterinaries.jsx` (nuevo)
- `frontend/src/pages/VeterinaryDetail.jsx` (nuevo)
- `frontend/src/components/VeterinaryForm.jsx` (nuevo)

---

### 📝 BAJA PRIORIDAD - Mejoras y Optimización

#### 7. **Sistema de Reportes** 📊  
**Estado:** Pendiente

**Tareas específicas:**
- [ ] Instalar librerías: `pdfkit` o `puppeteer` para PDF, `exceljs` para XLS
- [ ] Crear `backend/src/controllers/reportController.js`:
  - `getAppointmentsReport` - Reporte de turnos
  - `getVaccinesReport` - Reporte de vacunas pendientes
  - `getAdoptionsReport` - Reporte de adopciones
- [ ] Crear `backend/src/routes/reportRoutes.js`
- [ ] Crear página en frontend para seleccionar y descargar reportes

---

#### 8. **Mejoras en Gestión de Mascotas** 🐕  
**Estado:** Pendiente

**Tareas específicas:**
- [ ] Agregar funcionalidad de editar mascota en `Pets.jsx`
- [ ] Crear página `PetDetail.jsx` con información completa
- [ ] Agregar vista de historias clínicas de la mascota
- [ ] Agregar vista de turnos de la mascota

---

#### 9. **Mejoras en Dashboard** 📊 
**Estado:** Pendiente

**Tareas específicas:**
- [ ] Agregar más estadísticas en el dashboard
- [ ] Agregar gráficos (usar una librería como Chart.js)
- [ ] Mejorar diseño visual
- [ ] Agregar enlaces rápidos a todas las secciones

---

## 📝 Instrucciones para Trabajar

### 1. Antes de empezar:
```bash
# Asegúrate de tener la última versión
git pull origin main

# Instalar dependencias si es necesario
cd backend && npm install
cd ../frontend && npm install
```

### 2. Crear una rama para tu tarea:
```bash
git checkout -b feature/nombre-de-la-funcionalidad
# Ejemplo: git checkout -b feature/mapa-interactivo
```

### 3. Trabajar en la funcionalidad:
- Seguir las tareas específicas de la lista
- Probar que funciona antes de hacer commit
- Hacer commits frecuentes con mensajes claros

### 4. Al terminar:
```bash
# Hacer commit
git add .
git commit -m "feat: agregar mapa interactivo con Leaflet"

# Subir cambios
git push origin feature/nombre-de-la-funcionalidad
```

### 5. Crear Pull Request:
- Ir a GitHub
- Crear Pull Request desde tu rama a `main`
- Mencionar qué funcionalidad agregaste

---

## 🛠️ Recursos Útiles

### Documentación del Proyecto:
- `README.md` - Información general
- `README_PROGRESO.md` - Análisis detallado del progreso
- `docs/API.md` - Documentación de endpoints
- `docs/DATABASE.md` - Esquema de base de datos

### Endpoints Disponibles:
- Backend corre en: `http://localhost:3000/api`
- Frontend corre en: `http://localhost:5173`

### Estructura de Archivos:
- Backend: `backend/src/`
- Frontend: `frontend/src/`
- Modelos: `backend/src/models/`
- Controladores: `backend/src/controllers/`
- Rutas: `backend/src/routes/`
- Páginas: `frontend/src/pages/`
- Componentes: `frontend/src/components/`

---

## ✅ Checklist Antes de Entregar

Antes de hacer commit, verifica:
- [ ] El código funciona sin errores
- [ ] No hay errores de consola
- [ ] La funcionalidad está completa según las tareas
- [ ] El código sigue el estilo del proyecto
- [ ] Los nombres de variables/funciones son claros
- [ ] Se probó en el navegador (si es frontend)
- [ ] Se probó con Postman (si es backend)

---

## 💡 Tips

1. **Empieza por lo simple:** Haz que funcione básico primero, luego agrega mejoras
2. **Revisa código existente:** Mira cómo están hechas las páginas de Login o Pets para mantener consistencia
3. **Usa Tailwind CSS:** Ya está configurado, aprovecha las clases
4. **Pregunta si tienes dudas:** Mejor preguntar que hacer algo mal
5. **Prueba frecuentemente:** No esperes a terminar todo para probar

---

## 📞 Contacto

Si tienen dudas sobre:
- **Estructura del proyecto:** Revisar `README.md` y `docs/`
- **Endpoints de la API:** Revisar `docs/API.md` o probar con Postman
- **Modelos de base de datos:** Revisar `docs/DATABASE.md` o `backend/src/models/`

--
