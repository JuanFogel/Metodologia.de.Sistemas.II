import { Router } from 'express'
import { getMyProfile } from '../controllers/profileController.js'
import { authenticate } from '../middleware/auth.js'


const router = Router()

// Perfil del usuario logueado
router.get('/me', authenticate, getMyProfile)

export default router
