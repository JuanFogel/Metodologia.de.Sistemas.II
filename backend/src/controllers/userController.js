import { Op } from 'sequelize'
import bcrypt from 'bcrypt'
import User from '../models/User.js'

const getLikeOperator = () => {
  try {
    return User.sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like
  } catch {
    return Op.like
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const { role, search, limit = 100 } = req.query
    const where = {}

    if (role) {
      where.role = role
    }

    if (search) {
      const likeOp = getLikeOperator()
      const like = { [likeOp]: `%${search}%` }
      where[Op.or] = [
        { firstName: like },
        { lastName: like },
        { email: like }
      ]
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: Math.min(Number(limit) || 100, 200)
    })
    res.json(users)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message })
  }
}

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json(user)
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    res.status(500).json({ error: 'Error al obtener usuario', details: error.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body
    const user = await User.findByPk(req.params.id)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Verificar permisos: solo puede actualizar su propio perfil o ser Admin
    if (user.id !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'No autorizado para actualizar este usuario' })
    }

    // Solo permitir actualizar ciertos campos
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (phone) user.phone = phone

    await user.save()

    res.json({
      message: 'Usuario actualizado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    res.status(500).json({ error: 'Error al actualizar usuario', details: error.message })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.params.id

    // Verificar que el usuario solo puede cambiar su propia contraseña
    if (userId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'No autorizado para cambiar esta contraseña' })
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Se requiere contraseña actual y nueva contraseña' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' })
    }

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Verificar contraseña actual
    const isPasswordValid = await user.comparePassword(currentPassword)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' })
    }

    // Actualizar contraseña (el hook del modelo la hasheará automáticamente)
    user.password = newPassword
    await user.save()

    res.json({ message: 'Contraseña actualizada exitosamente' })
  } catch (error) {
    console.error('Error al cambiar contraseña:', error)
    res.status(500).json({ error: 'Error al cambiar contraseña', details: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    await user.destroy()

    res.json({ message: 'Usuario eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    res.status(500).json({ error: 'Error al eliminar usuario', details: error.message })
  }
}
