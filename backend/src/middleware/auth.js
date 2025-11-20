import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret-auri'

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization

  if (!header) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }

  const [type, token] = header.split(' ')

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Formato de token inválido' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No autorizado para esta acción' })
    }

    next()
  }
}

// Alias solicitado en la integración del branch Metodología
export const requireRole = (...roles) => authorize(...roles)
