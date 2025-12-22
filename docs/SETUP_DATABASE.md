# 🗄️ Guía de Configuración y Migración de Base de Datos

Esta guía te ayudará a configurar la base de datos del proyecto Auri (PostgreSQL o SQLite) y entender cómo funciona el sistema de migración automática.

## 📋 Prerrequisitos

- **Node.js** (versión 18 o superior)
- **npm** instalado
- **PostgreSQL** (opcional, para producción) o **SQLite** (recomendado para desarrollo rápido)

## 🚀 Configuración Paso a Paso

### Paso 1: Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### Paso 2: Crear Archivo de Configuración `.env`

En el directorio `backend`, crea un archivo llamado `.env` con la siguiente configuración:

#### Opción A: SQLite (Recomendado para Desarrollo Rápido)

```env
NODE_ENV=development
PORT=3000
DB_DIALECT=sqlite
DB_PATH=./database.sqlite
DB_AUTO_SYNC=true
JWT_SECRET=tu-clave-secreta-super-segura-aqui-cambiar-en-produccion
CORS_ORIGIN=http://localhost:5173
```

#### Opción B: PostgreSQL (Para Producción o Desarrollo Avanzado)

Primero, asegúrate de tener PostgreSQL instalado y corriendo. Luego crea la base de datos:

**En Windows (PowerShell o CMD):**
```bash
createdb auri_db
```

**O usando psql:**
```bash
psql -U postgres
CREATE DATABASE auri_db;
\q
```

Luego configura el `.env`:

```env
NODE_ENV=development
PORT=3000
DB_DIALECT=postgres
DB_NAME=auri_db
DB_USER=postgres
DB_PASSWORD=tu-password-de-postgres
DB_HOST=localhost
DB_PORT=5432
DB_AUTO_SYNC=true
JWT_SECRET=tu-clave-secreta-super-segura-aqui-cambiar-en-produccion
CORS_ORIGIN=http://localhost:5173
```

**Nota:** Si tienes una URL completa de PostgreSQL (por ejemplo, de Render o Railway), puedes usar:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://usuario:password@host:puerto/nombre_db
DB_AUTO_SYNC=true
JWT_SECRET=tu-clave-secreta-super-segura-aqui-cambiar-en-produccion
CORS_ORIGIN=http://localhost:5173
```

### Paso 3: Iniciar el Servidor (Migración Automática)

El proyecto está configurado para crear automáticamente las tablas cuando inicias el servidor en modo desarrollo. Esto se hace mediante `sequelize.sync()` que sincroniza los modelos con la base de datos.

Simplemente ejecuta:

```bash
npm run dev
```

Deberías ver mensajes como:
```
✅ Conexión a la base de datos establecida
✅ Modelos sincronizados
🚀 Servidor corriendo en http://localhost:3000
```

**Importante:** Las tablas se crean automáticamente gracias a `sequelize.sync()` cuando `DB_AUTO_SYNC=true` o `NODE_ENV=development`. No necesitas ejecutar migraciones manualmente en desarrollo.

#### ¿Qué tablas se crean automáticamente?

El sistema crea las siguientes tablas basándose en los modelos definidos:

- `users` - Usuarios del sistema (Tutores, Veterinarios, Refugios, Admins)
- `pets` - Mascotas registradas
- `veterinaries` - Veterinarias del sistema
- `appointments` - Turnos/agenda
- `clinical_histories` - Historias clínicas de las mascotas
- `vaccines` - Vacunas registradas
- `adoptions` - Adopciones publicadas
- `adoption_follow_ups` - Seguimientos post-adopción

Todas las relaciones (foreign keys) y restricciones se crean automáticamente.

### Paso 4: Crear Usuario Administrador (Opcional)

Para poder iniciar sesión y probar el backend, necesitas crear un usuario. Puedes crear un usuario administrador usando el endpoint de registro:

**Opción 1: Usando curl (Linux/Mac/Windows con Git Bash)**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@auri.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "Sistema",
    "phone": "+5491112345678",
    "role": "Admin"
  }'
```

**Opción 2: Usando PowerShell (Windows)**

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"email":"admin@auri.com","password":"admin123","firstName":"Admin","lastName":"Sistema","phone":"+5491112345678","role":"Admin"}'
```

**Opción 3: Usando Postman o Thunder Client**

1. Método: `POST`
2. URL: `http://localhost:3000/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "admin@auri.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "Sistema",
  "phone": "+5491112345678",
  "role": "Admin"
}
```

**Luego, para iniciar sesión:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@auri.com",
    "password": "admin123"
  }'
```

La respuesta incluirá un token JWT que puedes usar para autenticarte en otros endpoints.

### Paso 5: Verificar que Todo Funciona

1. **Verificar conexión a la base de datos:**
   - Visita: `http://localhost:3000/api/health`
   - Deberías ver: `{"status":"OK","message":"Auri API está funcionando 🐾",...}`

2. **Verificar que las tablas se crearon:**
   - Ver sección "Verificación de la Base de Datos" más abajo

