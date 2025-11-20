import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🐾 Bienvenido a Auri</h1>
          <p className="text-xl mb-8">
            Plataforma integral para gestión veterinaria, turnos de urgencia, 
            historias clínicas digitales y adopciones responsables
          </p>
          {!isAuthenticated && (
            <div className="space-x-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
              >
                Comenzar Ahora
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600"
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Características Principales</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold mb-2">Mapa Interactivo</h3>
              <p className="text-gray-600">
                Localiza veterinarias abiertas, cerradas y de guardia en tiempo real
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Gestión de Turnos</h3>
              <p className="text-gray-600">
                Reserva turnos de urgencia y programados de forma ágil y centralizada
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">Historias Clínicas</h3>
              <p className="text-gray-600">
                Digitaliza y consulta el historial completo de tus mascotas
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🐕</div>
              <h3 className="text-xl font-semibold mb-2">Adopciones</h3>
              <p className="text-gray-600">
                Publica y gestiona adopciones responsables con seguimiento
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Múltiples Roles</h3>
              <p className="text-gray-600">
                Sistema diseñado para Tutores, Veterinarios, Refugios y Admins
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Reportes</h3>
              <p className="text-gray-600">
                Genera reportes en PDF/XLS de turnos, vacunas y adopciones
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

