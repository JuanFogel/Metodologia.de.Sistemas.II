import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Adoption = sequelize.define('Adoption', {
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
  shelterId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  adopterId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('Disponible', 'En Proceso', 'Adoptado', 'Cancelado'),
    allowNull: false,
    defaultValue: 'Disponible'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'adoptions',
  timestamps: true
})

export default Adoption
