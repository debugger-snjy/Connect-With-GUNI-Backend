import mongoose from 'mongoose';

// Defining the Schema for the Marksheet
const MarksheetSchema = new mongoose.Schema({
    marksheetSem: {
        type: String,
        required: true,
    },
    marksheetDate: {
        type: Date,
        required: true,
    },
    marksheetEnroll: {
        type: String,
        required: true,
    },
    marksheetResult: {
        type: String,
        required: true,
    },
    marksheetGrade: {
        type: Number,
        required: true,
    },
    marksheetData: [{
        type: Array,
        required: true,
    }]
});

// Exporting the model: 
// model takes a name and the schema

const Marksheet = mongoose.model("marksheet", MarksheetSchema);
// Marksheet.createIndexes() // used to create indexes and don't save duplicates records
// To avoid creating 2 indexes, we will remove this and we will verfiy the duplicate Marksheet in the code itself (auth.js)
export default Marksheet;