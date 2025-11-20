import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const AdoptionFollowUp = sequelize.define('AdoptionFollowUp', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  adoptionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'adoptions',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'adoption_follow_ups',
  timestamps: true
})

export default AdoptionFollowUp
