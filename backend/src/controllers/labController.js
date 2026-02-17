import LabQueue from '../models/LabQueue.js';
import User from '../models/User.js';
import Prescription from '../models/Prescription.js';

// @desc    Add patient to lab queue
// @route   POST /api/lab/add
// @access  Private/Doctor
export const addToLabQueue = async (req, res) => {
  try {
    const { patientId, testType, testName, priority, notes } = req.body;

    // Generate token number
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
    const count = await LabQueue.countDocuments({
      createdAt: { $gte: new Date(date.setHours(0,0,0,0)) }
    });
    const tokenNumber = `LAB-${dateStr}-${String(count + 1).padStart(3, '0')}`;

    const labEntry = new LabQueue({
      tokenNumber,
      patientId,
      testType,
      testName,
      priority,
      notes,
      requestedBy: req.user._id
    });

    await labEntry.save();

    // Recalculate positions
    await recalculateLabQueue();

    res.status(201).json({
      success: true,
      message: 'Added to lab queue',
      labEntry
    });
  } catch (error) {
    console.error('Lab queue error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get lab queue
// @route   GET /api/lab/queue
// @access  Private/LabStaff
export const getLabQueue = async (req, res) => {
  try {
    const queue = await LabQueue.find({ status: 'waiting' })
      .populate('patientId', 'fullName age priorityType')
      .populate('requestedBy', 'fullName')
      .sort({ priority: -1, createdAt: 1 });

    // Calculate positions
    const queueWithPositions = queue.map((item, index) => ({
      ...item.toObject(),
      currentPosition: index + 1,
      estimatedWaitTime: (index + 1) * 15 // 15 minutes per test
    }));

    res.json({
      success: true,
      queue: queueWithPositions
    });
  } catch (error) {
    console.error('Get lab queue error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Start lab test
// @route   PUT /api/lab/start/:id
// @access  Private/LabStaff
export const startLabTest = async (req, res) => {
  try {
    const labEntry = await LabQueue.findById(req.params.id);
    
    if (!labEntry) {
      return res.status(404).json({ success: false, error: 'Lab entry not found' });
    }

    labEntry.status = 'in-progress';
    labEntry.startedAt = new Date();
    labEntry.assignedTechnician = req.user._id;
    await labEntry.save();

    res.json({
      success: true,
      message: 'Lab test started',
      labEntry
    });
  } catch (error) {
    console.error('Start lab test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Complete lab test with results
// @route   PUT /api/lab/complete/:id
// @access  Private/LabStaff
export const completeLabTest = async (req, res) => {
  try {
    const { results } = req.body;
    const labEntry = await LabQueue.findById(req.params.id);
    
    if (!labEntry) {
      return res.status(404).json({ success: false, error: 'Lab entry not found' });
    }

    labEntry.status = 'completed';
    labEntry.completedAt = new Date();
    labEntry.results = results;
    await labEntry.save();

    res.json({
      success: true,
      message: 'Lab test completed',
      labEntry
    });
  } catch (error) {
    console.error('Complete lab test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper to recalculate queue positions
const recalculateLabQueue = async () => {
  const queue = await LabQueue.find({ status: 'waiting' }).sort({ priority: -1, createdAt: 1 });
  for (let i = 0; i < queue.length; i++) {
    queue[i].currentPosition = i + 1;
    await queue[i].save();
  }
};