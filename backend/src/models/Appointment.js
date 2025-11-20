import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Urgencia', 'Programado'),
    allowNull: false,
    defaultValue: 'Programado'
  },
  status: {
    type: DataTypes.ENUM('Pendiente', 'Confirmado', 'Cancelado', 'Completado'),
    allowNull: false,
    defaultValue: 'Pendiente'
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
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'appointments',
  timestamps: true
})

export default Appointment
