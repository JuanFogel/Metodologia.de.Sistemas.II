import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

export const registerUser = async (userData) => {
  const { email, password, firstName, lastName, phone, role } = userData

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ where: { email } })
  if (existingUser) {
    throw new Error('El email ya está registrado')
  }

  // Crear usuario
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    phone,
    role: role || 'Tutor'
  })

  // Generar token
  const token = generateToken(user.id)

  // Retornar usuario sin password
  const userResponse = user.toJSON()
  delete userResponse.password

  return { user: userResponse, token }
}

export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } })

  if (!user) {
    throw new Error('Credenciales inválidas')
  }

  const isPasswordValid = await user.comparePassword(password)

  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas')
  }

  const token = generateToken(user.id)

  const userResponse = user.toJSON()
  delete userResponse.password

  return { user: userResponse, token }
}

