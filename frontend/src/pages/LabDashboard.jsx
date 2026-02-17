import { useAuth } from '../context/AuthContext'
import Header from '../components/common/Header'
import LabQueue from '../components/lab/LabQueue'

const LabDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Lab Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LabQueue />
      </div>
    </div>
  )
}

export default LabDashboard