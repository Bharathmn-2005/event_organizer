import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('');
    console.log('================================================');
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    console.log('================================================');
    console.log('');
    
  } catch (error) {
    console.log('');
    console.log('================================================');
    console.error('❌ MongoDB Connection Failed!');
    console.error('Error:', error.message);
    console.log('================================================');
    console.log('');
    console.log('💡 Please make sure MongoDB is running:');
    console.log('   1. Install MongoDB from: https://www.mongodb.com/try/download/community');
    console.log('   2. Start MongoDB service or run: mongod');
    console.log('   3. Check your MONGODB_URI in .env file');
    console.log('');
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('');
  console.log('⚠️  MongoDB Disconnected!');
  console.log('');
});

mongoose.connection.on('error', (err) => {
  console.log('');
  console.error('❌ MongoDB Connection Error:', err.message);
  console.log('');
});

export default connectDB;
