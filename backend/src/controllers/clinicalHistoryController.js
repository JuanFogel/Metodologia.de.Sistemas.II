import ClinicalHistory from '../models/ClinicalHistory.js'
import Pet from '../models/Pet.js'
import Veterinary from '../models/Veterinary.js'
import User from '../models/User.js'
import Vaccine from '../models/Vaccine.js'

export const getAllClinicalHistories = async (req, res) => {
  try {
    const { petId } = req.query
    const where = petId ? { petId } : {}

    const histories = await ClinicalHistory.findAll({
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
          as: 'veterinarian',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Vaccine,
          as: 'vaccines'
        }
      ],
      order: [['date', 'DESC']]
    })
    res.json(histories)
  } catch (error) {
    console.error('Error al obtener historias clínicas:', error)
    res.status(500).json({ error: 'Error al obtener historias clínicas', details: error.message })
  }
}

export const getClinicalHistoryById = async (req, res) => {
  try {
    const history = await ClinicalHistory.findByPk(req.params.id, {
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
          as: 'veterinarian',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Vaccine,
          as: 'vaccines'
        }
      ]
    })

    if (!history) {
      return res.status(404).json({ error: 'Historia clínica no encontrada' })
    }

    res.json(history)
  } catch (error) {
    console.error('Error al obtener historia clínica:', error)
    res.status(500).json({ error: 'Error al obtener historia clínica', details: error.message })
  }
}

export const getClinicalHistoriesByPet = async (req, res) => {
  try {
    const histories = await ClinicalHistory.findAll({
      where: { petId: req.params.petId },
      include: [
        {
          model: Veterinary,
          as: 'veterinary',
          attributes: ['id', 'name', 'address']
        },
        {
          model: User,
          as: 'veterinarian',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Vaccine,
          as: 'vaccines'
        }
      ],
      order: [['date', 'DESC']]
    })
    res.json(histories)
  } catch (error) {
    console.error('Error al obtener historias clínicas:', error)
    res.status(500).json({ error: 'Error al obtener historias clínicas', details: error.message })
  }
}

export const createClinicalHistory = async (req, res) => {
  try {
    const { petId, veterinaryId, date, type, diagnosis, treatment, notes, veterinarianId } = req.body

    // Si no se proporciona veterinarianId, usar el del usuario autenticado
    const vetId = veterinarianId || req.user.id

    const history = await ClinicalHistory.create({
      petId,
      veterinaryId,
      veterinarianId: vetId,
      date: date || new Date(),
      type: type || 'Consulta',
      diagnosis,
      treatment,
      notes
    })

    const historyWithRelations = await ClinicalHistory.findByPk(history.id, {
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
          as: 'veterinarian',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    })

    res.status(201).json({
      message: 'Historia clínica creada exitosamente',
      history: historyWithRelations
    })
  } catch (error) {
    console.error('Error al crear historia clínica:', error)
    res.status(500).json({ error: 'Error al crear historia clínica', details: error.message })
  }
}

export const updateClinicalHistory = async (req, res) => {
  try {
    const history = await ClinicalHistory.findByPk(req.params.id)

    if (!history) {
      return res.status(404).json({ error: 'Historia clínica no encontrada' })
    }

    // Verificar permisos
    if (history.veterinarianId !== req.user.id && 
        req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'No autorizado para actualizar esta historia clínica' })
    }

    const { date, type, diagnosis, treatment, notes } = req.body

    if (date) history.date = date
    if (type) history.type = type
    if (diagnosis !== undefined) history.diagnosis = diagnosis
    if (treatment !== undefined) history.treatment = treatment
    if (notes !== undefined) history.notes = notes

    await history.save()

    const historyWithRelations = await ClinicalHistory.findByPk(history.id, {
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
          as: 'veterinarian',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Vaccine,
          as: 'vaccines'
        }
      ]
    })

    res.json({
      message: 'Historia clínica actualizada exitosamente',
      history: historyWithRelations
    })
  } catch (error) {
    console.error('Error al actualizar historia clínica:', error)
    res.status(500).json({ error: 'Error al actualizar historia clínica', details: error.message })
  }
}

