import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI) ;
        console.log(`Connect to MongoDB ${conn.connection.host}`);
    } catch(error){
        console.log("Failed to connect",error);
        process.exit(1);
    }
};