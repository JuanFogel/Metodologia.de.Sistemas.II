import Appointment from '../models/Appointment.js'
import Pet from '../models/Pet.js'
import Veterinary from '../models/Veterinary.js'
import User from '../models/User.js'

export const getAllAppointments = async (req, res) => {
  try {
    const { userId, petId, veterinaryId, status } = req.query
    const where = {}
    
    if (userId) where.userId = userId
    if (petId) where.petId = petId
    if (veterinaryId) where.veterinaryId = veterinaryId
    if (status) where.status = status

    const appointments = await Appointment.findAll({
      where,
      include: [
        {
          model: Pet,
          as: 'pet',
          attributes: ['id', 'name', 'species', 'breed']
        },
        {
          model: Veterinary,
          as: 'veterinary',
          attributes: ['id', 'name', 'address']
        },
        {
          model: User,
          as: 'tutor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['date', 'ASC']]
    })
    res.json(appointments)
  } catch (error) {
    console.error('Error al obtener turnos:', error)
    res.status(500).json({ error: 'Error al obtener turnos', details: error.message })
  }
}

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: Pet,
          as: 'pet',
          include: [{
            model: User,
            as: 'owner',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }]
        },
        {
          model: Veterinary,
          as: 'veterinary'
        },
        {
          model: User,
          as: 'tutor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    })

    if (!appointment) {
      return res.status(404).json({ error: 'Turno no encontrado' })
    }

    res.json(appointment)
  } catch (error) {
    console.error('Error al obtener turno:', error)
    res.status(500).json({ error: 'Error al obtener turno', details: error.message })
  }
}

export const createAppointment = async (req, res) => {
  try {
    const { date, type, petId, veterinaryId, notes, userId } = req.body

    // Si no se proporciona userId, usar el del usuario autenticado
    const tutorId = userId || req.user.id

    const appointment = await Appointment.create({
      date,
      type: type || 'Programado',
      petId,
      veterinaryId,
      userId: tutorId,
      notes,
      status: 'Pendiente'
    })

    const appointmentWithRelations = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: Pet,
          as: 'pet'
        },
        {
          model: Veterinary,
          as: 'veterinary'
        },
        {
          model: User,
          as: 'tutor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    })

    res.status(201).json({
      message: 'Turno creado exitosamente',
      appointment: appointmentWithRelations
    })
  } catch (error) {
    console.error('Error al crear turno:', error)
    res.status(500).json({ error: 'Error al crear turno', details: error.message })
  }
}

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id)

    if (!appointment) {
      return res.status(404).json({ error: 'Turno no encontrado' })
    }

    // Verificar permisos
    if (appointment.userId !== req.user.id && 
        req.user.role !== 'Admin' && 
        req.user.role !== 'Veterinario') {
      return res.status(403).json({ error: 'No autorizado para actualizar este turno' })
    }

    const { date, type, status, notes } = req.body

    if (date) appointment.date = date
    if (type) appointment.type = type
    if (status) appointment.status = status
    if (notes !== undefined) appointment.notes = notes

    await appointment.save()

    const appointmentWithRelations = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: Pet,
          as: 'pet'
        },
        {
          model: Veterinary,
          as: 'veterinary'
        },
        {
          model: User,
          as: 'tutor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    })

    res.json({
      message: 'Turno actualizado exitosamente',
      appointment: appointmentWithRelations
    })
  } catch (error) {
    console.error('Error al actualizar turno:', error)
    res.status(500).json({ error: 'Error al actualizar turno', details: error.message })
  }
}

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id)

    if (!appointment) {
      return res.status(404).json({ error: 'Turno no encontrado' })
    }

    // Verificar permisos
    if (appointment.userId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'No autorizado para eliminar este turno' })
    }

    await appointment.destroy()

    res.json({ message: 'Turno eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar turno:', error)
    res.status(500).json({ error: 'Error al eliminar turno', details: error.message })
  }
}
