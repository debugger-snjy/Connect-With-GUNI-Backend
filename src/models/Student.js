const mongoose = require('mongoose');

// Defining the Schema for the Student
const StudentSchema = new mongoose.Schema({
    enrollNo: {
        type: String,
        required: true,
        unique: true,
    },
    batch: {
        type: String,
        required: true,
    },
    division: {
        type: String,
        required: true,
    },
    sem: {
        type: Number,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    role: {
        type: String,
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
        type: String,
        default: () => new Date().toLocaleString(),
    },
    gender: {
        type: String,
        required : true
    },
    attendanceData: [{
        type: Object,
    }],
});

// Exporting the model: 
// model takes a name and the schema

const Student = mongoose.model("student", StudentSchema);
// Student.createIndexes() // used to create indexes and don't save duplicates records
// To avoid creating 2 indexes, we will remove this and we will verfiy the duplicate student in the code itself (auth.js)
module.exports = Student;