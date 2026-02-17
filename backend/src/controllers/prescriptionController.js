import Prescription from '../models/Prescription.js';
import PharmacyQueue from '../models/PharmacyQueue.js';
import LabQueue from '../models/LabQueue.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// @desc    Create new prescription
// @route   POST /api/prescriptions/create
// @access  Private/Doctor
export const createPrescription = async (req, res) => {
  console.log('\n📝 CREATE PRESCRIPTION REQUEST');
  console.log('='.repeat(50));
  
  try {
    // Log the user
    console.log('👤 Doctor:', req.user?.email, req.user?._id);
    
    const { patientId, diagnosis, medicines, labTests, notes, followUpDate } = req.body;
    console.log('📦 Data received:', { patientId, diagnosis });

    // Validate required fields
    if (!patientId) {
      return res.status(400).json({ success: false, error: 'Patient ID is required' });
    }
    
    if (!diagnosis) {
      return res.status(400).json({ success: false, error: 'Diagnosis is required' });
    }

    // Check if patient exists
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    console.log('✅ Patient found:', patient.fullName);

    // Create prescription WITHOUT pre-save hook first
    const prescriptionData = {
      patientId: new mongoose.Types.ObjectId(patientId),
      doctorId: new mongoose.Types.ObjectId(req.user._id),
      diagnosis,
      medicines: medicines?.filter(m => m.name && m.dosage) || [],
      labTests: labTests?.filter(t => t.testName) || [],
      notes: notes || '',
      followUpDate: followUpDate || null,
      status: 'active',
      createdAt: new Date()
    };

    // Insert directly to avoid schema issues
    const db = mongoose.connection.db;
    const result = await db.collection('prescriptions').insertOne(prescriptionData);
    
    console.log('✅ Prescription created with ID:', result.insertedId);

    // Now add prescription number manually
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
    
    // Count today's prescriptions
    const startOfDay = new Date(date.setHours(0,0,0,0));
    const endOfDay = new Date(date.setHours(23,59,59,999));
    
    const count = await db.collection('prescriptions').countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    
    const prescriptionNumber = `RX-${dateStr}-${String(count).padStart(3, '0')}`;
    
    await db.collection('prescriptions').updateOne(
      { _id: result.insertedId },
      { $set: { prescriptionNumber } }
    );
    
    console.log('✅ Prescription number assigned:', prescriptionNumber);

    // Add to pharmacy queue if medicines exist
    if (medicines && medicines.length > 0) {
      const validMedicines = medicines.filter(m => m.name && m.dosage);
      if (validMedicines.length > 0) {
        const phmCount = await db.collection('pharmacyqueues').countDocuments({
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        
        const phmToken = `PHM-${dateStr}-${String(phmCount + 1).padStart(3, '0')}`;
        
        await db.collection('pharmacyqueues').insertOne({
          tokenNumber: phmToken,
          patientId: new mongoose.Types.ObjectId(patientId),
          prescriptionId: result.insertedId,
          medicines: validMedicines,
          prescribedBy: new mongoose.Types.ObjectId(req.user._id),
          priority: labTests?.some(t => t.urgent) ? 'urgent' : 'normal',
          status: 'waiting',
          createdAt: new Date()
        });
        
        console.log('✅ Pharmacy queue created:', phmToken);
      }
    }

    // Add to lab queue if lab tests exist
    if (labTests && labTests.length > 0) {
      const validTests = labTests.filter(t => t.testName);
      
      for (const test of validTests) {
        const labCount = await db.collection('labqueues').countDocuments({
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        
        const labToken = `LAB-${dateStr}-${String(labCount + 1).padStart(3, '0')}`;
        
        await db.collection('labqueues').insertOne({
          tokenNumber: labToken,
          patientId: new mongoose.Types.ObjectId(patientId),
          testType: test.testName.split(' ')[0].toLowerCase() || 'other',
          testName: test.testName,
          priority: test.urgent ? 'urgent' : 'normal',
          notes: test.instructions || '',
          requestedBy: new mongoose.Types.ObjectId(req.user._id),
          status: 'waiting',
          createdAt: new Date()
        });
        
        console.log(`✅ Lab queue created: ${labToken} - ${test.testName}`);
      }
    }

    console.log('='.repeat(50));
    console.log('✅ PRESCRIPTION CREATED SUCCESSFULLY');
    console.log('='.repeat(50));

    // Fetch the complete prescription to return
    const newPrescription = await db.collection('prescriptions').findOne({ _id: result.insertedId });

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      prescription: newPrescription
    });

  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Keep your other exports
export const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.params.patientId })
      .populate('doctorId', 'fullName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      prescriptions
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patientId', 'fullName email')
      .populate('doctorId', 'fullName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      prescriptions
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId', 'fullName email age phone')
      .populate('doctorId', 'fullName');

    if (!prescription) {
      return res.status(404).json({ success: false, error: 'Prescription not found' });
    }

    res.json({
      success: true,
      prescription
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};  