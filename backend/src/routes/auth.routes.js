import { Router } from 'express'
import { register, login } from '../controllers/auth.controller.js'
import { authenticate, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)

// Ruta para probar token
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user })
})

// Ruta de ejemplo sólo para ADMIN
router.get('/admin-only', authenticate, requireRole('ADMIN'), (req, res) => {
  res.json({ message: 'Solo admins pueden ver esto' })
})

export default router
