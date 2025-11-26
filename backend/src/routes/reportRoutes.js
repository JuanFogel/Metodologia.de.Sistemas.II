import { Router } from 'express'
import { 
  getAppointmentsReport,
  getVaccinesReport,
  getAdoptionsReport
} from '../controllers/reportController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

// Solo NO TUTOR pueden acceder
router.get('/appointments',
  authenticate,
  authorize('Veterinario', 'Refugio', 'Admin'),
  getAppointmentsReport
)

router.get('/vaccines',
  authenticate,
  authorize('Veterinario', 'Refugio', 'Admin'),
  getVaccinesReport
)

router.get('/adoptions',
  authenticate,
  authorize('Veterinario', 'Refugio', 'Admin'),
  getAdoptionsReport
)

export default router
