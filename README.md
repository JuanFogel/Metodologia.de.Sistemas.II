# 🐾 AURI – Sistema de gestión veterinaria
## Introducción
Nuestro proyecto **AURI** busca ser una plataforma que concentre todo lo relacionado con mascotas y veterinarias.  
La idea es que desde un solo lugar se pueda manejar:

- Turnos en clínicas.  
- Historial médico y vacunas de mascotas.  
- Publicaciones de refugios y adopciones.  
- Reportes y estadísticas.  

Con esto queremos resolver problemas que hoy se hacen de manera desordenada, como turnos confusos, falta de registros claros o no tener un espacio central para adopciones.

---

## Objetivos
- Crear un sistema modular y fácil de ampliar.  
- Unificar en una misma plataforma a **dueños, veterinarios, refugios y administradores**.  
- Mantener una única conexión a la base de datos para mayor consistencia.  
- Implementar **alertas automáticas** (vacunas, turnos, adopciones).  
- Que la interfaz sea clara y sencilla.  
- Tener escalabilidad (ej: donaciones o pagos).  

---

## Alcance del sistema

- **Dueños** → ver mascotas, historial, vacunas y turnos disponibles.  
- **Veterinarios** → gestionar turnos, cargar info clínica y marcar disponibilidad.  
- **Refugios** → publicar mascotas en adopción y hacer seguimiento.  
- **Administrador** → manejar usuarios, permisos y reportes generales.  
- **Notificaciones** → alertas automáticas cuando se cumpla una condición (ej: vacuna pendiente).  
- **Reportes** → estadísticas básicas y posibilidad de exportar info.  

---

## Patrones de diseño aplicados
- **Singleton (Base de datos)** → una sola conexión para todo el sistema.  
- **Factory Method (Usuarios)** → crear distintos tipos de usuarios (dueño, veterinario, refugio, admin).  
- **Observer (Alertas/Notificaciones)** → avisos automáticos sobre cambios de estado.  
- **Facade (Historial clínico)** → acceso simple a la info médica de cada mascota.  
- **Strategy (Pagos/Reservas)** → opcional para soportar distintos métodos de pago o reserva.  

---

## Tecnologías sugeridas
- **Backend:** Python (Flask/Django) o Node.js (Express).  
- **Base de datos:** MySQL / PostgreSQL.  
- **Frontend:** React o similar.  
- **Control de versiones:** Git + GitHub.  
- **Testing:** Pytest / Jest (pruebas unitarias básicas).

---

## Conclusión
**AURI** busca modernizar la gestión veterinaria y de adopciones en un sistema único, fácil de usar y escalable.  
Aplicando patrones de diseño y buenas prácticas.  

---

## 👥 Integrantes

- [Juan Gabriel Fogel](https://github.com/JuanFogel)
- [Geronimo Moraga](https://github.com/nenol)
- [Esteban Julian Granito Quiñones](https://github.com/estebanqui11)

