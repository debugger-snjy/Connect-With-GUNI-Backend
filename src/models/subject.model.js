import mongoose from 'mongoose';

// Defining the Schema for the Subject
const SubjectSchema = new mongoose.Schema({
    subjectShortForm: {
        type: String,
        required: true,
    },
    sem: {
        type: Number,
        required: true,
    },
    subjectName: {
        type: String,
        required: true,
    },
    subjectCode: {
        type: String,
        required: true,
        unique: true,
    },
    subjectFacultyIds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
    },
    subjectLectures: {
        type: Number,
        default: 10,
    },
    faculties: [{
        type: String,
        required: true,
    }],
});

// Exporting the model: 
// model takes a name and the schema

const Subject = mongoose.model("subject", SubjectSchema);
// Subject.createIndexes() // used to create indexes and don't save duplicates records
// To avoid creating 2 indexes, we will remove this and we will verfiy the duplicate Subject in the code itself (auth.js)
export default Subject;