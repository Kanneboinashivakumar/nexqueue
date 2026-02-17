import mongoose from 'mongoose';
import Token from '../models/Token.js';
import { recalculateQueue } from '../utils/priorityCalculator.js';

// ✅ Get Current Queue (for staff)
export const getQueue = async (req, res) => {
  try {
    const queue = await Token.find({ status: 'waiting' })
      .populate('patientId', 'fullName email phone age priorityType')
      .sort({ priorityScore: -1, arrivalTime: 1 });

    res.json(queue);
  } catch (error) {
    console.error('Get queue error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ NEW: Get Doctor's Queue (patients who are called or in-progress)
export const getDoctorQueue = async (req, res) => {
  try {
    const doctorQueue = await Token.find({ 
      status: { $in: ['called', 'in-progress'] } 
    })
      .populate('patientId', 'fullName email phone age priorityType')
      .sort({ calledAt: 1 });

    res.json(doctorQueue);
  } catch (error) {
    console.error('Get doctor queue error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Patient's Token Status
export const getPatientToken = async (req, res) => {
  try {
    const token = await Token.findOne({ 
      patientId: req.user._id, 
      status: { $in: ['waiting', 'called', 'in-progress'] } 
    })
      .populate('patientId', 'fullName email phone age');

    if (!token) {
      return res.status(404).json({ error: 'No active token found' });
    }

    res.json(token);
  } catch (error) {
    console.error('Get patient token error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Call Next Patient
export const callNextPatient = async (req, res) => {
  try {
    const nextToken = await Token.findOne({ status: 'waiting' })
      .sort({ priorityScore: -1, arrivalTime: 1 });

    if (!nextToken) {
      return res.status(404).json({ error: 'No patients in queue' });
    }

    nextToken.status = 'called';
    nextToken.calledAt = new Date();
    await nextToken.save();

    await recalculateQueue(Token);

    res.json({
      message: 'Patient called successfully',
      token: nextToken
    });
  } catch (error) {
    console.error('Call next patient error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Mark Token as Emergency
export const markAsEmergency = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const token = await Token.findById(tokenId);
    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }

    token.priorityType = 'emergency';
    token.priorityScore = token.calculatePriorityScore();
    await token.save();

    await recalculateQueue(Token);

    res.json({
      message: 'Token marked as emergency',
      token
    });
  } catch (error) {
    console.error('Mark emergency error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Skip Patient
export const skipPatient = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const token = await Token.findById(tokenId);
    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }

    // Move to bottom of queue with penalty
    token.priorityScore -= 20;
    await token.save();

    await recalculateQueue(Token);

    res.json({
      message: 'Patient skipped',
      token
    });
  } catch (error) {
    console.error('Skip patient error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Mark as Completed
export const markAsCompleted = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const token = await Token.findById(tokenId);
    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }

    token.status = 'completed';
    token.servedAt = new Date();
    await token.save();

    await recalculateQueue(Token);

    res.json({
      message: 'Token marked as completed',
      token
    });
  } catch (error) {
    console.error('Mark completed error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ NEW: Mark token as in-progress (doctor started consultation)
export const markAsInProgress = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const token = await Token.findById(tokenId);
    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }

    token.status = 'in-progress';
    await token.save();

    res.json({
      message: 'Consultation started',
      token
    });
  } catch (error) {
    console.error('Mark in-progress error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ NEW: Update patient notes
export const updatePatientNotes = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { notes } = req.body;

    const token = await Token.findById(tokenId);
    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }

    token.notes = notes;
    await token.save();

    res.json({
      message: 'Notes updated successfully',
      token
    });
  } catch (error) {
    console.error('Update notes error:', error);
    res.status(500).json({ error: error.message });
  }
};