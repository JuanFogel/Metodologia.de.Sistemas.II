import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

function Calendar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('month') // 'day', 'week', 'month'
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchAppointments()
  }, [user, navigate, currentDate])

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments')
      setAppointments(response.data)
    } catch (error) {
      console.error('Error al obtener turnos:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Días del mes anterior para completar la semana
    const prevMonth = new Date(year, month, 0)
    const daysInPrevMonth = prevMonth.getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false
      })
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      })
    }
    
    // Días del mes siguiente para completar la semana
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false
      })
    }
    
    return days
  }

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate.toDateString() === date.toDateString()
    })
  }

  const getAppointmentsForWeek = () => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate >= startOfWeek && aptDate <= endOfWeek
    })
  }

  const getAppointmentsForDay = () => {
    const dayStart = new Date(currentDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(currentDate)
    dayEnd.setHours(23, 59, 59, 999)
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate >= dayStart && aptDate <= dayEnd
    }).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction * 7))
    setCurrentDate(newDate)
  }

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + direction)
    setCurrentDate(newDate)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Cancelado':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'Completado':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Volver al Dashboard
              </button>
              <h1 className="text-xl font-bold text-gray-900">Agenda 📅</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Controles */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setView('day')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    view === 'day' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Día
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    view === 'week' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Semana
                </button>
                <button
                  onClick={() => setView('month')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    view === 'month' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Mes
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (view === 'day') navigateDay(-1)
                    else if (view === 'week') navigateWeek(-1)
                    else navigateMonth(-1)
                  }}
                  className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                >
                  Hoy
                </button>
                <button
                  onClick={() => {
                    if (view === 'day') navigateDay(1)
                    else if (view === 'week') navigateWeek(1)
                    else navigateMonth(1)
                  }}
                  className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Vista Mensual */}
          {view === 'month' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 bg-indigo-600 text-white">
                <h2 className="text-xl font-bold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {dayNames.map(day => (
                  <div key={day} className="bg-gray-100 p-2 text-center text-sm font-semibold text-gray-700">
                    {day}
                  </div>
                ))}
                {getDaysInMonth(currentDate).map((day, index) => {
                  const dayAppointments = getAppointmentsForDate(day.date)
                  const isToday = day.date.toDateString() === new Date().toDateString()
                  
                  return (
                    <div
                      key={index}
                      className={`bg-white p-2 min-h-[100px] ${
                        !day.isCurrentMonth ? 'text-gray-400' : ''
                      } ${isToday ? 'bg-blue-50 border-2 border-blue-500' : ''}`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-700' : ''}`}>
                        {day.date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 3).map(apt => (
                          <div
                            key={apt.id}
                            onClick={() => setSelectedAppointment(apt)}
                            className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getStatusColor(apt.status)}`}
                            title={`${apt.pet?.name || 'Mascota'} - ${new Date(apt.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`}
                          >
                            {new Date(apt.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} - {apt.pet?.name || 'Mascota'}
                          </div>
                        ))}
                        {dayAppointments.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{dayAppointments.length - 3} más
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Vista Semanal */}
          {view === 'week' && (
            <div className="bg-white shadow rounded-lg">
              <div className="p-4 bg-indigo-600 text-white">
                <h2 className="text-xl font-bold">
                  Semana del {new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()).toLocaleDateString('es-AR')}
                </h2>
              </div>
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {Array.from({ length: 7 }).map((_, index) => {
                  const date = new Date(currentDate)
                  date.setDate(currentDate.getDate() - currentDate.getDay() + index)
                  const dayAppointments = getAppointmentsForDate(date)
                  const isToday = date.toDateString() === new Date().toDateString()
                  
                  return (
                    <div key={index} className="bg-white p-2 min-h-[400px]">
                      <div className={`text-sm font-semibold mb-2 ${isToday ? 'text-blue-700' : ''}`}>
                        {dayNames[date.getDay()]} {date.getDate()}
                      </div>
                      <div className="space-y-2">
                        {dayAppointments.map(apt => (
                          <div
                            key={apt.id}
                            onClick={() => setSelectedAppointment(apt)}
                            className={`p-2 rounded cursor-pointer hover:opacity-80 ${getStatusColor(apt.status)}`}
                          >
                            <div className="text-xs font-semibold">
                              {new Date(apt.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-xs">{apt.pet?.name || 'Mascota'}</div>
                            <div className="text-xs opacity-75">{apt.veterinary?.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Vista Diaria */}
          {view === 'day' && (
            <div className="bg-white shadow rounded-lg">
              <div className="p-4 bg-indigo-600 text-white">
                <h2 className="text-xl font-bold">
                  {currentDate.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h2>
              </div>
              <div className="p-4">
                {getAppointmentsForDay().length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay turnos programados para este día</p>
                ) : (
                  <div className="space-y-3">
                    {getAppointmentsForDay().map(apt => (
                      <div
                        key={apt.id}
                        onClick={() => setSelectedAppointment(apt)}
                        className={`p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(apt.status)}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-lg">
                              {new Date(apt.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="mt-1">
                              <p className="font-medium">{apt.pet?.name || 'Mascota'}</p>
                              <p className="text-sm opacity-75">{apt.veterinary?.name}</p>
                              {apt.notes && <p className="text-sm mt-1">{apt.notes}</p>}
                            </div>
                          </div>
                          <span className="text-xs font-semibold">{apt.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal de Detalles */}
          {selectedAppointment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Detalles del Turno</h3>
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Mascota</p>
                    <p className="text-gray-900">{selectedAppointment.pet?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Veterinaria</p>
                    <p className="text-gray-900">{selectedAppointment.veterinary?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Fecha y Hora</p>
                    <p className="text-gray-900">
                      {new Date(selectedAppointment.date).toLocaleString('es-AR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Estado</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tipo</p>
                    <p className="text-gray-900">{selectedAppointment.type}</p>
                  </div>
                  {selectedAppointment.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Notas</p>
                      <p className="text-gray-900">{selectedAppointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Calendar

