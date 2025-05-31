const mongoose = require('mongoose');

// Defining the Schema for the User
const MaterialSchema = new mongoose.Schema({
    // Adding user in it for making it more specific
    // And using this we will only fetch notes of tha user only not any other user
    title: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
    },
    file: {
        type: String,
    },
    sem: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: () => new Date().toLocaleString(),
    },
    type: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: String,
        required: true,
    }
});

// Exporting the model: 
// model takes a name and the schema
module.exports = mongoose.model("materials", MaterialSchema);