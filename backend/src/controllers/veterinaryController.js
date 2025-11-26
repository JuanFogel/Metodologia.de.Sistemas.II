import Veterinary from '../models/Veterinary.js'
import User from '../models/User.js'

export const getAllVeterinaries = async (req, res) => {
  try {
    const { status } = req.query
    const where = status ? { status } : {}
    
    const veterinaries = await Veterinary.findAll({
      where,
      include: [{
        model: User,
        as: 'responsible',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['name', 'ASC']]
    })
    res.json(veterinaries)
  } catch (error) {
    console.error('Error al obtener veterinarias:', error)
    res.status(500).json({ error: 'Error al obtener veterinarias', details: error.message })
  }
}

export const getVeterinaryById = async (req, res) => {
  try {
    const veterinary = await Veterinary.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'responsible',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    })

    if (!veterinary) {
      return res.status(404).json({ error: 'Veterinaria no encontrada' })
    }

    res.json(veterinary)
  } catch (error) {
    console.error('Error al obtener veterinaria:', error)
    res.status(500).json({ error: 'Error al obtener veterinaria', details: error.message })
  }
}

export const createVeterinary = async (req, res) => {
  try {
    const { name, address, latitude, longitude, phone, email, status, userId } = req.body

    // Si no se proporciona userId, usar el del usuario autenticado
    const responsibleId = userId || req.user.id

    const veterinary = await Veterinary.create({
      name,
      address,
      latitude,
      longitude,
      phone,
      email,
      status: status || 'Cerrada',
      userId: responsibleId
    })

    const veterinaryWithUser = await Veterinary.findByPk(veterinary.id, {
      include: [{
        model: User,
        as: 'responsible',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    })

    res.status(201).json({
      message: 'Veterinaria creada exitosamente',
      veterinary: veterinaryWithUser
    })
  } catch (error) {
    console.error('Error al crear veterinaria:', error)
    res.status(500).json({ error: 'Error al crear veterinaria', details: error.message })
  }
}

export const updateVeterinary = async (req, res) => {
  try {
    const veterinary = await Veterinary.findByPk(req.params.id)

    if (!veterinary) {
      return res.status(404).json({ error: 'Veterinaria no encontrada' })
    }

    // Verificar que el usuario sea el responsable o admin
    if (veterinary.userId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'No autorizado para actualizar esta veterinaria' })
    }

    const { name, address, latitude, longitude, phone, email, status } = req.body

    if (name) veterinary.name = name
    if (address) veterinary.address = address
    if (latitude) veterinary.latitude = latitude
    if (longitude) veterinary.longitude = longitude
    if (phone !== undefined) veterinary.phone = phone
    if (email) veterinary.email = email
    if (status) veterinary.status = status

    await veterinary.save()

    const veterinaryWithUser = await Veterinary.findByPk(veterinary.id, {
      include: [{
        model: User,
        as: 'responsible',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    })

    res.json({
      message: 'Veterinaria actualizada exitosamente',
      veterinary: veterinaryWithUser
    })
  } catch (error) {
    console.error('Error al actualizar veterinaria:', error)
    res.status(500).json({ error: 'Error al actualizar veterinaria', details: error.message })
  }
}

export const deleteVeterinary = async (req, res) => {
  try {
    const veterinary = await Veterinary.findByPk(req.params.id)

    if (!veterinary) {
      return res.status(404).json({ error: 'Veterinaria no encontrada' })
    }

    // Verificar que el usuario sea el responsable o admin
    if (veterinary.userId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'No autorizado para eliminar esta veterinaria' })
    }

    await veterinary.destroy()

    res.json({ message: 'Veterinaria eliminada exitosamente' })
  } catch (error) {
    console.error('Error al eliminar veterinaria:', error)
    res.status(500).json({ error: 'Error al eliminar veterinaria', details: error.message })
  }
}
