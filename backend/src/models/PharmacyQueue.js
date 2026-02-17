import mongoose from 'mongoose';

const pharmacyQueueSchema = new mongoose.Schema({
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
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  medicines: [{
    name: String,
    dosage: String,
    quantity: Number,
    instructions: String
  }],
  priority: {
    type: String,
    enum: ['normal', 'urgent', 'emergency'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['waiting', 'processing', 'ready', 'completed', 'cancelled'],
    default: 'waiting'
  },
  assignedPharmacist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  insuranceVerified: {
    type: Boolean,
    default: false
  },
  totalCost: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'insurance'],
    default: 'pending'
  },
  estimatedWaitTime: {
    type: Number,
    default: 10 // minutes
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
pharmacyQueueSchema.index({ status: 1, priority: -1, createdAt: 1 });

export default mongoose.model('PharmacyQueue', pharmacyQueueSchema);