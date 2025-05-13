import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const user = "invoice-pilot";
  const password = "!!InvoiceDBMaster%40123";
  const uri = `mongodb+srv://${user}:${password}@cluster0.wn7mtz5.mongodb.net/`;

  try {
    //const conn = await mongoose.connect(process.env.MONGODB_URI);
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;