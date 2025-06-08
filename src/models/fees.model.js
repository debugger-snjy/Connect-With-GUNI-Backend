import mongoose from 'mongoose';

// Defining the Schema for the Fees
const FeesSchema = new mongoose.Schema({
    feesId: {
        type: String,
        required: true,
        unique: true,
    },
    feesDate: {
        type: Date,
        default : Date.now,
        required: true,
    },
    feesMode: {
        type: String,
        required: true,
    },
    feesAmount: {
        type: Number,
        default: 10,
    },
    feesTitle:{
        type: String,
        required: true,
    },
    feesSem:{
        type: String,
        required: true,
    },
    feesEnroll: {
        type: String,
        required: true,
    }

});

// Exporting the model: 
// model takes a name and the schema

const Fees = mongoose.model("fees", FeesSchema);
// Fees.createIndexes() // used to create indexes and don't save duplicates records
// To avoid creating 2 indexes, we will remove this and we will verfiy the duplicate Fees in the code itself (auth.js)
export default Fees;