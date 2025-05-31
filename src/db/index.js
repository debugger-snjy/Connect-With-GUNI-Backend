// Importing the Mongoose package
import { connect } from 'mongoose';

// Importing the dotenv package
import { config } from 'dotenv';

// Getting the Environment Variables from the env file
config();

// Defining the Mongo URI for Database
// Now, Defining the Database of ConnectWithGUNI
// const mongoURI = "mongodb+srv://sanjayasukhwani:ConnectWithGUNI-Sanjay@connectwithgunicluster.1l5ey.mongodb.net/ConnectWithGUNI?retryWrites=true&w=majority&appName=connectWithGUNICluster";

// Checking whether the node js is connected to mongoose or not
const connectToMongo = async () => {
    try {
        const db = await connect(process.env.MONGO_URI);
        console.log("Connection Successfull !");
        // Returning the Database to change the collections easily at any place in the another file
        return db;
    } catch (error) {
        console.log("Connection Failed !");
    }
}

// Exporting the connectToMongo function
export default connectToMongo