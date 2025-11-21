// backend/src/controllers/profileController.js
import User from '../models/User.js'

// GET /api/profile/me
export const getMyProfile = async (req, res) => {
  try {
    const { id, role } = req.user || {}

    if (!id) {
      return res.status(401).json({ error: 'No hay usuario autenticado' })
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'passwordHash'] } 
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    return res.json({
      role,      // rol de cada usuario
      profile: user
    })
  } catch (error) {
    console.error('Error en getMyProfile:', error)
    res.status(500).json({ error: 'Error en el servidor' })
  }
}
