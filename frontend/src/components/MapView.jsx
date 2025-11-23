import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Componente para centrar el mapa en la ubicación del usuario
function MapCenter({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, 13)
    }
  }, [map, center])
  return null
}

// Función para obtener el color del marcador según el estado
const getMarkerColor = (status) => {
  switch (status) {
    case 'Abierta':
      return '#22c55e' // Verde
    case 'Cerrada':
      return '#ef4444' // Rojo
    case 'Guardia':
      return '#eab308' // Amarillo
    default:
      return '#6b7280' // Gris
  }
}

// Función para crear icono personalizado
const createCustomIcon = (status) => {
  const color = getMarkerColor(status)
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  })
}

function MapView({ veterinaries, selectedStatus, userLocation }) {
  const [filteredVeterinaries, setFilteredVeterinaries] = useState(veterinaries)
  const defaultCenter = [-34.6037, -58.3816] // Buenos Aires por defecto

  useEffect(() => {
    if (selectedStatus && selectedStatus !== 'Todos') {
      setFilteredVeterinaries(veterinaries.filter(v => v.status === selectedStatus))
    } else {
      setFilteredVeterinaries(veterinaries)
    }
  }, [veterinaries, selectedStatus])

  const center = userLocation || defaultCenter

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCenter center={center} />
      
      {filteredVeterinaries.map((veterinary) => (
        <Marker
          key={veterinary.id}
          position={[parseFloat(veterinary.latitude), parseFloat(veterinary.longitude)]}
          icon={createCustomIcon(veterinary.status)}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg mb-2">{veterinary.name}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  veterinary.status === 'Abierta' ? 'bg-green-100 text-green-800' :
                  veterinary.status === 'Cerrada' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {veterinary.status}
                </span>
              </p>
              <p className="text-sm text-gray-700 mb-1">📍 {veterinary.address}</p>
              {veterinary.phone && (
                <p className="text-sm text-gray-700 mb-1">📞 {veterinary.phone}</p>
              )}
              {veterinary.email && (
                <p className="text-sm text-gray-700 mb-1">✉️ {veterinary.email}</p>
              )}
              {veterinary.responsible && (
                <p className="text-xs text-gray-500 mt-2">
                  Responsable: {veterinary.responsible.firstName} {veterinary.responsible.lastName}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapView

