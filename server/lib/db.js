import mongoose from "mongoose/ChatApp";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected");
    });

    await mongoose.connect(`${process.env.MONGODB_URI}`);

  } catch (error) {
    console.error("❌ Failed to connect:", error);
    process.exit(1);
  }
};
