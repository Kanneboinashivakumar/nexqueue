import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const HowItWorksSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  const steps = [
    {
      number: '01',
      title: 'Book Appointment',
      description: 'Patients schedule appointments through our intuitive interface, selecting preferred time and department.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      light: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      number: '02',
      title: 'Get Smart Token',
      description: 'System generates dynamic tokens with priority scoring based on condition, age, and wait time.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      light: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      number: '03',
      title: 'Real-time Queue',
      description: 'Patients track their position live. Staff sees intelligent, priority-sorted queue.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      light: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      number: '04',
      title: 'Smart Notifications',
      description: 'Patients receive alerts when turn is approaching. No more crowded waiting rooms.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      color: 'from-yellow-500 to-yellow-600',
      light: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      number: '05',
      title: 'Consultation',
      description: 'Doctors access patient history, add notes, and manage prescriptions digitally.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-red-500 to-red-600',
      light: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      number: '06',
      title: 'Analytics & Insights',
      description: 'Administrators get comprehensive reports to optimize operations and resource allocation.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-indigo-500 to-indigo-600',
      light: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    }
  ]

  return (
    <section id="features" ref={ref} className="py-32 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full mb-6">
            Simple 6-Step Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NexQueue
              </span>
              <motion.span
                initial={{ width: 0 }}
                animate={inView ? { width: '100%' } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
              />
            </span>
            {' '}Works
          </h2>
          <p className="text-xl text-gray-600">
            From booking to care delivery - all in real-time, all optimized for you
          </p>
        </motion.div>

        {/* Timeline Layout */}
        <div className="relative">
          {/* Main timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 via-purple-400 to-indigo-400 rounded-full hidden lg:block" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center mb-16 last:mb-0`}
            >
              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full border-4 border-blue-500 hidden lg:flex items-center justify-center z-10">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              </div>

              {/* Content card */}
              <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-left lg:pr-16' : 'lg:text-left lg:pl-16'}`}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-100 ${
                    index % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8'
                  }`}
                >
                  {/* FIXED: Icon and title side by side - LEFT ALIGNED for ALL cards */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg flex-shrink-0`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${step.light} ${step.textColor}`}>
                          Step {step.number}
                        </span>
                        {index === 2 && (
                          <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse" />
                            Live Now
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mt-2 text-left">{step.title}</h3>
                    </div>
                  </div>
                  
                  {/* Description - LEFT ALIGNED */}
                  <p className="text-gray-600 text-lg leading-relaxed text-left">
                    {step.description}
                  </p>
                  
                  {/* Feature tags - LEFT ALIGNED */}
                  <div className="flex flex-wrap gap-2 mt-4 justify-start">
                    {step.number === '01' && (
                      <>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">2-min booking</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">24/7 available</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Multi-speciality</span>
                      </>
                    )}
                    {step.number === '02' && (
                      <>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Priority scoring</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Emergency boost</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Senior citizen +20</span>
                      </>
                    )}
                    {step.number === '03' && (
                      <>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Live position</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Wait time estimate</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Auto-refresh</span>
                      </>
                    )}
                    {step.number === '04' && (
                      <>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">SMS alerts</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Push notifications</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">5-min warning</span>
                      </>
                    )}
                    {step.number === '05' && (
                      <>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Digital records</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">E-prescriptions</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Medical history</span>
                      </>
                    )}
                    {step.number === '06' && (
                      <>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Peak hours</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Resource allocation</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Monthly reports</span>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Empty div for spacing */}
              <div className="flex-1 hidden lg:block" />
            </motion.div>
          ))}
        </div>

        {/* Demo CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              
              <h3 className="text-3xl font-bold mb-4">Ready to transform your healthcare facility?</h3>
              <p className="text-xl text-blue-100 mb-8">Join 25+ healthcare facilities across India already using NexQueue</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center">
                  Schedule a Free Demo
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all">
                  Watch 2-min Demo
                </button>
              </div>
              <p className="text-sm text-blue-200 mt-6">No credit card required. Free 30-day trial.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add custom animation keyframes */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}

export default HowItWorksSection