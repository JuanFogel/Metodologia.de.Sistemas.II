import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

function Adoptions() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [adoptions, setAdoptions] = useState([])
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedAdoption, setSelectedAdoption] = useState(null)
  const [formData, setFormData] = useState({
    petId: '',
    description: '',
    requirements: ''
  })
  const [filterStatus, setFilterStatus] = useState('Todos')
  const [showFollowUpForm, setShowFollowUpForm] = useState(false)
  const [followUpData, setFollowUpData] = useState({
    notes: '',
    visitDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchData()
  }, [user, navigate])

  const fetchData = async () => {
    try {
      const [adoptionsRes, petsRes] = await Promise.all([
        api.get('/adoptions'),
        api.get('/pets')
      ])
      setAdoptions(adoptionsRes.data)
      // Solo mostrar mascotas del usuario si es Refugio
      if (user.role === 'Refugio') {
        setPets(petsRes.data)
      }
    } catch (error) {
      console.error('Error al obtener datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/adoptions', {
        ...formData,
        shelterId: user.id
      })
      setFormData({ petId: '', description: '', requirements: '' })
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('Error al crear adopción:', error)
      alert(error.response?.data?.error || 'Error al crear adopción')
    }
  }

  const handleViewDetails = (adoption) => {
    setSelectedAdoption(adoption)
  }

  const handleFollowUpSubmit = async (e) => {
    e.preventDefault()
    if (!selectedAdoption) return
    
    try {
      await api.post(`/adoptions/${selectedAdoption.id}/follow-ups`, followUpData)
      setFollowUpData({ notes: '', visitDate: new Date().toISOString().split('T')[0] })
      setShowFollowUpForm(false)
      fetchData()
      // Actualizar la adopción seleccionada
      const response = await api.get(`/adoptions/${selectedAdoption.id}`)
      setSelectedAdoption(response.data)
    } catch (error) {
      console.error('Error al crear seguimiento:', error)
      alert('Error al crear seguimiento')
    }
  }

  const handleUpdateStatus = async (adoptionId, newStatus) => {
    try {
      await api.put(`/adoptions/${adoptionId}`, { status: newStatus })
      fetchData()
      if (selectedAdoption && selectedAdoption.id === adoptionId) {
        const response = await api.get(`/adoptions/${adoptionId}`)
        setSelectedAdoption(response.data)
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      alert('Error al actualizar estado')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800'
      case 'En Proceso':
        return 'bg-yellow-100 text-yellow-800'
      case 'Adoptado':
        return 'bg-blue-100 text-blue-800'
      case 'Cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredAdoptions = adoptions.filter(adoption => {
    return filterStatus === 'Todos' || adoption.status === filterStatus
  })

  const canCreateAdoption = user.role === 'Refugio' || user.role === 'Admin'
  const canManageAdoption = (adoption) => {
    return user.role === 'Admin' || adoption.shelterId === user.id
  }

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
              <h1 className="text-xl font-bold text-gray-900">Adopciones 🐾</h1>
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
            <h2 className="text-2xl font-bold text-gray-900">Mascotas en Adopción</h2>
            {canCreateAdoption && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                {showForm ? 'Cancelar' : '+ Publicar Adopción'}
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex gap-4">
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
                  <option value="Disponible">Disponible</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Adoptado">Adoptado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Formulario de adopción */}
          {showForm && canCreateAdoption && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">Publicar Nueva Adopción</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                        {pet.name} ({pet.species} - {pet.breed || 'Sin raza'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe la mascota, su personalidad, necesidades especiales..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requisitos de Adopción
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Requisitos para adoptar (ej: casa con patio, experiencia con mascotas, etc.)"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Publicar Adopción
                </button>
              </form>
            </div>
          )}

          {/* Lista de adopciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdoptions.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-8">
                No hay adopciones disponibles
              </div>
            ) : (
              filteredAdoptions.map((adoption) => (
                <div
                  key={adoption.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {adoption.pet?.name || 'Mascota'}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(adoption.status)}`}>
                        {adoption.status}
                      </span>
                    </div>
                    {adoption.pet && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">
                          <strong>Especie:</strong> {adoption.pet.species}
                        </p>
                        {adoption.pet.breed && (
                          <p className="text-sm text-gray-600">
                            <strong>Raza:</strong> {adoption.pet.breed}
                          </p>
                        )}
                        {adoption.pet.age && (
                          <p className="text-sm text-gray-600">
                            <strong>Edad:</strong> {adoption.pet.age} años
                          </p>
                        )}
                      </div>
                    )}
                    {adoption.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {adoption.description}
                      </p>
                    )}
                    {adoption.shelter && (
                      <p className="text-xs text-gray-500 mb-3">
                        Refugio: {adoption.shelter.firstName} {adoption.shelter.lastName}
                      </p>
                    )}
                    <button
                      onClick={() => handleViewDetails(adoption)}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal de detalles */}
      {selectedAdoption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedAdoption.pet?.name || 'Mascota'}
                </h3>
                <button
                  onClick={() => {
                    setSelectedAdoption(null)
                    setShowFollowUpForm(false)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${getStatusColor(selectedAdoption.status)}`}>
                    {selectedAdoption.status}
                  </span>
                </div>

                {selectedAdoption.pet && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Información de la Mascota</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><strong>Especie:</strong> {selectedAdoption.pet.species}</p>
                      {selectedAdoption.pet.breed && (
                        <p><strong>Raza:</strong> {selectedAdoption.pet.breed}</p>
                      )}
                      {selectedAdoption.pet.age && (
                        <p><strong>Edad:</strong> {selectedAdoption.pet.age} años</p>
                      )}
                      {selectedAdoption.pet.gender && (
                        <p><strong>Género:</strong> {selectedAdoption.pet.gender}</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedAdoption.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Descripción</h4>
                    <p className="text-sm text-gray-600">{selectedAdoption.description}</p>
                  </div>
                )}

                {selectedAdoption.requirements && (
                  <div>
                    <h4 className="font-semibold mb-2">Requisitos de Adopción</h4>
                    <p className="text-sm text-gray-600">{selectedAdoption.requirements}</p>
                  </div>
                )}

                {selectedAdoption.shelter && (
                  <div>
                    <h4 className="font-semibold mb-2">Refugio</h4>
                    <p className="text-sm text-gray-600">
                      {selectedAdoption.shelter.firstName} {selectedAdoption.shelter.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{selectedAdoption.shelter.email}</p>
                  </div>
                )}

                {selectedAdoption.followUps && selectedAdoption.followUps.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Seguimientos</h4>
                    <div className="space-y-2">
                      {selectedAdoption.followUps.map((followUp) => (
                        <div key={followUp.id} className="bg-gray-50 p-3 rounded text-sm">
                          <p className="font-medium">
                            {new Date(followUp.visitDate).toLocaleDateString('es-AR')}
                          </p>
                          <p className="text-gray-600">{followUp.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {canManageAdoption(selectedAdoption) && (
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex gap-2">
                      {selectedAdoption.status !== 'Adoptado' && selectedAdoption.status !== 'Cancelado' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(selectedAdoption.id, 'En Proceso')}
                            className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 text-sm"
                          >
                            Marcar en Proceso
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(selectedAdoption.id, 'Adoptado')}
                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                          >
                            Marcar Adoptado
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(selectedAdoption.id, 'Cancelado')}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                    <button
                      onClick={() => setShowFollowUpForm(!showFollowUpForm)}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                    >
                      {showFollowUpForm ? 'Cancelar' : '+ Agregar Seguimiento'}
                    </button>
                  </div>
                )}

                {showFollowUpForm && (
                  <form onSubmit={handleFollowUpSubmit} className="pt-4 border-t space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Visita *
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={followUpData.visitDate}
                        onChange={(e) => setFollowUpData({ ...followUpData, visitDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas *
                      </label>
                      <textarea
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        rows="3"
                        value={followUpData.notes}
                        onChange={(e) => setFollowUpData({ ...followUpData, notes: e.target.value })}
                        placeholder="Notas del seguimiento..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                    >
                      Guardar Seguimiento
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Adoptions

