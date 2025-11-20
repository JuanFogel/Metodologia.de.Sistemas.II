import express from 'express'
import { getAllClinicalHistories, getClinicalHistoryById, getClinicalHistoriesByPet, createClinicalHistory, updateClinicalHistory } from '../controllers/clinicalHistoryController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticate, getAllClinicalHistories)
router.get('/pet/:petId', authenticate, getClinicalHistoriesByPet)
router.get('/:id', authenticate, getClinicalHistoryById)
router.post('/', authenticate, createClinicalHistory)
router.put('/:id', authenticate, updateClinicalHistory)

export default router

