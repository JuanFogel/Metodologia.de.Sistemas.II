import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Vaccine = sequelize.define('Vaccine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clinicalHistoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'clinical_histories',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  nextDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  batch: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'vaccines',
  timestamps: true
})

export default Vaccine
