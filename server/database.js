import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/");
        console.log("MongoDB connected Successfully")
    } catch(error) {
        console.log(error)
    }
}
export default connectDB;