import express from 'express'
import {
  listVaccines,
  getVaccineById,
  createVaccine,
  updateVaccine,
  deleteVaccine
} from '../controllers/vaccineController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()
const medicalRoles = ['Admin', 'Veterinario']

router.use(authenticate)

router.get('/', listVaccines)
router.get('/:id', getVaccineById)
router.post('/', authorize(...medicalRoles), createVaccine)
router.put('/:id', authorize(...medicalRoles), updateVaccine)
router.delete('/:id', authorize(...medicalRoles), deleteVaccine)

export default router

