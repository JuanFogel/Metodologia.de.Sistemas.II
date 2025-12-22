import PDFDocument from 'pdfkit'
import ExcelJS from 'exceljs'
import { Appointment, Vaccine, Adoption } from '../models/index.js'

// -------------------- Helpers --------------------
const createPDF = (res, title, headers, rows) => {
  const doc = new PDFDocument()

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename=${title}.pdf`)

  doc.pipe(res)
  doc.fontSize(20).text(title, { align: 'center' })
  doc.moveDown()

  headers.forEach(h => doc.text(h, { continued: true, width: 150 }))
  doc.moveDown()

  rows.forEach(row => {
    row.forEach(col => doc.text(String(col), { continued: true, width: 150 }))
    doc.moveDown()
  })

  doc.end()
}

const createExcel = async (res, title, headers, rows) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Reporte')

  sheet.addRow(headers)
  rows.forEach(r => sheet.addRow(r))

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename=${title}.xlsx`)

  await workbook.xlsx.write(res)
  res.end()
}

// -------------------- Controllers --------------------
export const getAppointmentsReport = async (req, res) => {
  const format = req.query.format || 'pdf'

  const data = await Appointment.findAll({
    attributes: ['id', 'date', 'petName', 'ownerName']
  })

  const rows = data.map(d => [
    d.id,
    d.date,
    d.petName,
    d.ownerName
  ])

  const headers = ['ID', 'Fecha', 'Mascota', 'Dueño']

  if (format === 'excel') return createExcel(res, 'turnos', headers, rows)
  return createPDF(res, 'Reporte de Turnos', headers, rows)
}

export const getVaccinesReport = async (req, res) => {
  const format = req.query.format || 'pdf'

  const data = await Vaccine.findAll({
    where: { status: 'pendiente' }
  })

  const rows = data.map(d => [
    d.petName,
    d.vaccineName,
    d.dueDate
  ])

  const headers = ['Mascota', 'Vacuna', 'Vencimiento']

  if (format === 'excel') return createExcel(res, 'vacunas_pendientes', headers, rows)
  return createPDF(res, 'Vacunas Pendientes', headers, rows)
}

export const getAdoptionsReport = async (req, res) => {
  const format = req.query.format || 'pdf'

  const data = await Adoption.findAll({
    attributes: ['petName', 'adopterName', 'status']
  })

  const rows = data.map(d => [
    d.petName,
    d.adopterName,
    d.status
  ])

  const headers = ['Mascota', 'Adoptante', 'Estado']

  if (format === 'excel') return createExcel(res, 'adopciones', headers, rows)
  return createPDF(res, 'Adopciones', headers, rows)
}
