import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import Token from '../models/Token.js';
import { generateTokenNumber, recalculateQueue } from '../utils/priorityCalculator.js';

// ===============================
// Book Appointment
// ===============================
export const bookAppointment = async (req, res) => {
  try {
    const { date, time, purpose, department } = req.body; // doctorId removed
    const patientId = req.user._id;

    // Create appointment (doctorId optional)
    const appointment = new Appointment({
      patientId,
      date: new Date(date),
      time,
      purpose,
      department
    });

    await appointment.save();

    // Generate queue token
    const tokenNumber = await generateTokenNumber();

    const token = new Token({
      tokenNumber,
      patientId,
      appointmentId: appointment._id,
      priorityType: req.user.priorityType,
      priorityScore: 0,
      arrivalTime: new Date(),
      estimatedWaitTime: 0,
      currentPosition: 0,
      status: 'waiting'
    });

    await token.save();

    // Recalculate queue positions
    await recalculateQueue(Token);

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
      token
    });

  } catch (error) {
    console.error('Appointment booking error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ===============================
// Get User Appointments
// ===============================
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate('doctorId', 'fullName') // works only if doctorId exists in schema
      .sort({ date: -1 });

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===============================
// Get All Appointments (Staff/Doctor)
// ===============================
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'fullName email phone age priorityType')
      .populate('doctorId', 'fullName')
      .sort({ date: 1, time: 1 });

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
