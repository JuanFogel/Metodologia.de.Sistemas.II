import express from 'express'
import { getAllUsers, getUserById, updateUser, deleteUser, changePassword } from '../controllers/userController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticate, authorize('Admin'), getAllUsers)
router.get('/:id', authenticate, getUserById)
router.put('/:id', authenticate, updateUser)
router.put('/:id/password', authenticate, changePassword)
router.delete('/:id', authenticate, authorize('Admin'), deleteUser)

export default router

