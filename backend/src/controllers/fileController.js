import File from '../models/File.js'
import User from '../models/User.js'
import path from 'path'
import fs from 'fs'

export const uploadFile = async (req, res) => {
  try {
    const { tutorEmail } = req.body

    if (!tutorEmail) {
      return res.status(400).json({ error: 'Debe especificar un email de tutor' })
    }

    // Buscar usuario
    const tutor = await User.findOne({ where: { email: tutorEmail } })

    if (!tutor) {
      return res.status(404).json({ error: 'No existe un tutor con ese email' })
    }

    if (tutor.role !== "Tutor") {
      return res.status(400).json({ error: 'El usuario no es un tutor' })
    }

    // Crear registro de archivo
    await File.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      tutorId: tutor.id
    })

    res.json({ message: 'Archivo subido y vinculado al tutor' })
  } catch (error) {
    console.error("ERROR EN uploadFile:", error)
    res.status(500).json({ error: error.message })
  }
}

export const getFiles = async (req, res) => {
  try {
    const files = await File.findAll({
      where: { tutorId: req.user.id },
      attributes: ['id', 'originalName', 'filename']
    })

    res.json(files)
  } catch (error) {
    console.error("ERROR EN getFiles:", error)
    res.status(500).json({ error: error.message })
  }
}

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id)

    if (!file) {
      return res.status(404).json({ error: 'Archivo no encontrado' })
    }

    if (file.tutorId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permisos para descargar este archivo' })
    }

    const filePath = path.join('uploads', file.filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo físico no encontrado' })
    }

    res.download(filePath, file.originalName)
  } catch (error) {
    console.error("ERROR EN downloadFile:", error)
    res.status(500).json({ error: error.message })
  }
}
