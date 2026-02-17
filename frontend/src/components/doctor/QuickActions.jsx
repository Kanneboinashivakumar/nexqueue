const QuickActions = () => {
  const actions = [
    {
      id: 1,
      title: 'View Medical History',
      description: 'Access patient medical records',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'blue',
      onClick: () => alert('Medical history feature coming soon')
    },
    {
      id: 2,
      title: 'Quick Prescription',
      description: 'Create new prescription',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'green',
      onClick: () => alert('Prescription feature coming soon')
    },
    {
      id: 3,
      title: 'Lab Tests',
      description: 'Order diagnostic tests',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: 'purple',
      onClick: () => alert('Lab tests feature coming soon')
    },
    {
      id: 4,
      title: 'Refer Specialist',
      description: 'Refer to other departments',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'red',
      onClick: () => alert('Referral feature coming soon')
    }
  ]

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      case 'green': return 'bg-green-100 text-green-700 hover:bg-green-200'
      case 'purple': return 'bg-purple-100 text-purple-700 hover:bg-purple-200'
      case 'red': return 'bg-red-100 text-red-700 hover:bg-red-200'
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`p-4 rounded-lg transition flex items-start space-x-3 ${getColorClasses(action.color)}`}
          >
            <div className={`p-2 rounded-lg ${action.color === 'blue' ? 'bg-blue-200' :
                           action.color === 'green' ? 'bg-green-200' :
                           action.color === 'purple' ? 'bg-purple-200' :
                           'bg-red-200'}`}>
              {action.icon}
            </div>
            <div className="text-left">
              <div className="font-medium">{action.title}</div>
              <div className="text-sm opacity-80">{action.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions