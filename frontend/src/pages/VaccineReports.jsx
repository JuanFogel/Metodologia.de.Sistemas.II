import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

function VaccineReports() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [vaccines, setVaccines] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterPetName, setFilterPetName] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchVaccines()
  }, [user, navigate])

  const fetchVaccines = async () => {
    try {
      // upcoming=true devuelve solo vacunas con próxima fecha registrada (pendientes)
      const response = await api.get('/vaccines?upcoming=true')
      setVaccines(response.data)
    } catch (error) {
      console.error('Error al obtener vacunas pendientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVaccines = vaccines.filter((vaccine) => {
    const petName = vaccine.clinicalHistory?.pet?.name || ''
    const nextDate = vaccine.nextDate ? new Date(vaccine.nextDate) : null

    const matchesPet =
      !filterPetName ||
      petName.toLowerCase().includes(filterPetName.toLowerCase())

    const matchesFrom =
      !filterDateFrom || (nextDate && nextDate >= new Date(filterDateFrom))

    const matchesTo =
      !filterDateTo || (nextDate && nextDate <= new Date(filterDateTo))

    return matchesPet && matchesFrom && matchesTo
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
              <h1 className="text-xl font-bold text-gray-900">
                Reporte de Vacunas Pendientes 💉
              </h1>
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Vacunas con próxima dosis pendiente
            </h2>
            <p className="text-gray-600">
              Este reporte muestra las vacunas registradas que tienen una{' '}
              <span className="font-semibold">próxima fecha</span> (campo{' '}
              <code>nextDate</code>) configurada.
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la mascota
                </label>
                <input
                  type="text"
                  value={filterPetName}
                  onChange={(e) => setFilterPetName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Buscar por nombre..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Próxima dosis desde
                </label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Próxima dosis hasta
                </label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Vacunas pendientes ({filteredVaccines.length})
              </h3>
            </div>
            {filteredVaccines.length === 0 ? (
              <div className="p-6 text-gray-500">
                No hay vacunas pendientes que coincidan con los filtros.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mascota
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vacuna
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Última aplicación
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Próxima dosis
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Veterinaria
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVaccines.map((vaccine) => {
                      const pet = vaccine.clinicalHistory?.pet
                      const veterinary = vaccine.clinicalHistory?.veterinary

                      const lastDate = vaccine.date
                        ? new Date(vaccine.date).toLocaleDateString('es-AR')
                        : 'N/A'
                      const nextDate = vaccine.nextDate
                        ? new Date(vaccine.nextDate).toLocaleDateString('es-AR')
                        : 'N/A'

                      return (
                        <tr key={vaccine.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            <div className="font-medium">
                              {pet?.name || 'Mascota'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {pet?.species}
                              {pet?.breed ? ` - ${pet.breed}` : ''}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            <div className="font-medium">{vaccine.name}</div>
                            {vaccine.batch && (
                              <div className="text-xs text-gray-500">
                                Lote: {vaccine.batch}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {lastDate}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {nextDate}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            <div className="font-medium">
                              {veterinary?.name || 'N/A'}
                            </div>
                            {veterinary?.address && (
                              <div className="text-xs text-gray-500">
                                {veterinary.address}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default VaccineReports


