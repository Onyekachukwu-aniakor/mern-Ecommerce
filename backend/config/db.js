import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MONGODB Successfully')
    } catch (error) {
        console.error('MongoDB NOT CONNECTED', error);
        process.exit(1)
        
    }
    
}
export default  connectDB;

