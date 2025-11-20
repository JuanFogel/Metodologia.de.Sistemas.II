import express from 'express'
import { getAllPets, getPetById, createPet, updatePet, deletePet } from '../controllers/petController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticate, getAllPets)
router.get('/:id', authenticate, getPetById)
router.post('/', authenticate, createPet)
router.put('/:id', authenticate, updatePet)
router.delete('/:id', authenticate, deletePet)

export default router

