// Importing the Mongoose package
const mongoose = require('mongoose');

// Importing the dotenv package
const dotenv = require('dotenv');

// Getting the Environment Variables from the env file
dotenv.config();

// Defining the Mongo URI for Database
// Now, Defining the Database of ConnectWithGUNI
const mongoURI = "mongodb://127.0.0.1:27017/ConnectWithGUNI"

// Checking whether the node js is connected to mongoose or not
const connectToMongo = async () => {
    try {
        const db = await mongoose.connect(mongoURI);
        console.log("Connection Successfull !");
        // Returning the Database to change the collections easily at any place in the another file
        return db;
    } catch (error) {
        console.log("Connection Failed !");
    }
}

// Exporting the connectToMongo function
module.exports = connectToMongo