3. **Verificar creación de usuario:**
   - Si creaste un usuario admin, prueba el login (ver Paso 4)

## 🔄 Cómo Funciona la Migración Automática

El proyecto utiliza **Sequelize ORM** con sincronización automática en modo desarrollo. Esto significa que:

1. **Al iniciar el servidor**, Sequelize compara los modelos definidos en código con la estructura actual de la base de datos
2. **Si faltan tablas**, las crea automáticamente
3. **Si las tablas existen pero tienen diferencias**, puedes usar `alter: true` (no recomendado en producción)
4. **Las relaciones** (foreign keys) se crean automáticamente según las definiciones en `src/models/index.js`

### Orden de Prioridad de Configuración

El sistema busca la configuración de base de datos en este orden:

1. **`DATABASE_URL`** - Si existe, se usa esta URL completa (útil para servicios como Render, Railway)
2. **`DB_DIALECT=sqlite`** - Si está configurado explícitamente, usa SQLite
3. **Variables individuales** (`DB_NAME`, `DB_USER`, etc.) - Para PostgreSQL/MySQL tradicional
4. **`DB_PATH`** - Ruta a archivo SQLite (compatibilidad)
5. **Fallback** - Si nada está configurado, usa SQLite por defecto en `./database.sqlite`

### Desactivar Sincronización Automática

Si prefieres usar migraciones manuales de Sequelize en lugar de la sincronización automática:

```env
DB_AUTO_SYNC=false
NODE_ENV=production
```

Luego deberás crear y ejecutar migraciones manualmente usando `sequelize-cli`.

## 🔍 Verificación de la Base de Datos

### SQLite

Si usas SQLite, puedes verificar que las tablas se crearon correctamente:

```bash
# Instalar sqlite3 si no lo tienes (opcional, solo para verificar)
npm install -g sqlite3

# Conectar a la base de datos
sqlite3 database.sqlite

# Ver tablas
.tables

# Ver estructura de la tabla users
.schema users

# Ver usuarios (si hay alguno)
SELECT email, role FROM users;

# Salir
.quit
```

**Nota:** El archivo `database.sqlite` se creará automáticamente en el directorio `backend` cuando inicies el servidor por primera vez.

### PostgreSQL

Si usas PostgreSQL, puedes conectarte con:

```bash
psql -U postgres -d auri_db
```

Luego ejecuta:
```sql
\dt  -- Ver todas las tablas
\d users  -- Ver estructura de la tabla users
SELECT email, role FROM users;  -- Ver usuarios (si hay alguno)
\q  -- Salir
```

## 🔄 Cambiar de SQLite a PostgreSQL (o viceversa)

Si ya tienes datos en una base de datos y quieres cambiar a otra:

### De SQLite a PostgreSQL

1. **Exportar datos de SQLite** (opcional, si tienes datos importantes):
   ```bash
   sqlite3 database.sqlite .dump > backup.sql
   ```

2. **Configurar PostgreSQL** en el `.env` (ver Paso 2, Opción B)

3. **Crear la base de datos PostgreSQL**:
   ```bash
   createdb auri_db
   ```

4. **Iniciar el servidor** - Las tablas se crearán automáticamente en PostgreSQL

5. **Importar datos** (si es necesario) - Requiere conversión manual o scripts de migración

### De PostgreSQL a SQLite

1. **Exportar datos de PostgreSQL** (opcional):
   ```bash
   pg_dump -U postgres auri_db > backup.sql
   ```

2. **Configurar SQLite** en el `.env` (ver Paso 2, Opción A)

3. **Eliminar o renombrar** el archivo `database.sqlite` si existe (para empezar limpio)

4. **Iniciar el servidor** - Se creará un nuevo archivo SQLite con las tablas

## 🗑️ Resetear la Base de Datos

Si necesitas empezar desde cero (⚠️ **CUIDADO: Esto elimina todos los datos**):

### SQLite

```bash
# Eliminar el archivo de base de datos
rm database.sqlite
# O en Windows:
del database.sqlite

# Reiniciar el servidor para crear tablas nuevas
npm run dev
```

### PostgreSQL

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Eliminar y recrear la base de datos
DROP DATABASE auri_db;
CREATE DATABASE auri_db;
\q

