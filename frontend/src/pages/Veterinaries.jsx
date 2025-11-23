import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

function Veterinaries() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [veterinaries, setVeterinaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVeterinary, setSelectedVeterinary] = useState(null)
  const [filterStatus, setFilterStatus] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchVeterinaries()
  }, [user, navigate])

  const fetchVeterinaries = async () => {
    try {
      const response = await api.get('/veterinaries')
      setVeterinaries(response.data)
    } catch (error) {
      console.error('Error al obtener veterinarias:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Abierta':
        return 'bg-green-100 text-green-800'
      case 'Cerrada':
        return 'bg-red-100 text-red-800'
      case 'Guardia':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredVeterinaries = veterinaries.filter(vet => {
    const statusMatch = filterStatus === 'Todos' || vet.status === filterStatus
    const searchMatch = !searchTerm || 
      vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.address.toLowerCase().includes(searchTerm.toLowerCase())
    return statusMatch && searchMatch
  })

  const handleViewDetails = async (id) => {
    try {
      const response = await api.get(`/veterinaries/${id}`)
      setSelectedVeterinary(response.data)
    } catch (error) {
      console.error('Error al obtener detalles:', error)
    }
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
              <h1 className="text-xl font-bold text-gray-900">Veterinarias 🏥</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/map"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Ver en Mapa
              </Link>
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Lista de Veterinarias</h2>
            <p className="text-gray-600">Encuentra la veterinaria más cercana</p>
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar:
                </label>
                <input
                  type="text"
                  placeholder="Nombre o dirección..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
                  <option value="Abierta">Abierta</option>
                  <option value="Cerrada">Cerrada</option>
                  <option value="Guardia">Guardia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de veterinarias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVeterinaries.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-8">
                No se encontraron veterinarias
              </div>
            ) : (
              filteredVeterinaries.map((vet) => (
                <div
                  key={vet.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{vet.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(vet.status)}`}>
                        {vet.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">📍 {vet.address}</p>
                    {vet.phone && (
                      <p className="text-sm text-gray-600 mb-2">📞 {vet.phone}</p>
                    )}
                    {vet.email && (
                      <p className="text-sm text-gray-600 mb-2">✉️ {vet.email}</p>
                    )}
                    {vet.responsible && (
                      <p className="text-xs text-gray-500 mb-4">
                        Responsable: {vet.responsible.firstName} {vet.responsible.lastName}
                      </p>
                    )}
                    <button
                      onClick={() => handleViewDetails(vet.id)}
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
      {selectedVeterinary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{selectedVeterinary.name}</h3>
                <button
                  onClick={() => setSelectedVeterinary(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${getStatusColor(selectedVeterinary.status)}`}>
                    {selectedVeterinary.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Dirección:</p>
                  <p className="text-sm text-gray-600">{selectedVeterinary.address}</p>
                </div>
                {selectedVeterinary.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Teléfono:</p>
                    <p className="text-sm text-gray-600">{selectedVeterinary.phone}</p>
                  </div>
                )}
                {selectedVeterinary.email && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email:</p>
                    <p className="text-sm text-gray-600">{selectedVeterinary.email}</p>
                  </div>
                )}
                {selectedVeterinary.responsible && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Responsable:</p>
                    <p className="text-sm text-gray-600">
                      {selectedVeterinary.responsible.firstName} {selectedVeterinary.responsible.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{selectedVeterinary.responsible.email}</p>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <Link
                    to="/appointments"
                    className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
                  >
                    Reservar Turno
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Veterinaries

