const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = 'mongodb+srv://sahiya54673_db_user:mIebJ2QXiOfk88nU@cluster0.1pwwtnb.mongodb.net/task-manager?appName=Cluster0';

    console.log('connect to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.error('PRO TIP: Check your IP whitelist in Atlas. For Vercel, you must allow access from anywhere (0.0.0.0/0).');
    // Don't exit process in serverless environment if possible, 
    // but here we need the connection to proceed.
    throw error;
  }
};

module.exports = connectDB;

