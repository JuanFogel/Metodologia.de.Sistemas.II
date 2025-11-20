import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const ClinicalHistory = sequelize.define('ClinicalHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  petId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'pets',
      key: 'id'
    }
  },
  veterinaryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'veterinaries',
      key: 'id'
    }
  },
  veterinarianId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  type: {
    type: DataTypes.ENUM('Consulta', 'Vacunación', 'Cirugía', 'Control', 'Otro'),
    allowNull: false,
    defaultValue: 'Consulta'
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  treatment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'clinical_histories',
  timestamps: true
})

export default ClinicalHistory
