import express from 'express'
import { register, login, getMe } from '../controllers/authController.js'
import { authenticate, authorize, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticate, getMe)

// Endpoints traídos del branch Metodología para debug y control de roles
router.get('/session', authenticate, (req, res) => {
  res.json({ user: req.user })
})

router.get('/admin-only', authenticate, authorize('Admin'), (req, res) => {
  res.json({ message: 'Solo admins pueden ver esto' })
})

// Alias para mantener compatibilidad con requireRole(nombre) usado por el branch alterno
router.get('/admin-only-v2', authenticate, requireRole('Admin'), (req, res) => {
  res.json({ message: 'Ruta espejo usando requireRole' })
})

export default router

