import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  prescriptionNumber: {
    type: String,
    unique: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  diagnosis: {
    type: String,
    required: true
  },
  medicines: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    quantity: Number,
    instructions: String
  }],
  labTests: [{
    testName: String,
    instructions: String,
    urgent: Boolean
  }],
  notes: String,
  followUpDate: Date,
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate prescription number before saving
prescriptionSchema.pre('save', async function(next) {
  if (!this.prescriptionNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const startOfDay = new Date(date.setHours(0,0,0,0));
    const endOfDay = new Date(date.setHours(23,59,59,999));
    
    const count = await mongoose.model('Prescription').countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    
    this.prescriptionNumber = `RX-${year}${month}${day}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;