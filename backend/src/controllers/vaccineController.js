import { Op } from 'sequelize'
import Vaccine from '../models/Vaccine.js'
import ClinicalHistory from '../models/ClinicalHistory.js'
import Pet from '../models/Pet.js'
import Veterinary from '../models/Veterinary.js'

const includeConfig = [
  {
    model: ClinicalHistory,
    as: 'clinicalHistory',
    attributes: ['id', 'type', 'diagnosis', 'treatment', 'date'],
    include: [
      {
        model: Pet,
        as: 'pet',
        attributes: ['id', 'name', 'species', 'breed', 'userId']
      },
      {
        model: Veterinary,
        as: 'veterinary',
        attributes: ['id', 'name', 'address']
      }
    ]
  }
]

const ensurePermissions = (history, user) => {
  if (!history) {
    return { status: 404, error: 'Historia clínica no encontrada' }
  }

  const isOwner = history.veterinarianId === user.id
  const isAllowedRole = user.role === 'Admin' || user.role === 'Veterinario'

  if (!isOwner && !isAllowedRole) {
    return { status: 403, error: 'No autorizado para modificar esta historia clínica' }
  }

  return null
}

export const listVaccines = async (req, res) => {
  try {
    const { clinicalHistoryId, petId, upcoming } = req.query
    const where = {}

    if (clinicalHistoryId) {
      where.clinicalHistoryId = clinicalHistoryId
    }

    if (upcoming === 'true') {
      where.nextDate = { [Op.ne]: null }
    }

    const vaccines = await Vaccine.findAll({
      where,
      include: includeConfig,
      order: [
        upcoming === 'true' ? ['nextDate', 'ASC'] : ['date', 'DESC']
      ]
    })

    const filtered = petId
      ? vaccines.filter(v => v.clinicalHistory?.pet?.id === petId)
      : vaccines

    res.json(filtered)
  } catch (error) {
    console.error('Error al listar vacunas:', error)
    res.status(500).json({ error: 'No se pudieron obtener las vacunas', details: error.message })
  }
}

export const getVaccineById = async (req, res) => {
  try {
    const vaccine = await Vaccine.findByPk(req.params.id, {
      include: includeConfig
    })

    if (!vaccine) {
      return res.status(404).json({ error: 'Vacuna no encontrada' })
    }

    res.json(vaccine)
  } catch (error) {
    console.error('Error al obtener vacuna:', error)
    res.status(500).json({ error: 'No se pudo obtener la vacuna', details: error.message })
  }
}

export const createVaccine = async (req, res) => {
  try {
    const { clinicalHistoryId, name, date, nextDate, batch } = req.body

    if (!clinicalHistoryId || !name) {
      return res.status(400).json({ error: 'clinicalHistoryId y name son obligatorios' })
    }

    const history = await ClinicalHistory.findByPk(clinicalHistoryId)
    const permissionError = ensurePermissions(history, req.user)
    if (permissionError) {
      return res.status(permissionError.status).json({ error: permissionError.error })
    }

    const vaccine = await Vaccine.create({
      clinicalHistoryId,
      name,
      date: date || new Date(),
      nextDate,
      batch
    })

    const vaccineWithRelations = await Vaccine.findByPk(vaccine.id, {
      include: includeConfig
    })

    res.status(201).json({
      message: 'Vacuna registrada exitosamente',
      vaccine: vaccineWithRelations
    })
  } catch (error) {
    console.error('Error al crear vacuna:', error)
    res.status(500).json({ error: 'No se pudo registrar la vacuna', details: error.message })
  }
}

export const updateVaccine = async (req, res) => {
  try {
    const vaccine = await Vaccine.findByPk(req.params.id)

    if (!vaccine) {
      return res.status(404).json({ error: 'Vacuna no encontrada' })
    }

    const history = await ClinicalHistory.findByPk(vaccine.clinicalHistoryId)
    const permissionError = ensurePermissions(history, req.user)
    if (permissionError) {
      return res.status(permissionError.status).json({ error: permissionError.error })
    }

    const { name, date, nextDate, batch } = req.body

    if (name) vaccine.name = name
    if (date) vaccine.date = date
    if (nextDate !== undefined) vaccine.nextDate = nextDate
    if (batch !== undefined) vaccine.batch = batch

    await vaccine.save()

    const vaccineWithRelations = await Vaccine.findByPk(vaccine.id, {
      include: includeConfig
    })

    res.json({
      message: 'Vacuna actualizada exitosamente',
      vaccine: vaccineWithRelations
    })
  } catch (error) {
    console.error('Error al actualizar vacuna:', error)
    res.status(500).json({ error: 'No se pudo actualizar la vacuna', details: error.message })
  }
}

export const deleteVaccine = async (req, res) => {
  try {
    const vaccine = await Vaccine.findByPk(req.params.id)

    if (!vaccine) {
      return res.status(404).json({ error: 'Vacuna no encontrada' })
    }

    const history = await ClinicalHistory.findByPk(vaccine.clinicalHistoryId)
    const permissionError = ensurePermissions(history, req.user)
    if (permissionError) {
      return res.status(permissionError.status).json({ error: permissionError.error })
    }

    await vaccine.destroy()
    res.json({ message: 'Vacuna eliminada correctamente' })
  } catch (error) {
    console.error('Error al eliminar vacuna:', error)
    res.status(500).json({ error: 'No se pudo eliminar la vacuna', details: error.message })
  }
}

