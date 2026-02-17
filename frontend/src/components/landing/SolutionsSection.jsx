import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const SolutionsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  const solutions = [
    {
      title: 'For Patients',
      subtitle: 'Wait Less, Live More',
      description: 'Real-time queue tracking, estimated wait times, and smart notifications. Arrive exactly when it\'s your turn.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      benefits: ['60% less waiting', 'Mobile notifications', 'Digital queue ticket'],
      color: 'blue'
    },
    {
      title: 'For Healthcare Providers',
      subtitle: 'Streamlined Operations',
      description: 'Intelligent queue management, priority-based sorting, and comprehensive analytics dashboard.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      benefits: ['40% efficiency boost', 'Priority queuing', 'Staff optimization'],
      color: 'purple'
    },
    {
      title: 'For Administrators',
      subtitle: 'Data-Driven Decisions',
      description: 'Real-time analytics, peak hour insights, and comprehensive reporting for better resource allocation.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      benefits: ['95% satisfaction', 'Resource optimization', 'Cost reduction'],
      color: 'green'
    }
  ]

  const getColorClasses = (color) => {
    switch(color) {
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'purple': return 'from-purple-500 to-purple-600';
      case 'green': return 'from-green-500 to-green-600';
      default: return 'from-blue-500 to-purple-600';
    }
  }

  return (
    <section id="solutions" ref={ref} className="py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full">
            Comprehensive Solutions
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-6">
            One Platform, 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Endless Possibilities</span>
          </h2>
          <p className="text-xl text-gray-600">
            Tailored solutions for every stakeholder in the healthcare ecosystem
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(solution.color)} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity`} />
              
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getColorClasses(solution.color)} bg-opacity-10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <div className={`text-${solution.color}-600`}>
                  {solution.icon}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{solution.title}</h3>
              <p className="text-lg font-semibold text-blue-600 mb-4">{solution.subtitle}</p>
              <p className="text-gray-600 mb-6">{solution.description}</p>

              <ul className="space-y-3">
                {solution.benefits.map((benefit, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.2 + i * 0.1 }}
                    className="flex items-center text-gray-700"
                  >
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {benefit}
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ x: 5 }}
                className="mt-8 text-blue-600 font-semibold flex items-center group"
              >
                Learn more
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SolutionsSection