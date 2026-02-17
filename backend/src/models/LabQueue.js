import mongoose from 'mongoose';

const labQueueSchema = new mongoose.Schema({
  tokenNumber: {
    type: String,
    required: true,
    unique: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  testType: {
    type: String,
    enum: ['blood', 'xray', 'mri', 'ctscan', 'ultrasound', 'ecg', 'other'],
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['normal', 'urgent', 'emergency'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'completed', 'cancelled'],
    default: 'waiting'
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String
  },
  results: {
    type: String
  },
  resultFile: {
    type: String // URL to uploaded file
  },
  estimatedWaitTime: {
    type: Number,
    default: 15 // minutes
  },
  currentPosition: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  startedAt: Date,
  completedAt: Date
});

// Index for fast queue queries
labQueueSchema.index({ status: 1, priority: -1, createdAt: 1 });

export default mongoose.model('LabQueue', labQueueSchema);