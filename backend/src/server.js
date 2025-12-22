import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import sequelize from './config/database.js'
import './models/index.js' // Cargar modelos y relaciones

// Routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import petRoutes from './routes/petRoutes.js'
import veterinaryRoutes from './routes/veterinaryRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import clinicalHistoryRoutes from './routes/clinicalHistoryRoutes.js'
import adoptionRoutes from './routes/adoptionRoutes.js'
import vaccineRoutes from './routes/vaccineRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import filesRouter from './routes/files.js'

dotenv.config()
console.log('DB_DIALECT desde .env =>', process.env.DB_DIALECT || 'no definido')

const app = express()
const PORT = process.env.PORT || 3000
const shouldAutoSync = process.env.DB_AUTO_SYNC === 'true' || process.env.NODE_ENV === 'development'

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Auri API está funcionando 🐾',
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/pets', petRoutes)
app.use('/api/veterinaries', veterinaryRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/clinical-histories', clinicalHistoryRoutes)
app.use('/api/adoptions', adoptionRoutes)
app.use('/api/vaccines', vaccineRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/files', filesRouter)


// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// Inicializar base de datos y servidor
const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Conexión a la base de datos establecida')

    if (shouldAutoSync) {
      await sequelize.sync({ alter: false })
      console.log('✅ Modelos sincronizados')
    } else {
      console.log('ℹ️ Sincronización automática desactivada (usa migraciones)')
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
      console.log(`📡 API disponible en http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error)
    process.exit(1)
  }
}

startServer()

