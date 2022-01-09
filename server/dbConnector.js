//LFG
//aUqBCD4_!_k2vPw
import mongoose from "mongoose"
const uri = "mongodb+srv://LFG:aUqBCD4_!_k2vPw@cluster0.f0liw.mongodb.net/LFG_App?retryWrites=true&w=majority";
    

export const connectDB = async () => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        

        console.log('MongoDB connected!!');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
};

export let db = mongoose.connection;

