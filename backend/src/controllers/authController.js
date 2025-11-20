import User from '../models/User.js'
import { generateToken } from '../utils/jwt.js'

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body

    // Validar que el email no exista
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' })
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
    const token = generateToken(user)

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    })
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ error: 'Error al registrar usuario', details: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    // Buscar usuario
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Verificar contraseña
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Generar token
    const token = generateToken(user)

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ error: 'Error al iniciar sesión', details: error.message })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    res.status(500).json({ error: 'Error al obtener usuario', details: error.message })
  }
}
