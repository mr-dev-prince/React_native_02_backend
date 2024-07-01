import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "react-native-app",
    });
    console.log("Database Connected!");
  } catch (error) {
    console.log("Database connection error", error);
  }
};
