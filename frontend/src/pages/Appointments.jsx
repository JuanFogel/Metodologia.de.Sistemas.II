import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

function Appointments() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [pets, setPets] = useState([])
  const [veterinaries, setVeterinaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    petId: '',
    veterinaryId: '',
    appointmentDate: '',
    appointmentTime: '',
    type: 'Programado',
    notes: ''
  })
  const [filterStatus, setFilterStatus] = useState('Todos')
  const [filterType, setFilterType] = useState('Todos')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchData()
  }, [user, navigate])

  const fetchData = async () => {
    try {
      const [appointmentsRes, petsRes, veterinariesRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/pets'),
        api.get('/veterinaries')
      ])
      setAppointments(appointmentsRes.data)
      setPets(petsRes.data)
      setVeterinaries(veterinariesRes.data)
    } catch (error) {
      console.error('Error al obtener datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`
      await api.post('/appointments', {
        petId: formData.petId,
        veterinaryId: formData.veterinaryId,
        date: appointmentDateTime,
        type: formData.type,
        notes: formData.notes
      })
      setFormData({
        petId: '',
        veterinaryId: '',
        appointmentDate: '',
        appointmentTime: '',
        type: 'Programado',
        notes: ''
      })
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('Error al crear turno:', error)
      alert(error.response?.data?.error || 'Error al crear turno')
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('¿Estás seguro de cancelar este turno?')) return
    
    try {
      await api.put(`/appointments/${id}`, { status: 'Cancelado' })
      fetchData()
    } catch (error) {
      console.error('Error al cancelar turno:', error)
      alert('Error al cancelar turno')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800'
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelado':
        return 'bg-red-100 text-red-800'
      case 'Completado':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    const statusMatch = filterStatus === 'Todos' || apt.status === filterStatus
    const typeMatch = filterType === 'Todos' || apt.type === filterType
    return statusMatch && typeMatch
  })

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
              <h1 className="text-xl font-bold text-gray-900">Mis Turnos 📅</h1>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Turnos</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              {showForm ? 'Cancelar' : '+ Nuevo Turno'}
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado:
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="Todos">Todos</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Cancelado">Cancelado</option>
                  <option value="Completado">Completado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo:
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="Todos">Todos</option>
                  <option value="Urgencia">Urgencia</option>
                  <option value="Programado">Programado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Formulario */}
          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">Nuevo Turno</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mascota *
                    </label>
                    <select
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.petId}
                      onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                    >
                      <option value="">Seleccionar mascota</option>
                      {pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name} ({pet.species})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Veterinaria *
                    </label>
                    <select
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.veterinaryId}
                      onChange={(e) => setFormData({ ...formData, veterinaryId: e.target.value })}
                    >
                      <option value="">Seleccionar veterinaria</option>
                      {veterinaries.map((vet) => (
                        <option key={vet.id} value={vet.id}>
                          {vet.name} ({vet.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora *
                    </label>
                    <input
                      type="time"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo *
                    </label>
                    <select
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Programado">Programado</option>
                      <option value="Urgencia">Urgencia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows="3"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Notas adicionales..."
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Guardar Turno
                </button>
              </form>
            </div>
          )}

          {/* Lista de turnos */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Turnos ({filteredAppointments.length})
              </h3>
              {filteredAppointments.length === 0 ? (
                <p className="text-gray-500">No tienes turnos registrados.</p>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => {
                    const appointmentDate = new Date(appointment.date)
                    return (
                      <div
                        key={appointment.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">
                                {appointment.pet?.name || 'Mascota'}
                              </h4>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                              <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                                {appointment.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              <strong>Veterinaria:</strong> {appointment.veterinary?.name || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Fecha y Hora:</strong>{' '}
                              {appointmentDate.toLocaleDateString('es-AR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            {appointment.notes && (
                              <p className="text-sm text-gray-600 mt-2">
                                <strong>Notas:</strong> {appointment.notes}
                              </p>
                            )}
                          </div>
                          {appointment.status !== 'Cancelado' && appointment.status !== 'Completado' && (
                            <button
                              onClick={() => handleCancel(appointment.id)}
                              className="ml-4 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Appointments

