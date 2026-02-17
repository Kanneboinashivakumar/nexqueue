import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'

const StatsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })
  const [counts, setCounts] = useState({
    patients: 0,
    facilities: 0,
    satisfaction: 0,
    reduction: 0
  })

  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        setCounts(prev => ({
          patients: Math.min(prev.patients + 25, 15000),
          facilities: Math.min(prev.facilities + 1, 45),
          satisfaction: Math.min(prev.satisfaction + 2, 98),
          reduction: Math.min(prev.reduction + 1, 65)
        }))
      }, 30)

      return () => clearInterval(interval)
    }
  }, [inView])

  const stats = [
    {
      value: counts.patients,
      label: 'Patients Served',
      suffix: '+',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      value: counts.facilities,
      label: 'Healthcare Facilities',
      suffix: '+',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'purple'
    },
    {
      value: counts.satisfaction,
      label: 'Satisfaction Rate',
      suffix: '%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green'
    },
    {
      value: counts.reduction,
      label: 'Wait Time Reduction',
      suffix: '%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'yellow'
    }
  ]

  // Define color classes separately to avoid Tailwind dynamic class issues
  const getColorClasses = (color) => {
    switch(color) {
      case 'blue': return 'from-blue-500/20 to-blue-600/20 text-blue-400';
      case 'purple': return 'from-purple-500/20 to-purple-600/20 text-purple-400';
      case 'green': return 'from-green-500/20 to-green-600/20 text-green-400';
      case 'yellow': return 'from-yellow-500/20 to-yellow-600/20 text-yellow-400';
      default: return 'from-gray-500/20 to-gray-600/20 text-gray-400';
    }
  }

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Transforming healthcare,
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              one queue at a time
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/0 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getColorClasses(stat.color)} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <div className={stat.color === 'blue' ? 'text-blue-400' : 
                                  stat.color === 'purple' ? 'text-purple-400' : 
                                  stat.color === 'green' ? 'text-green-400' : 
                                  'text-yellow-400'}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-gray-400">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-16 border-t border-white/10"
        >
          <p className="text-center text-gray-400 mb-8">Trusted by leading healthcare institutions</p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {['Kigali Central', 'King Faisal', 'University Teaching', 'Rwanda Military'].map((name, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="text-gray-500 font-semibold text-lg"
              >
                {name}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default StatsSection