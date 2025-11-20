import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret-auri'

export const authenticate = (req, res, next) => {
  const header = req.headers['authorization']

  if (!header) {
    return res.status(401).json({ error: 'Token no provisto' })
  }

  const [type, token] = header.split(' ')

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Formato de token inválido' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload // { id, role }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

export const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' })
    }
    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tiene permisos para esta operación' })
    }
    next()
  }
}
