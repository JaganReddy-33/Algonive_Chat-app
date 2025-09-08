import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected");
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/ChatApp`);

  } catch (error) {
    console.error("❌ Failed to connect:", error);
    process.exit(1);
  }
};
