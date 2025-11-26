import User from './User.js'
import Pet from './Pet.js'
import Veterinary from './Veterinary.js'
import Appointment from './Appointment.js'
import ClinicalHistory from './ClinicalHistory.js'
import Vaccine from './Vaccine.js'
import Adoption from './Adoption.js'
import AdoptionFollowUp from './AdoptionFollowUp.js'
import File from './File.js'

// Definir relaciones
User.hasMany(Pet, { foreignKey: 'userId', as: 'pets' })
Pet.belongsTo(User, { foreignKey: 'userId', as: 'owner' })

User.hasMany(Veterinary, { foreignKey: 'userId', as: 'veterinaries' })
Veterinary.belongsTo(User, { foreignKey: 'userId', as: 'responsible' })

User.hasMany(Appointment, { foreignKey: 'userId', as: 'appointments' })
Appointment.belongsTo(User, { foreignKey: 'userId', as: 'tutor' })

Pet.hasMany(Appointment, { foreignKey: 'petId', as: 'appointments' })
Appointment.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' })

Veterinary.hasMany(Appointment, { foreignKey: 'veterinaryId', as: 'appointments' })
Appointment.belongsTo(Veterinary, { foreignKey: 'veterinaryId', as: 'veterinary' })

Pet.hasMany(ClinicalHistory, { foreignKey: 'petId', as: 'clinicalHistories' })
ClinicalHistory.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' })

Veterinary.hasMany(ClinicalHistory, { foreignKey: 'veterinaryId', as: 'clinicalHistories' })
ClinicalHistory.belongsTo(Veterinary, { foreignKey: 'veterinaryId', as: 'veterinary' })

User.hasMany(ClinicalHistory, { foreignKey: 'veterinarianId', as: 'clinicalHistories' })
ClinicalHistory.belongsTo(User, { foreignKey: 'veterinarianId', as: 'veterinarian' })

ClinicalHistory.hasMany(Vaccine, { foreignKey: 'clinicalHistoryId', as: 'vaccines' })
Vaccine.belongsTo(ClinicalHistory, { foreignKey: 'clinicalHistoryId', as: 'clinicalHistory' })

Pet.hasOne(Adoption, { foreignKey: 'petId', as: 'adoption' })
Adoption.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' })

User.hasMany(Adoption, { foreignKey: 'shelterId', as: 'shelterAdoptions' })
Adoption.belongsTo(User, { foreignKey: 'shelterId', as: 'shelter' })

User.hasMany(Adoption, { foreignKey: 'adopterId', as: 'adoptions' })
Adoption.belongsTo(User, { foreignKey: 'adopterId', as: 'adopter' })

Adoption.hasMany(AdoptionFollowUp, { foreignKey: 'adoptionId', as: 'followUps' })
AdoptionFollowUp.belongsTo(Adoption, { foreignKey: 'adoptionId', as: 'adoption' })
// Archivo pertenece al tutor
File.belongsTo(User, { as: 'fileTutor', foreignKey: 'tutorId' })

// Archivo fue subido por un usuario
File.belongsTo(User, { as: 'uploader', foreignKey: 'uploadedBy' })

export {
  User,
  Pet,
  Veterinary,
  Appointment,
  ClinicalHistory,
  Vaccine,
  Adoption,
  AdoptionFollowUp,
  File
}
