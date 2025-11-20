# 🗄️ Esquema de Base de Datos

*(Este esquema se completará durante el desarrollo)*

## Modelos Principales

### Users (Usuarios)
- `id` - UUID/Primary Key
- `email` - String, Unique
- `password` - String (hasheado)
- `firstName` - String
- `lastName` - String
- `phone` - String
- `role` - Enum (Tutor, Veterinario, Refugio, Admin)
- `createdAt` - DateTime
- `updatedAt` - DateTime

### Pets (Mascotas)
- `id` - UUID/Primary Key
- `name` - String
- `species` - String (Perro, Gato, etc.)
- `breed` - String
- `age` - Integer
- `gender` - Enum (Macho, Hembra)
- `userId` - Foreign Key -> Users
- `createdAt` - DateTime
- `updatedAt` - DateTime

### Veterinaries (Veterinarias)
- `id` - UUID/Primary Key
- `name` - String
- `address` - String
- `latitude` - Decimal
- `longitude` - Decimal
- `phone` - String
- `email` - String
- `status` - Enum (Abierta, Cerrada, Guardia)
- `userId` - Foreign Key -> Users (Veterinario responsable)
- `createdAt` - DateTime
- `updatedAt` - DateTime

### Appointments (Turnos)
- `id` - UUID/Primary Key
- `date` - DateTime
- `type` - Enum (Urgencia, Programado)
- `status` - Enum (Pendiente, Confirmado, Cancelado, Completado)
- `petId` - Foreign Key -> Pets
- `veterinaryId` - Foreign Key -> Veterinaries
- `userId` - Foreign Key -> Users (Tutor)
- `notes` - Text
- `createdAt` - DateTime
- `updatedAt` - DateTime

### ClinicalHistories (Historias Clínicas)
- `id` - UUID/Primary Key
- `petId` - Foreign Key -> Pets
- `veterinaryId` - Foreign Key -> Veterinaries
- `veterinarianId` - Foreign Key -> Users (Veterinario)
- `date` - DateTime
- `type` - Enum (Consulta, Vacunación, Cirugía, etc.)
- `diagnosis` - Text
- `treatment` - Text
- `notes` - Text
- `createdAt` - DateTime
- `updatedAt` - DateTime

### Vaccines (Vacunas)
- `id` - UUID/Primary Key
- `clinicalHistoryId` - Foreign Key -> ClinicalHistories
- `name` - String
- `date` - DateTime
- `nextDate` - DateTime (próxima dosis)
- `batch` - String
- `createdAt` - DateTime
- `updatedAt` - DateTime

### Adoptions (Adopciones)
- `id` - UUID/Primary Key
- `petId` - Foreign Key -> Pets
- `shelterId` - Foreign Key -> Users (Refugio)
- `adopterId` - Foreign Key -> Users (Tutor adoptante, nullable)
- `status` - Enum (Disponible, En Proceso, Adoptado, Cancelado)
- `description` - Text
- `requirements` - Text
- `createdAt` - DateTime
- `updatedAt` - DateTime

### AdoptionFollowUps (Seguimientos de Adopción)
- `id` - UUID/Primary Key
- `adoptionId` - Foreign Key -> Adoptions
- `date` - DateTime
- `notes` - Text
- `status` - String
- `createdAt` - DateTime
- `updatedAt` - DateTime

## Relaciones

- Users 1:N Pets
- Users 1:N Veterinaries (como veterinario responsable)
- Users 1:N Appointments (como tutor)
- Users 1:N ClinicalHistories (como veterinario)
- Users 1:N Adoptions (como refugio o adoptante)
- Pets 1:N Appointments
- Pets 1:N ClinicalHistories
- Pets 1:1 Adoptions (una mascota puede tener una adopción activa)
- Veterinaries 1:N Appointments
- Veterinaries 1:N ClinicalHistories
- ClinicalHistories 1:N Vaccines
- Adoptions 1:N AdoptionFollowUps

---

*Esquema en desarrollo - sujeto a cambios*

