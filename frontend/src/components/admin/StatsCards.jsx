import { motion } from 'framer-motion'
import CountUp from 'react-countup'

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'blue',
      bg: 'from-blue-500 to-blue-600',
      change: '+12%',
      period: 'this month'
    },
    {
      title: 'Active Staff',
      value: stats?.totalStaff || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'green',
      bg: 'from-green-500 to-green-600',
      change: '+5%',
      period: 'this week'
    },
    {
      title: 'Active Doctors',
      value: stats?.totalDoctors || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'purple',
      bg: 'from-purple-500 to-purple-600',
      change: '+2',
      period: 'new this month'
    },
    {
      title: 'Today\'s Appointments',
      value: stats?.todayAppointments || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'yellow',
      bg: 'from-yellow-500 to-yellow-600',
      change: stats?.todayAppointments || 0,
      period: 'scheduled'
    },
    {
      title: 'Active Tokens',
      value: stats?.activeTokens || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
        </svg>
      ),
      color: 'red',
      bg: 'from-red-500 to-red-600',
      change: stats?.activeTokens || 0,
      period: 'waiting'
    },
    {
      title: 'Completed Today',
      value: stats?.completedToday || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green',
      bg: 'from-green-500 to-green-600',
      change: stats?.completedToday || 0,
      period: 'patients served'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className={`bg-gradient-to-br ${card.bg} rounded-xl shadow-lg p-5 text-white relative overflow-hidden group`}
        >
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                {card.icon}
              </div>
              <span className="text-xs font-medium bg-white/30 px-2 py-1 rounded-full backdrop-blur-sm">
                {card.period}
              </span>
            </div>
            
            <div className="text-2xl font-bold mb-1">
              <CountUp end={card.value} duration={2} />
            </div>
            
            <div className="text-sm opacity-90">{card.title}</div>
            
            <div className="mt-3 text-xs flex items-center">
              <span className="bg-white/30 px-2 py-0.5 rounded-full">
                {card.change} {card.period}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default StatsCards