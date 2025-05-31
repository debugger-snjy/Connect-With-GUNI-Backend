const mongoose = require('mongoose');

// Defining the Schema for the Timetable
const TimetableSchema = new mongoose.Schema({
    sem: {
        type: Number,
        required: true,
    },
    batch: {
        type: String,
        required: true,
    },
    division: {
        type: String,
        required: true,
    },
    data: {
        type: mongoose.SchemaTypes.Mixed,
        required: true
    },
    date: {
        type: String,
        default: () => new Date().toLocaleString(),
    },
});

// Exporting the model: 
// model takes a name and the schema

const Timetable = mongoose.model("timetable", TimetableSchema);
// Timetable.createIndexes() // used to create indexes and don't save duplicates records
// To avoid creating 2 indexes, we will remove this and we will verfiy the duplicate Timetable in the code itself (auth.js)
module.exports = Timetable;