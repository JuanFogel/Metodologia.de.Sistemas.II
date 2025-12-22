import express from 'express'
import {
  listAdoptions,
  getAdoptionById,
  createAdoption,
  updateAdoption,
  deleteAdoption,
  createFollowUp
} from '../controllers/adoptionController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()
const shelterRoles = ['Admin', 'Refugio']

router.use(authenticate)

router.get('/', listAdoptions)
router.get('/:id', getAdoptionById)
router.post('/', authorize(...shelterRoles), createAdoption)
router.put('/:id', authorize(...shelterRoles), updateAdoption)
router.delete('/:id', authorize('Admin'), deleteAdoption)
router.post('/:id/follow-ups', authorize(...shelterRoles), createFollowUp)

export default router

