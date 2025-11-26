import express from 'express'
import { getAllVeterinaries, getVeterinaryById, createVeterinary, updateVeterinary, deleteVeterinary } from '../controllers/veterinaryController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getAllVeterinaries)
router.get('/:id', getVeterinaryById)
router.post('/', authenticate, createVeterinary)
router.put('/:id', authenticate, updateVeterinary)
router.delete('/:id', authenticate, deleteVeterinary)

export default router

