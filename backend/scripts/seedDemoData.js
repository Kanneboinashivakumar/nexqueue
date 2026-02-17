import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from '../src/models/User.js'
import Appointment from '../src/models/Appointment.js'
import Token from '../src/models/Token.js'

dotenv.config()

const demoUsers = [
  {
    fullName: 'John Patient',
    email: 'john@clinic.com',
    password: 'patient123',
    role: 'patient',
    phone: '9876543210',
    age: 35,
    priorityType: 'normal'
  },
  {
    fullName: 'Sarah Senior',
    email: 'sarah@clinic.com',
    password: 'patient123',
    role: 'patient',
    phone: '9876543211',
    age: 68,
    priorityType: 'senior'
  },
  {
    fullName: 'Emergency Patient',
    email: 'emergency@clinic.com',
    password: 'patient123',
    role: 'patient',
    phone: '9876543212',
    age: 45,
    priorityType: 'emergency'
  },
  {
    fullName: 'Staff Member',
    email: 'staff@clinic.com',
    password: 'staff123',
    role: 'staff',
    phone: '9876543220',
    age: 30,
    priorityType: 'normal'
  },
  {
    fullName: 'Dr. Sarah Lee',
    email: 'doctor@clinic.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '9876543230',
    age: 40,
    priorityType: 'normal'
  }
]

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Appointment.deleteMany({})
    await Token.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // Create users
    const createdUsers = []
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const user = new User({
        ...userData,
        password: hashedPassword
      })
      await user.save()
      createdUsers.push(user)
      console.log(`👤 Created user: ${user.email}`)
    }

    // Create appointments for patients
    const patients = createdUsers.filter(u => u.role === 'patient')
    const doctor = createdUsers.find(u => u.role === 'doctor')
    
    for (const patient of patients) {
      const appointment = new Appointment({
        patientId: patient._id,
        doctorId: doctor?._id,
        date: new Date(),
        time: '10:00',
        purpose: 'Regular checkup',
        department: 'general',
        status: 'scheduled'
      })
      await appointment.save()
      console.log(`📅 Created appointment for: ${patient.fullName}`)

      // Create token
      const tokenNumber = `T-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${patient._id.toString().slice(-3)}`
      const token = new Token({
        tokenNumber,
        patientId: patient._id,
        appointmentId: appointment._id,
        priorityType: patient.priorityType,
        priorityScore: patient.priorityType === 'emergency' ? 100 : 
                      patient.priorityType === 'senior' ? 50 : 10,
        arrivalTime: new Date(),
        estimatedWaitTime: Math.floor(Math.random() * 30) + 5,
        currentPosition: Math.floor(Math.random() * 5) + 1,
        status: 'waiting'
      })
      await token.save()
      console.log(`🎫 Created token: ${tokenNumber} for ${patient.fullName}`)
    }

    console.log('✅ Database seeded successfully!')
    console.log('\n📋 Demo Credentials:')
    console.log('====================')
    demoUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`)
    })
    console.log('\n🚀 Start the app and use these credentials to login!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()