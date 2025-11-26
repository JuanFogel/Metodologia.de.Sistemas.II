import { Op } from 'sequelize'
import Pet from '../models/Pet.js'
import User from '../models/User.js'

const getLikeOperator = () => {
  try {
    return Pet.sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like
  } catch {
    return Op.like
  }
}

export const getAllPets = async (req, res) => {
  try {
    const { userId, species, gender, search, limit = 100 } = req.query
    const where = {}

    if (userId) where.userId = userId
    if (species) where.species = species
    if (gender) where.gender = gender

    if (search) {
      const likeOp = getLikeOperator()
      const like = { [likeOp]: `%${search}%` }
      where[Op.or] = [
        { name: like },
        { breed: like }
      ]
    }
    
    const pets = await Pet.findAll({
      where,
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: Math.min(Number(limit) || 100, 200)
    })
    res.json(pets)
  } catch (error) {
    console.error('Error al obtener mascotas:', error)
    res.status(500).json({ error: 'Error al obtener mascotas', details: error.message })
  }
}

export const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    })

    if (!pet) {
      return res.status(404).json({ error: 'Mascota no encontrada' })
    }

    res.json(pet)
  } catch (error) {
    console.error('Error al obtener mascota:', error)
    res.status(500).json({ error: 'Error al obtener mascota', details: error.message })
  }
}

export const createPet = async (req, res) => {
  try {
    const { name, species, breed, age, gender, userId } = req.body

    // Si no se proporciona userId, usar el del usuario autenticado
    const ownerId = userId || req.user.id

    const pet = await Pet.create({
      name,
      species,
      breed,
      age,
      gender,
      userId: ownerId
    })

    const petWithOwner = await Pet.findByPk(pet.id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    })

    res.status(201).json({
      message: 'Mascota creada exitosamente',
      pet: petWithOwner
    })
  } catch (error) {
    console.error('Error al crear mascota:', error)
    res.status(500).json({ error: 'Error al crear mascota', details: error.message })
  }
}

export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id)

    if (!pet) {
      return res.status(404).json({ error: 'Mascota no encontrada' })
    }

    // Verificar que el usuario sea el dueño o admin
    if (pet.userId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'No autorizado para actualizar esta mascota' })
    }

    const { name, species, breed, age, gender } = req.body

    if (name) pet.name = name
    if (species) pet.species = species
    if (breed !== undefined) pet.breed = breed
    if (age !== undefined) pet.age = age
    if (gender) pet.gender = gender

    await pet.save()

    const petWithOwner = await Pet.findByPk(pet.id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    })

    res.json({
      message: 'Mascota actualizada exitosamente',
      pet: petWithOwner
    })
  } catch (error) {
    console.error('Error al actualizar mascota:', error)
    res.status(500).json({ error: 'Error al actualizar mascota', details: error.message })
  }
}

export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id)

    if (!pet) {
      return res.status(404).json({ error: 'Mascota no encontrada' })
    }

    // Verificar que el usuario sea el dueño o admin
    if (pet.userId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'No autorizado para eliminar esta mascota' })
    }

    await pet.destroy()

    res.json({ message: 'Mascota eliminada exitosamente' })
  } catch (error) {
    console.error('Error al eliminar mascota:', error)
    res.status(500).json({ error: 'Error al eliminar mascota', details: error.message })
  }
}
