import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import User from './src/models/User.model.js';

dotenv.config();

async function clearAllSavedColleges() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connectDB();

    // Find all users with saved colleges
    const usersWithSaved = await User.find({ 'savedColleges.0': { $exists: true } });
    console.log(`📊 Found ${usersWithSaved.length} user(s) with saved colleges`);

    if (usersWithSaved.length > 0) {
      usersWithSaved.forEach(user => {
        console.log(`  User: ${user.email}, Saved colleges: ${user.savedColleges.length}`);
      });
    }

    console.log('🧹 Clearing all saved colleges...');
    const result = await User.updateMany(
      {},
      { $set: { savedColleges: [] } }
    );

    console.log(`✅ Modified ${result.modifiedCount} user(s)`);
    console.log(`✅ Matched ${result.matchedCount} user(s)`);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

clearAllSavedColleges();
