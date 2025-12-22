import express from 'express'
import { getAllAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointmentController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticate, getAllAppointments)
router.get('/:id', authenticate, getAppointmentById)
router.post('/', authenticate, createAppointment)
router.put('/:id', authenticate, updateAppointment)
router.delete('/:id', authenticate, deleteAppointment)

export default router

