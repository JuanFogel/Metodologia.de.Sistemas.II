import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

function ClinicalHistories() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [histories, setHistories] = useState([])
  const [pets, setPets] = useState([])
  const [veterinaries, setVeterinaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    petId: '',
    veterinaryId: '',
    type: 'Consulta',
    diagnosis: '',
    treatment: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    attachments: []
  })
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [filterPet, setFilterPet] = useState('Todos')
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
      const [historiesRes, petsRes, veterinariesRes] = await Promise.all([
        api.get('/clinical-histories'),
        api.get('/pets'),
        api.get('/veterinaries')
      ])
      setHistories(historiesRes.data)
      setPets(petsRes.data)
      setVeterinaries(veterinariesRes.data)
    } catch (error) {
      console.error('Error al obtener datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAttachment = () => {
    if (attachmentUrl.trim()) {
      setFormData({
        ...formData,
        attachments: [...formData.attachments, attachmentUrl.trim()]
      })
      setAttachmentUrl('')
    }
  }

  const handleRemoveAttachment = (index) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/clinical-histories', {
        petId: formData.petId,
        veterinaryId: formData.veterinaryId,
        veterinarianId: user.id, // El usuario autenticado es el veterinario
        date: formData.date,
        type: formData.type,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        notes: formData.notes,
        attachments: formData.attachments.length > 0 ? formData.attachments : null
      })
      setFormData({
        petId: '',
        veterinaryId: '',
        type: 'Consulta',
        diagnosis: '',
        treatment: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
        attachments: []
      })
      setAttachmentUrl('')
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('Error al crear historia clínica:', error)
      alert(error.response?.data?.error || 'Error al crear historia clínica')
    }
  }

  const filteredHistories = histories.filter(history => {
    const petMatch = filterPet === 'Todos' || history.petId === filterPet
    const typeMatch = filterType === 'Todos' || history.type === filterType
    return petMatch && typeMatch
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
              <h1 className="text-xl font-bold text-gray-900">Historias Clínicas 📋</h1>
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
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Historias Clínicas</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              {showForm ? 'Cancelar' : '+ Nueva Historia Clínica'}
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mascota:
                </label>
                <select
                  value={filterPet}
                  onChange={(e) => setFilterPet(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="Todos">Todas</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}
                    </option>
                  ))}
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
                  <option value="Consulta">Consulta</option>
                  <option value="Vacunación">Vacunación</option>
                  <option value="Cirugía">Cirugía</option>
                  <option value="Control">Control</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Formulario */}
          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">Nueva Historia Clínica</h3>
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
                          {vet.name}
                        </option>
                      ))}
                    </select>
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
                      <option value="Consulta">Consulta</option>
                      <option value="Vacunación">Vacunación</option>
                      <option value="Cirugía">Cirugía</option>
                      <option value="Control">Control</option>
                      <option value="Otro">Otro</option>
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
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diagnóstico
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows="3"
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                      placeholder="Diagnóstico..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tratamiento
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows="3"
                      value={formData.treatment}
                      onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                      placeholder="Tratamiento..."
                    />
                  </div>
                  <div className="md:col-span-2">
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Archivos Adjuntos (URLs)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="url"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                        value={attachmentUrl}
                        onChange={(e) => setAttachmentUrl(e.target.value)}
                        placeholder="https://ejemplo.com/archivo.pdf"
                      />
                      <button
                        type="button"
                        onClick={handleAddAttachment}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                      >
                        Agregar
                      </button>
                    </div>
                    {formData.attachments.length > 0 && (
                      <div className="space-y-1">
                        {formData.attachments.map((url, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 hover:underline truncate flex-1"
                            >
                              {url}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(index)}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Puedes agregar URLs de archivos (imágenes, PDFs, etc.)
                    </p>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Guardar Historia Clínica
                </button>
              </form>
            </div>
          )}

          {/* Lista de historias */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Historias Clínicas ({filteredHistories.length})
              </h3>
              {filteredHistories.length === 0 ? (
                <p className="text-gray-500">No hay historias clínicas registradas.</p>
              ) : (
                <div className="space-y-4">
                  {filteredHistories.map((history) => {
                    const historyDate = new Date(history.date)
                    return (
                      <div
                        key={history.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">
                              {history.pet?.name || 'Mascota'} - {history.type}
                            </h4>
                            <p className="text-sm text-gray-600">
                              <strong>Veterinaria:</strong> {history.veterinary?.name || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Fecha:</strong>{' '}
                              {historyDate.toLocaleDateString('es-AR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        {history.diagnosis && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Diagnóstico:</p>
                            <p className="text-sm text-gray-600">{history.diagnosis}</p>
                          </div>
                        )}
                        {history.treatment && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Tratamiento:</p>
                            <p className="text-sm text-gray-600">{history.treatment}</p>
                          </div>
                        )}
                        {history.notes && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Notas:</p>
                            <p className="text-sm text-gray-600">{history.notes}</p>
                          </div>
                        )}
                        {history.vaccines && history.vaccines.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Vacunas:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {history.vaccines.map((vaccine) => (
                                <li key={vaccine.id}>
                                  {vaccine.name} - {new Date(vaccine.date).toLocaleDateString('es-AR')}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {history.attachments && history.attachments.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Archivos Adjuntos:</p>
                            <div className="space-y-1 mt-1">
                              {history.attachments.map((url, index) => (
                                <a
                                  key={index}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-sm text-indigo-600 hover:underline"
                                >
                                  📎 {url}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
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

export default ClinicalHistories

