import mongoose from 'mongoose';

// Defining the Schema for the Admin
const AdminSchema = new mongoose.Schema({

    role: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// Exporting the model: 
// model takes a name and the schema

const Admin = mongoose.model("admin", AdminSchema);
// Admin.createIndexes() // used to create indexes and don't save duplicates records
// To avoid creating 2 indexes, we will remove this and we will verfiy the duplicate Admin in the code itself (auth.js)
export default Admin;