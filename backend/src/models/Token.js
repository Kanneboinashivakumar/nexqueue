import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
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
    ref: 'Appointment',
    required: true
  },
  priorityScore: {
    type: Number,
    required: true,
    default: 0
  },
  priorityType: {
    type: String,
    enum: ['normal', 'senior', 'emergency'],
    default: 'normal'
  },
  arrivalTime: {
    type: Date,
    default: Date.now
  },
  estimatedWaitTime: {
    type: Number, // in minutes
    default: 0
  },
  currentPosition: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['waiting', 'called', 'in-progress', 'completed'],
    default: 'waiting'
  },
  calledAt: {
    type: Date
  },
  servedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
});

// Auto-calculate priority score before save
tokenSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('priorityType') || this.isModified('arrivalTime')) {
    this.calculatePriorityScore();
  }
  next();
});

// Priority calculation method
tokenSchema.methods.calculatePriorityScore = function() {
  let baseScore = 0;
  
  // Base priority based on type
  switch (this.priorityType) {
    case 'emergency':
      baseScore = 100;
      break;
    case 'senior':
      baseScore = 50;
      break;
    case 'normal':
      baseScore = 10;
      break;
  }
  
  // Add waiting time bonus (0.1 point per minute waiting)
  const waitingMinutes = (new Date() - this.arrivalTime) / (1000 * 60);
  const waitingBonus = waitingMinutes * 0.1;
  
  this.priorityScore = baseScore + waitingBonus;
  return this.priorityScore;
};

// Update position in queue
tokenSchema.methods.updatePosition = async function() {
  const tokens = await this.constructor.find({ 
    status: 'waiting',
    _id: { $ne: this._id }
  }).sort({ priorityScore: -1, arrivalTime: 1 });
  
  this.currentPosition = tokens.findIndex(t => t.priorityScore < this.priorityScore) + 1;
  return this.currentPosition;
};

export default mongoose.model('Token', tokenSchema);