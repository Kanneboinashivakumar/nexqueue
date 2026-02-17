import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

const NetflixIntro = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    console.log('🎬 Netflix-style intro started')

    // Sequence timing - perfectly paced
    const sequence = async () => {
      // Step 0: Pure black screen (0.5s)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Step 1: Vertical light streak appears (1s)
      setStep(1)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Step 2: N appears with impact
      setStep(2)
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // Step 3: X appears
      setStep(3)
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // Step 4: Q appears with rotation
      setStep(4)
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Step 5: N → Ne and Q → Queue type SIMULTANEOUSLY
      setStep(5)
      await new Promise(resolve => setTimeout(resolve, 1400))
      
      // Step 6: Tagline appears at CENTER (no NXQ)
      setStep(6)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 7: Final zoom out to landing page
      setStep(7)
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      console.log('🎬 Intro complete')
      onComplete()
    }

    sequence()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [onComplete])

  // Canvas animation for the light streak
  useEffect(() => {
    if (step === 1 && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      let progress = 0
      
      const animateStreak = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        const centerX = canvas.width / 2
        const streakWidth = 4 + (progress * 30)
        const opacity = Math.min(0.7, progress * 1.2)
        
        const gradient = ctx.createLinearGradient(
          centerX, 0,
          centerX, canvas.height
        )
        
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0)')
        gradient.addColorStop(0.3, `rgba(59, 130, 246, ${opacity * 0.7})`)
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${opacity * 0.7})`)
        gradient.addColorStop(0.7, `rgba(59, 130, 246, ${opacity * 0.7})`)
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
        
        ctx.fillStyle = gradient
        ctx.fillRect(
          centerX - streakWidth / 2,
          0,
          streakWidth,
          canvas.height
        )
        
        ctx.shadowBlur = 20 * progress
        ctx.shadowColor = '#3B82F6'
        
        progress += 0.02
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateStreak)
        }
      }
      
      animateStreak()
    }
  }, [step])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="netflix-intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Canvas for light streak */}
        {step === 1 && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ filter: 'blur(6px)' }}
          />
        )}

        {/* Main content container - only for N, X, Q, Ne, Queue */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4">
          
          {/* N X Q Letters Container - Always side by side */}
          <div className="flex items-center justify-center space-x-4 min-h-[120px]">
            
            {/* N / Ne - Animated */}
            <AnimatePresence mode="wait">
              {step >= 2 && step < 5 && (
                <motion.div
                  key="letter-n"
                  initial={{ scale: 0, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 280,
                    damping: 22,
                    duration: 0.5
                  }}
                >
                  <motion.span
                    animate={{ 
                      textShadow: [
                        '0 0 15px rgba(59,130,246,0.5)',
                        '0 0 25px rgba(139,92,246,0.5)',
                        '0 0 15px rgba(59,130,246,0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-8xl md:text-9xl font-black text-white"
                    style={{ fontFamily: 'Arial Black, sans-serif' }}
                  >
                    N
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* N → Ne simultaneous typing */}
            <AnimatePresence mode="wait">
              {step === 5 && (
                <motion.div
                  key="ne-typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: 'auto' }}
                    transition={{ 
                      duration: 0.6, 
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: 0.1
                    }}
                    className="text-8xl md:text-9xl font-black text-white whitespace-nowrap overflow-hidden"
                    style={{ fontFamily: 'Arial Black, sans-serif' }}
                  >
                    <motion.span
                      animate={{ 
                        textShadow: [
                          '0 0 15px rgba(59,130,246,0.5)',
                          '0 0 25px rgba(139,92,246,0.5)',
                          '0 0 15px rgba(59,130,246,0.5)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Ne
                    </motion.span>
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* X - Middle letter */}
            <AnimatePresence mode="wait">
              {step >= 3 && step < 6 && (
                <motion.div
                  key="letter-x"
                  initial={{ scale: 0, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 280,
                    damping: 22,
                    duration: 0.5,
                    delay: 0.1
                  }}
                >
                  <motion.span
                    animate={{ 
                      textShadow: [
                        '0 0 15px rgba(139,92,246,0.5)',
                        '0 0 25px rgba(59,130,246,0.5)',
                        '0 0 15px rgba(139,92,246,0.5)'
                      ],
                      rotate: [0, 3, -3, 0]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="text-8xl md:text-9xl font-black text-white"
                    style={{ fontFamily: 'Arial Black, sans-serif' }}
                  >
                    X
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Q / Queue - Animated */}
            <AnimatePresence mode="wait">
              {step >= 4 && step < 5 && (
                <motion.div
                  key="letter-q"
                  initial={{ scale: 0, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 280,
                    damping: 22,
                    duration: 0.5
                  }}
                  className="relative"
                >
                  {/* Subtle queue circle animation */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-blue-500/30"
                    style={{ 
                      borderTopColor: 'transparent',
                      borderRightColor: '#8B5CF6',
                      borderBottomColor: 'transparent',
                      borderLeftColor: '#3B82F6'
                    }}
                  />
                  <motion.span
                    animate={{ 
                      textShadow: [
                        '0 0 15px rgba(59,130,246,0.5)',
                        '0 0 25px rgba(139,92,246,0.5)',
                        '0 0 15px rgba(59,130,246,0.5)'
                      ],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-8xl md:text-9xl font-black text-white relative z-10"
                    style={{ fontFamily: 'Arial Black, sans-serif' }}
                  >
                    Q
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Q → Queue simultaneous typing */}
            <AnimatePresence mode="wait">
              {step === 5 && (
                <motion.div
                  key="queue-typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: 'auto' }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: 0.1
                    }}
                    className="text-8xl md:text-9xl font-black text-white whitespace-nowrap overflow-hidden"
                    style={{ fontFamily: 'Arial Black, sans-serif' }}
                  >
                    <motion.span
                      animate={{ 
                        textShadow: [
                          '0 0 15px rgba(139,92,246,0.5)',
                          '0 0 25px rgba(59,130,246,0.5)',
                          '0 0 15px rgba(139,92,246,0.5)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Queue
                    </motion.span>
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tagline - PERFECTLY CENTERED, appears after typing animation */}
        <AnimatePresence mode="wait">
          {step >= 6 && (
            <motion.div
              key="tagline-centered"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2
              }}
              className="absolute inset-0 flex flex-col items-center justify-center z-20"
            >
              <div className="text-center">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-3xl md:text-4xl text-white/90 font-light tracking-[4px] mb-4"
                >
                  Skip the Queue.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-4xl md:text-5xl font-bold"
                >
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Meet the Cure.
                  </span>
                </motion.p>
                
                {/* Subtle underline animation */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '80px' }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-6 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle NXQ watermark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 right-12 text-white text-2xl font-black z-30"
          style={{ fontFamily: 'Arial Black, sans-serif' }}
        >
          NXQ
        </motion.div>

        {/* Very subtle film grain */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay z-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '100px 100px'
          }}
        />

        {/* Smooth zoom out to landing page */}
        {step === 7 && (
          <motion.div
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="absolute inset-0 bg-black z-50"
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default NetflixIntro