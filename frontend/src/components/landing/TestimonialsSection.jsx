import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'

const TestimonialsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Medical Officer',
      hospital: 'Kigali Central Hospital',
      quote: 'NexQueue has reduced our patient wait times by 60% and improved staff efficiency significantly. The priority-based queuing system is a game-changer.',
      rating: 5,
      image: 'SJ',
      color: 'blue'
    },
    {
      name: 'James Mukamana',
      role: 'Patient',
      hospital: 'King Faisal Hospital',
      quote: 'I used to spend hours waiting. Now I get notifications when it\'s my turn and arrive exactly on time. This is how healthcare should work.',
      rating: 5,
      image: 'JM',
      color: 'purple'
    },
    {
      name: 'Dr. Marie Uwimana',
      role: 'Head of Emergency',
      hospital: 'University Teaching Hospital',
      quote: 'The real-time analytics help us optimize staff allocation during peak hours. We\'ve seen a 40% improvement in patient flow.',
      rating: 5,
      image: 'MU',
      color: 'green'
    },
    {
      name: 'Peter Kagame',
      role: 'Hospital Administrator',
      hospital: 'Rwanda Military Hospital',
      quote: 'Implementation was seamless. The dashboard gives us complete visibility into our operations. Best investment we\'ve made.',
      rating: 5,
      image: 'PK',
      color: 'yellow'
    }
  ]

  return (
    <section id="impact" ref={ref} className="py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-6">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Healthcare Leaders
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Real feedback from healthcare providers and patients across Rwanda
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Featured Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-1">
              <div className="bg-white rounded-3xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
                    {testimonials[activeIndex].image}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold text-gray-900">{testimonials[activeIndex].name}</h4>
                    <p className="text-blue-600">{testimonials[activeIndex].role}</p>
                    <p className="text-sm text-gray-500">{testimonials[activeIndex].hospital}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-xl text-gray-700 italic mb-6">"{testimonials[activeIndex].quote}"</p>

                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Verified Healthcare Professional</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial Thumbnails */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, x: 10 }}
                onClick={() => setActiveIndex(index)}
                className={`p-6 rounded-2xl cursor-pointer transition-all ${
                  activeIndex === index
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${testimonial.color}-500 to-${testimonial.color}-600 flex items-center justify-center text-white font-bold`}>
                    {testimonial.image}
                  </div>
                  <div className="ml-4">
                    <h5 className="font-semibold text-gray-900">{testimonial.name}</h5>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white"
        >
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">25+</div>
              <div className="text-gray-300">Healthcare Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">50k+</div>
              <div className="text-gray-300">Patients Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">60%</div>
              <div className="text-gray-300">Wait Time Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">98%</div>
              <div className="text-gray-300">Satisfaction Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection