import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const createAdminForce = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Delete any existing admin (clean slate)
    await usersCollection.deleteMany({ role: 'admin' });
    console.log('🗑️ Deleted existing admin users');

    // Create password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create new admin
    const admin = {
      fullName: 'Super Admin',
      email: 'admin@nexqueue.com',
      password: hashedPassword,
      role: 'admin',
      phone: '9999999999',
      age: 30,
      isActive: true,
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(admin);
    
    console.log('\n✅ ADMIN USER CREATED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('📧 Email:    admin@nexqueue.com');
    console.log('🔑 Password: admin123');
    console.log('🆔 Role:     admin');
    console.log('='.repeat(50));

    // Verify the password works
    const verifyUser = await usersCollection.findOne({ email: 'admin@nexqueue.com' });
    const isMatch = await bcrypt.compare('admin123', verifyUser.password);
    
    if (isMatch) {
      console.log('\n✅ Password verification: SUCCESS');
    } else {
      console.log('\n❌ Password verification: FAILED');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdminForce();