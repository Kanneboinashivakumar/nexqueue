import { useAuth } from '../context/AuthContext'
import Header from '../components/common/Header'
import PharmacyQueue from '../components/pharmacy/PharmacyQueue'

const PharmacyDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Pharmacy Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PharmacyQueue />
      </div>
    </div>
  )
}

export default PharmacyDashboard