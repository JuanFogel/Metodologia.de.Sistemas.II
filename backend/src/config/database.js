import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

dotenv.config()

const isDev = process.env.NODE_ENV === 'development'
const logSetting = isDev ? console.log : false

let sequelize

if (process.env.DATABASE_URL) {
  // PostgreSQL gestionado (Render, Railway, etc.)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: logSetting,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production'
        ? { require: true, rejectUnauthorized: false }
        : false
    }
  })
} else if (process.env.DB_DIALECT === 'sqlite') {
  // Permite forzar sqlite explícitamente (aporte del branch Metodología)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || process.env.DB_PATH || './dev.sqlite',
    logging: logSetting
  })
} else if (process.env.DB_NAME && process.env.DB_USER) {
  // Configuración clásica vía variables individuales (PostgreSQL / MySQL)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: process.env.DB_DIALECT || 'postgres',
      logging: logSetting
    }
  )
} else if (process.env.DB_PATH) {
  // Compatibilidad con la configuración previa basada en rutas sqlite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH,
    logging: logSetting
  })
} else {
  // Fallback local para desarrollo rápido
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: logSetting || console.log
  })
}

export const sequelizeInstance = sequelize
export { sequelize }
export default sequelize

