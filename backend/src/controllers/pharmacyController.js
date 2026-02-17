import PharmacyQueue from '../models/PharmacyQueue.js';
import Prescription from '../models/Prescription.js';

// @desc    Add prescription to pharmacy queue
// @route   POST /api/pharmacy/add
// @access  Private/Doctor
export const addToPharmacyQueue = async (req, res) => {
  try {
    const { patientId, prescriptionId, medicines, insuranceVerified } = req.body;

    // Get prescription details
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ success: false, error: 'Prescription not found' });
    }

    // Generate token number
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
    const count = await PharmacyQueue.countDocuments({
      createdAt: { $gte: new Date(date.setHours(0,0,0,0)) }
    });
    const tokenNumber = `PHM-${dateStr}-${String(count + 1).padStart(3, '0')}`;

    const pharmacyEntry = new PharmacyQueue({
      tokenNumber,
      patientId,
      prescriptionId,
      medicines: medicines || prescription.medicines,
      prescribedBy: req.user._id,
      insuranceVerified
    });

    await pharmacyEntry.save();

    // Recalculate positions
    await recalculatePharmacyQueue();

    res.status(201).json({
      success: true,
      message: 'Added to pharmacy queue',
      pharmacyEntry
    });
  } catch (error) {
    console.error('Pharmacy queue error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get pharmacy queue
// @route   GET /api/pharmacy/queue
// @access  Private/Pharmacist
export const getPharmacyQueue = async (req, res) => {
  try {
    const queue = await PharmacyQueue.find({ status: 'waiting' })
      .populate('patientId', 'fullName age')
      .populate('prescribedBy', 'fullName')
      .sort({ priority: -1, createdAt: 1 });

    // Calculate positions and wait times
    const queueWithDetails = queue.map((item, index) => ({
      ...item.toObject(),
      currentPosition: index + 1,
      estimatedWaitTime: (index + 1) * 8 // 8 minutes per prescription
    }));

    res.json({
      success: true,
      queue: queueWithDetails
    });
  } catch (error) {
    console.error('Get pharmacy queue error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Start processing prescription
// @route   PUT /api/pharmacy/start/:id
// @access  Private/Pharmacist
export const startProcessing = async (req, res) => {
  try {
    const pharmacyEntry = await PharmacyQueue.findById(req.params.id);
    
    if (!pharmacyEntry) {
      return res.status(404).json({ success: false, error: 'Entry not found' });
    }

    pharmacyEntry.status = 'processing';
    pharmacyEntry.startedAt = new Date();
    pharmacyEntry.assignedPharmacist = req.user._id;
    await pharmacyEntry.save();

    res.json({
      success: true,
      message: 'Processing started',
      pharmacyEntry
    });
  } catch (error) {
    console.error('Start processing error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Mark prescription as ready
// @route   PUT /api/pharmacy/ready/:id
// @access  Private/Pharmacist
export const markAsReady = async (req, res) => {
  try {
    const pharmacyEntry = await PharmacyQueue.findById(req.params.id);
    
    if (!pharmacyEntry) {
      return res.status(404).json({ success: false, error: 'Entry not found' });
    }

    pharmacyEntry.status = 'ready';
    await pharmacyEntry.save();

    res.json({
      success: true,
      message: 'Prescription ready for pickup',
      pharmacyEntry
    });
  } catch (error) {
    console.error('Mark ready error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Complete prescription pickup
// @route   PUT /api/pharmacy/complete/:id
// @access  Private/Pharmacist
export const completePickup = async (req, res) => {
  try {
    const pharmacyEntry = await PharmacyQueue.findById(req.params.id);
    
    if (!pharmacyEntry) {
      return res.status(404).json({ success: false, error: 'Entry not found' });
    }

    pharmacyEntry.status = 'completed';
    pharmacyEntry.completedAt = new Date();
    await pharmacyEntry.save();

    res.json({
      success: true,
      message: 'Prescription picked up',
      pharmacyEntry
    });
  } catch (error) {
    console.error('Complete pickup error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper to recalculate positions
const recalculatePharmacyQueue = async () => {
  const queue = await PharmacyQueue.find({ status: 'waiting' }).sort({ priority: -1, createdAt: 1 });
  for (let i = 0; i < queue.length; i++) {
    queue[i].currentPosition = i + 1;
    await queue[i].save();
  }
};