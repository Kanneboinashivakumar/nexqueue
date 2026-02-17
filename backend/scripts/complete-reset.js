// ONE-CLICK COMPLETE RESET
// Just run this file - it does EVERYTHING automatically

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const resetEverything = async () => {
  console.log('\n🧹 Starting COMPLETE RESET...\n');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all collections
    const collections = await mongoose.connection.db.collections();
    
    // Drop ALL collections
    for (let collection of collections) {
      await collection.drop();
      console.log(`🗑️ Dropped: ${collection.collectionName}`);
    }

    console.log('\n✨ DATABASE COMPLETELY CLEARED!');
    console.log('📭 All users, appointments, tokens, counters deleted\n');
    
    console.log('📝 READY FOR FRESH START:');
    console.log('   1. Restart backend: npm run dev');
    console.log('   2. Open frontend: http://localhost:5173');
    console.log('   3. Register new users\n');
    
    process.exit(0);
  } catch (error) {
    // If collection doesn't exist, that's fine
    if (error.code === 26) {
      console.log('✅ Database already empty');
      process.exit(0);
    }
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetEverything();