import Adoption from '../models/Adoption.js'
import AdoptionFollowUp from '../models/AdoptionFollowUp.js'
import Pet from '../models/Pet.js'
import User from '../models/User.js'

const includeConfig = [
  {
    model: Pet,
    as: 'pet',
    attributes: ['id', 'name', 'species', 'breed', 'age', 'gender', 'size']
  },
  {
    model: User,
    as: 'shelter',
    attributes: ['id', 'firstName', 'lastName', 'email', 'role']
  },
  {
    model: User,
    as: 'adopter',
    attributes: ['id', 'firstName', 'lastName', 'email', 'role']
  },
  {
    model: AdoptionFollowUp,
    as: 'followUps',
    attributes: ['id', 'notes', 'visitDate', 'createdAt'],
    separate: true,
    order: [['visitDate', 'DESC']]
  }
]

const allowedStatuses = ['Disponible', 'En Proceso', 'Adoptado', 'Cancelado']

export const listAdoptions = async (req, res) => {
  try {
    const { status, shelterId, adopterId } = req.query
    const where = {}

    if (status && allowedStatuses.includes(status)) {
      where.status = status
    }

    if (shelterId) {
      where.shelterId = shelterId
    }

    if (adopterId) {
      where.adopterId = adopterId
    }

    const adoptions = await Adoption.findAll({
      where,
      include: includeConfig,
      order: [['createdAt', 'DESC']]
    })

    res.json(adoptions)
  } catch (error) {
    console.error('Error al listar adopciones:', error)
    res.status(500).json({ error: 'No se pudieron obtener las adopciones', details: error.message })
  }
}

export const getAdoptionById = async (req, res) => {
  try {
    const adoption = await Adoption.findByPk(req.params.id, {
      include: includeConfig
    })

    if (!adoption) {
      return res.status(404).json({ error: 'Adopción no encontrada' })
    }

    res.json(adoption)
  } catch (error) {
    console.error('Error al obtener adopción:', error)
    res.status(500).json({ error: 'No se pudo obtener la adopción', details: error.message })
  }
}

export const createAdoption = async (req, res) => {
  try {
    const { petId, shelterId, description, requirements } = req.body

    if (!petId || !shelterId) {
      return res.status(400).json({ error: 'petId y shelterId son obligatorios' })
    }

    const pet = await Pet.findByPk(petId)
    if (!pet) {
      return res.status(404).json({ error: 'Mascota no encontrada' })
    }

    const shelter = await User.findByPk(shelterId)
    if (!shelter || shelter.role !== 'Refugio') {
      return res.status(400).json({ error: 'El shelterId debe pertenecer a un usuario con rol Refugio' })
    }

    const existingAdoption = await Adoption.findOne({ where: { petId } })
    if (existingAdoption && existingAdoption.status !== 'Cancelado') {
      return res.status(400).json({ error: 'La mascota ya tiene un proceso de adopción activo' })
    }

    const adoption = await Adoption.create({
      petId,
      shelterId,
      description,
      requirements
    })

    const adoptionWithRelations = await Adoption.findByPk(adoption.id, {
      include: includeConfig
    })

    res.status(201).json(adoptionWithRelations)
  } catch (error) {
    console.error('Error al crear adopción:', error)
    res.status(500).json({ error: 'No se pudo crear la adopción', details: error.message })
  }
}

export const updateAdoption = async (req, res) => {
  try {
    const { status, description, requirements, adopterId } = req.body
    const adoption = await Adoption.findByPk(req.params.id)

    if (!adoption) {
      return res.status(404).json({ error: 'Adopción no encontrada' })
    }

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Estado inválido' })
      }
      adoption.status = status
    }

    if (description !== undefined) adoption.description = description
    if (requirements !== undefined) adoption.requirements = requirements

    if (adopterId) {
      const adopter = await User.findByPk(adopterId)
      if (!adopter) {
        return res.status(404).json({ error: 'Adoptante no encontrado' })
      }
      adoption.adopterId = adopterId
    }

    await adoption.save()

    const adoptionWithRelations = await Adoption.findByPk(adoption.id, {
      include: includeConfig
    })

    res.json(adoptionWithRelations)
  } catch (error) {
    console.error('Error al actualizar adopción:', error)
    res.status(500).json({ error: 'No se pudo actualizar la adopción', details: error.message })
  }
}

export const deleteAdoption = async (req, res) => {
  try {
    const adoption = await Adoption.findByPk(req.params.id)

    if (!adoption) {
      return res.status(404).json({ error: 'Adopción no encontrada' })
    }

    await adoption.destroy()
    res.json({ message: 'Adopción eliminada correctamente' })
  } catch (error) {
    console.error('Error al eliminar adopción:', error)
    res.status(500).json({ error: 'No se pudo eliminar la adopción', details: error.message })
  }
}

export const createFollowUp = async (req, res) => {
  try {
    const { notes, visitDate } = req.body
    const { id } = req.params // adoptionId

    const adoption = await Adoption.findByPk(id)
    if (!adoption) {
      return res.status(404).json({ error: 'Adopción no encontrada' })
    }

    const followUp = await AdoptionFollowUp.create({
      adoptionId: id,
      notes,
      visitDate
    })

    res.status(201).json(followUp)
  } catch (error) {
    console.error('Error al crear seguimiento:', error)
    res.status(500).json({ error: 'No se pudo crear el seguimiento', details: error.message })
  }
}

