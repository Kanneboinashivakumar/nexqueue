import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const createPharmacyUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const hashedPassword = await bcrypt.hash('staff123', 10);
    
    await mongoose.connection.db.collection('users').insertOne({
      fullName: 'Pharmacist',
      email: 'pharmacy@test.com',
      password: hashedPassword,
      role: 'staff',
      phone: '9876543260',
      age: 32,
      isActive: true,
      createdAt: new Date()
    });
    
    console.log('✅ Pharmacy user created successfully!');
    console.log('📧 Email: pharmacy@test.com');
    console.log('🔑 Password: staff123');
    console.log('📍 Dashboard: http://localhost:5173/pharmacy');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating pharmacy user:', error);
    process.exit(1);
  }
};

createPharmacyUser();