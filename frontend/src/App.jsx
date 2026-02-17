import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ToastNotifications from './components/common/ToastNotifications.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import PatientDashboard from './pages/PatientDashboard.jsx'
import StaffDashboard from './pages/StaffDashboard.jsx'
import DoctorDashboard from './pages/DoctorDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
// Add imports
import LabDashboard from './pages/LabDashboard'
import PharmacyDashboard from './pages/PharmacyDashboard'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <ToastNotifications />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Add routes */}
            <Route path="/lab" element={<LabDashboard />} />
            <Route path="/pharmacy" element={<PharmacyDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App