import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const db = process.env.MONGO_URI; // Use MONGO_URI here

    if (!db) {
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }

    const { connection } = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected to ${connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};
