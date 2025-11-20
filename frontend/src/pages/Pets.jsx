import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

function Pets() {
  const { user } = useAuth()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: ''
  })

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      const response = await api.get('/pets')
      setPets(response.data)
    } catch (error) {
      console.error('Error al obtener mascotas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/pets', formData)
      setFormData({ name: '', species: '', breed: '', age: '', gender: '' })
      setShowForm(false)
      fetchPets()
    } catch (error) {
      console.error('Error al crear mascota:', error)
      alert('Error al crear mascota')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta mascota?')) return
    
    try {
      await api.delete(`/pets/${id}`)
      fetchPets()
    } catch (error) {
      console.error('Error al eliminar mascota:', error)
      alert('Error al eliminar mascota')
    }
  }

  if (loading) {
    return <div className="p-6">Cargando...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Mascotas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {showForm ? 'Cancelar' : '+ Nueva Mascota'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Registrar Nueva Mascota</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Especie</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Raza</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Edad</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Género</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Seleccionar</option>
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Guardar
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">
            No tienes mascotas registradas
          </div>
        ) : (
          pets.map((pet) => (
            <div key={pet.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{pet.name}</h3>
              <p className="text-sm text-gray-600">{pet.species}</p>
              {pet.breed && <p className="text-sm text-gray-600">Raza: {pet.breed}</p>}
              {pet.age && <p className="text-sm text-gray-600">Edad: {pet.age} años</p>}
              {pet.gender && <p className="text-sm text-gray-600">Género: {pet.gender}</p>}
              <button
                onClick={() => handleDelete(pet.id)}
                className="mt-4 text-red-600 hover:text-red-800 text-sm"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Pets

