import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Pets from './pages/Pets.jsx'
import Map from './pages/Map.jsx'
import Appointments from './pages/Appointments.jsx'
import ClinicalHistories from './pages/ClinicalHistories.jsx'
import Veterinaries from './pages/Veterinaries.jsx'
import Adoptions from './pages/Adoptions.jsx'
import Profile from './pages/Profile.jsx'
import Calendar from './pages/Calendar.jsx'
import VaccineReports from './pages/VaccineReports.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/pets" element={
            <ProtectedRoute>
              <Pets />
            </ProtectedRoute>
          } />
          <Route path="/map" element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          } />
          <Route path="/clinical-histories" element={
            <ProtectedRoute>
              <ClinicalHistories />
            </ProtectedRoute>
          } />
          <Route path="/veterinaries" element={
            <ProtectedRoute>
              <Veterinaries />
            </ProtectedRoute>
          } />
          <Route path="/adoptions" element={
            <ProtectedRoute>
              <Adoptions />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          } />
          <Route path="/reports/vaccines" element={
            <ProtectedRoute>
              <VaccineReports />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

