import mongoose from "mongoose";

const connectDB = async() => {
    try {
        mongoose.connection.on("connected", () => console.log("Connected")); // Fixed syntax
        await mongoose.connect(`${process.env.MONGODB_URI}/Painting_Store`);
    } catch (error) {
        console.error(error.message);
    }
}

export default connectDB;