import { motion } from 'framer-motion'
import { useState } from 'react'

const UniqueFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      title: 'Smart Queue Algorithm',
      description: 'Our AI-powered system dynamically reorders queues based on priority, wait time, and patient needs.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      stats: '60% faster',
      color: 'blue'
    },
    {
      title: 'Real-time Sync',
      description: 'Live updates across all devices. Patients and staff always see the same queue status instantly.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      stats: '0.5s latency',
      color: 'purple'
    },
    {
      title: 'Smart Notifications',
      description: 'Get alerts when your turn is approaching. Arrive at the perfect time, never wait again.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      stats: '95% on-time',
      color: 'green'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights for healthcare providers to optimize patient flow and resource allocation.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      stats: '40% efficiency↑',
      color: 'yellow'
    }
  ]

  const getIconColor = (color, isActive) => {
    if (isActive) return 'text-white'
    switch(color) {
      case 'blue': return 'text-blue-600'
      case 'purple': return 'text-purple-600'
      case 'green': return 'text-green-600'
      case 'yellow': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getBgColor = (color, isActive) => {
    if (isActive) return 'bg-white/10'
    switch(color) {
      case 'blue': return 'bg-blue-100'
      case 'purple': return 'bg-purple-100'
      case 'green': return 'bg-green-100'
      case 'yellow': return 'bg-yellow-100'
      default: return 'bg-gray-100'
    }
  }

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Features</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            Built for the future of
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              healthcare queuing
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to eliminate waiting room chaos and provide better patient experiences.
          </p>
        </motion.div>

        {/* Interactive features grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Feature cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                onClick={() => setActiveFeature(index)}
                className={`p-6 rounded-2xl cursor-pointer transition-all ${
                  activeFeature === index
                    ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-2xl'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${getBgColor(feature.color, activeFeature === index)}`}>
                    <div className={getIconColor(feature.color, activeFeature === index)}>
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-xl font-semibold ${
                        activeFeature === index ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feature.title}
                      </h3>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        activeFeature === index
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {feature.stats}
                      </span>
                    </div>
                    <p className={activeFeature === index ? 'text-gray-300' : 'text-gray-600'}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right side - Visual representation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700">
              {/* Queue visualization */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-white mb-6">
                  <span className="text-lg font-semibold">Live Queue</span>
                  <span className="text-sm text-gray-400">Updated in real-time</span>
                </div>
                
                {/* Animated queue bars */}
                {[70, 45, 90, 30, 60].map((width, i) => (
                  <motion.div
                    key={i}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${width}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="relative"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-400 w-8">T-{i + 1}</span>
                      <div className="flex-1 h-10 bg-gray-700 rounded-lg overflow-hidden">
                        <motion.div
                          animate={{
                            x: [-10, 0],
                          }}
                          transition={{ duration: 2, repeat: i === 0 ? Infinity : 0 }}
                          className="h-full rounded-lg"
                          style={{ 
                            width: `${width}%`,
                            background: i === 0 
                              ? 'linear-gradient(90deg, #3B82F6, #8B5CF6)' 
                              : i === 1 ? '#6B7280' 
                              : i === 2 ? '#4B5563' 
                              : i === 3 ? '#374151' 
                              : '#1F2937'
                          }}
                        />
                      </div>
                      {i === 0 && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-3 h-3 bg-green-500 rounded-full"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Priority tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/30">
                  Emergency
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
                  Senior
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
                  Normal
                </span>
              </div>
            </div>

            {/* Floating stats */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
            >
              <p className="text-sm text-gray-600">Avg. wait time</p>
              <p className="text-2xl font-bold text-gray-900">12<span className="text-sm text-gray-500 ml-1">min</span></p>
            </motion.div>
            
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
            >
              <p className="text-sm text-gray-600">Patients served</p>
              <p className="text-2xl font-bold text-gray-900">2.5k<span className="text-sm text-gray-500 ml-1">today</span></p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default UniqueFeatures