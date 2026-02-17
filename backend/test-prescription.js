import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const testPrescription = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Use your actual IDs
    const patientId = '698fa055f06015411c855b8e';
    const doctorId = '698fa064f06015411c855b90';

    // Test prescription data
    const testData = {
      patientId: new mongoose.Types.ObjectId(patientId),
      doctorId: new mongoose.Types.ObjectId(doctorId),
      diagnosis: 'Test Diagnosis',
      medicines: [
        {
          name: 'Paracetamol',
          dosage: '650mg',
          frequency: '3 times daily',
          duration: '3 days',
          quantity: 10,
          instructions: 'After food'
        }
      ],
      labTests: [
        {
          testName: 'Complete Blood Count',
          instructions: 'Fasting required',
          urgent: false
        }
      ],
      notes: 'Test notes',
      status: 'active',
      createdAt: new Date()
    };

    // Insert directly into prescriptions collection
    const result = await db.collection('prescriptions').insertOne(testData);
    console.log('✅ Test prescription created with ID:', result.insertedId);

    // Check if it was created
    const check = await db.collection('prescriptions').findOne({ _id: result.insertedId });
    console.log('✅ Verified prescription:', check.prescriptionNumber || 'No number yet');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit();
  }
};

testPrescription();