import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Make it optional
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    enum: ['general', 'cardiology', 'orthopedics', 'pediatrics', 'neurology'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add validation for doctorId
appointmentSchema.pre('save', function(next) {
  if (this.doctorId === '' || this.doctorId === undefined) {
    this.doctorId = null;
  }
  next();
});

export default mongoose.model('Appointment', appointmentSchema);