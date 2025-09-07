import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected");
    });

    await mongoose.connect(process.env.MONGO_URI);

  } catch (error) {
    console.error("❌ Failed to connect:", error);
    process.exit(1);
  }
};
