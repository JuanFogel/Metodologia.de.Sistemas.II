import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import User from './User.js'

const File = sequelize.define('File', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tutorId: {
    type: DataTypes.UUID,
    allowNull: false
  }
})

// Relación
File.belongsTo(User, { foreignKey: 'tutorId', as: 'tutor' })  // un archivo tiene un tutor
User.hasMany(File, { foreignKey: 'tutorId', as: 'files' })    // un usuario tiene muchos archivos


export default File
