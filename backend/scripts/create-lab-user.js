import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const createLabUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const hashedPassword = await bcrypt.hash('staff123', 10);
    
    await mongoose.connection.db.collection('users').insertOne({
      fullName: 'Lab Technician',
      email: 'lab@test.com',
      password: hashedPassword,
      role: 'staff',
      phone: '9876543250',
      age: 28,
      isActive: true,
      createdAt: new Date()
    });
    
    console.log('✅ Lab user created: lab@test.com / staff123');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createLabUser();