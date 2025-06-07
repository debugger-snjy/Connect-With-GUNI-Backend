import mongoose from 'mongoose';

// Defining the Schema for the User
const AttendanceSchema = new mongoose.Schema({
    // Adding user in it for making it more specific
    // And using this we will only fetch notes of tha user only not any other user
    title: {
        type: String,
        required: true,
    },
    file: {
        type: String,
    },
    subject: {
        type: String,
    },
    sem: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        default: () => new Date().toLocaleString(),
    },
    uploadedBy: {
        type: String,
        required: true,
    }
});

// Exporting the model: 
// model takes a name and the schema
const Attendance = mongoose.model("attendances", AttendanceSchema);
export default Attendance;