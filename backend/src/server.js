import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { sequelize } from './config/database.js'
import authRoutes from './routes/auth.routes.js'

dotenv.config()
console.log('DB_DIALECT desde .env =>', process.env.DB_DIALECT)

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth', authRoutes) 

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Auri API está funcionando 🐾',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// comienza la conexion a la base de datos
const startServer = async () => {
  try {
    // Probar conexión a la BD
    await sequelize.authenticate()
    console.log('✅ Conectado a la base de datos')

    // Por ahora, sync general (luego lo cambiamos por migraciones)
    await sequelize.sync()
    console.log('✅ Modelos sincronizados')

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
      console.log(`📡 API disponible en http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message)
    process.exit(1)
  }
}

startServer()