# Reiniciar el servidor para crear tablas nuevas
npm run dev
```

## 🛠️ Solución de Problemas Comunes

### Error: "No se puede conectar a la base de datos"

**Para SQLite:**
- Verifica que el archivo `.env` tenga `DB_DIALECT=sqlite`
- Asegúrate de tener permisos de escritura en el directorio `backend`
- Verifica que la ruta en `DB_PATH` sea correcta (relativa al directorio `backend`)

**Para PostgreSQL:**
- Verifica que PostgreSQL esté corriendo:
  - Windows: Revisa los servicios de Windows
  - Linux/Mac: `pg_isready` o `sudo systemctl status postgresql`
- Revisa las credenciales en `.env` (usuario, contraseña, host, puerto)
- Asegúrate de que la base de datos existe: `psql -U postgres -l`
- Verifica que el usuario tenga permisos: `psql -U postgres -c "\du"`

### Error: "Las tablas no se crean"

- Verifica que `DB_AUTO_SYNC=true` o `NODE_ENV=development` en el `.env`
- Revisa los logs del servidor para ver errores específicos
- Asegúrate de que el servidor se inició correctamente
- Verifica que la conexión a la base de datos fue exitosa antes de la sincronización

### Error: "JWT_SECRET no definido"

- Asegúrate de tener `JWT_SECRET` en tu archivo `.env`
- Debe ser una cadena de texto segura (mínimo 32 caracteres recomendado)
- Ejemplo: `JWT_SECRET=mi-clave-super-secreta-de-al-menos-32-caracteres-123456`

### Error: "EACCES: permission denied" (SQLite)

- Verifica los permisos del directorio `backend`
- En Linux/Mac, puede ser necesario: `chmod 755 backend`
- Asegúrate de que el usuario tenga permisos de escritura

### Error: "password authentication failed" (PostgreSQL)

- Verifica que el usuario y contraseña en `.env` sean correctos
- Prueba conectarte manualmente: `psql -U postgres -d auri_db`
- Si es necesario, cambia la contraseña: `ALTER USER postgres WITH PASSWORD 'nueva-password';`

### Error: "relation already exists" o "table already exists"

Esto ocurre cuando intentas crear tablas que ya existen. Soluciones:

- **Opción 1:** Elimina las tablas existentes y reinicia (ver sección "Resetear la Base de Datos")
- **Opción 2:** Usa `sequelize.sync({ force: true })` en el código (⚠️ elimina todos los datos)
- **Opción 3:** Desactiva `DB_AUTO_SYNC` y usa migraciones manuales

### Error: "Cannot find module" o problemas con dependencias

- Asegúrate de haber ejecutado `npm install` en el directorio `backend`
- Verifica que `pg` (para PostgreSQL) o `sqlite3` (para SQLite) estén instalados
- Si falta alguna dependencia: `npm install pg sqlite3`

### Error: "Port 3000 already in use"

- Cambia el puerto en el `.env`: `PORT=3001`
- O cierra el proceso que está usando el puerto 3000

## 📝 Notas Importantes

1. **Modo Desarrollo:** El proyecto usa `sequelize.sync()` para crear las tablas automáticamente. Esto es útil para desarrollo pero **NO debe usarse en producción**. En producción, deberías usar migraciones de Sequelize.

2. **Base de Datos SQLite:** 
   - El archivo `database.sqlite` se crea automáticamente en el directorio `backend`
   - No requiere instalación ni configuración adicional
   - Perfecto para desarrollo y pruebas rápidas

3. **Base de Datos PostgreSQL:**
   - Requiere tener PostgreSQL instalado y corriendo
   - Necesitas crear la base de datos manualmente antes de iniciar el servidor
   - Más robusta para producción

4. **Seguridad:** 
   - Las contraseñas de usuarios se hashean automáticamente usando bcrypt antes de guardarse
   - Nunca compartas tu archivo `.env` ni lo subas al repositorio
   - Cambia `JWT_SECRET` en producción

5. **Variables de Entorno:**
   - El archivo `.env` debe estar en el directorio `backend`
   - No debe estar versionado en Git (debe estar en `.gitignore`)
   - Cada desarrollador debe crear su propio `.env`
   - Puedes usar `.env.example` como plantilla (si existe en el proyecto)

6. **Archivos de Base de Datos:**
   - **SQLite:** El archivo `database.sqlite` se crea en el directorio `backend`
   - Este archivo debe estar en `.gitignore` (no versionar datos de desarrollo)
   - Puedes hacer backup copiando el archivo directamente

7. **Logs y Debugging:**
   - En desarrollo, Sequelize muestra las consultas SQL en la consola
   - Si no ves los logs, verifica que `NODE_ENV=development` en el `.env`
   - Los errores de conexión se muestran claramente en la consola al iniciar el servidor

## 📚 Recursos Adicionales

- **Documentación de Sequelize:** https://sequelize.org/docs/v6/
- **Documentación de PostgreSQL:** https://www.postgresql.org/docs/
- **Documentación de SQLite:** https://www.sqlite.org/docs.html
- **Guía de Inicio Rápido del Proyecto:** [docs/INICIO_RAPIDO.md](INICIO_RAPIDO.md)
- **Documentación de la API:** [docs/API.md](API.md)

## 🎯 Próximos Pasos

Una vez configurada la base de datos:

1. ✅ Verifica que el servidor esté corriendo correctamente (`http://localhost:3000/api/health`)
2. ✅ Verifica que las tablas se crearon (consulta la sección "Verificación de la Base de Datos")
3. ✅ Prueba los endpoints de la API
4. ✅ Si necesitas crear usuarios, usa el endpoint de registro: `POST /api/auth/register`
5. ✅ Consulta la [documentación de la API](API.md) para más detalles sobre los endpoints disponibles

---

*Última actualización: diciembre 2025*
