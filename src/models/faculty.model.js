import mongoose from 'mongoose';

// Defining the Schema for the Faculty
const FacultySchema = new mongoose.Schema({
    facultyId: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
    },
    cabinLocation: {
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
    facultyShortForm: {
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
    dept: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: () => new Date().toLocaleString(),
    }
});

// Exporting the model: 
// model takes a name and the schema

const Faculty = mongoose.model("faculty", FacultySchema);
// Faculty.createIndexes() // used to create indexes and don't save duplicates records
// To avoid creating 2 indexes, we will remove this and we will verfiy the duplicate Faculty in the code itself (auth.js)
export default Faculty;