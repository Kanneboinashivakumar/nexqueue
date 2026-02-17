import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Header = ({ title }) => {
  const { user, logout } = useAuth()

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'patient': return 'bg-green-100 text-green-800'
      case 'staff': return 'bg-blue-100 text-blue-800'
      case 'doctor': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {user && (
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-gray-600">
                  Welcome, <span className="font-semibold">{user.fullName}</span>
                </p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  <span>Online</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <Link
                to={user.role === 'patient' ? '/patient' : user.role === 'staff' ? '/staff' : '/doctor'}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header