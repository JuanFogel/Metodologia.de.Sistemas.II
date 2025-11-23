import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'
import MapView from '../components/MapView.jsx'

function Map() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [veterinaries, setVeterinaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('Todos')
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchVeterinaries()
    getUserLocation()
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

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error('Error al obtener ubicación:', error)
          setLocationError('No se pudo obtener tu ubicación')
        }
      )
    } else {
      setLocationError('Tu navegador no soporta geolocalización')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando mapa...</div>
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
              <h1 className="text-xl font-bold text-gray-900">Mapa de Veterinarias 🗺️</h1>
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

      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Controles de filtro */}
        <div className="bg-white shadow-sm p-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Filtrar por estado:
            </label>
            <div className="flex gap-2">
              {['Todos', 'Abierta', 'Cerrada', 'Guardia'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? status === 'Abierta'
                        ? 'bg-green-600 text-white'
                        : status === 'Cerrada'
                        ? 'bg-red-600 text-white'
                        : status === 'Guardia'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <button
              onClick={getUserLocation}
              className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
            >
              📍 Mi Ubicación
            </button>
          </div>
        </div>

        {/* Leyenda */}
        <div className="bg-white shadow-sm p-2 border-t">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4 text-sm">
            <span className="font-medium text-gray-700">Leyenda:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span>Abierta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span>Cerrada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span>Guardia</span>
            </div>
            <span className="text-gray-500 ml-4">
              Total: {veterinaries.length} veterinarias
              {selectedStatus !== 'Todos' && ` (${veterinaries.filter(v => v.status === selectedStatus).length} ${selectedStatus})`}
            </span>
          </div>
        </div>

        {/* Mapa */}
        <div className="flex-1 relative">
          <MapView
            veterinaries={veterinaries}
            selectedStatus={selectedStatus}
            userLocation={userLocation}
          />
        </div>

        {locationError && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="max-w-7xl mx-auto">
              <p className="text-sm text-yellow-700">{locationError}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Map

