const mongoose = require('mongoose');

// Defining the Schema for the Fees
const AnnouncementSchema = new mongoose.Schema({
    announcementDate: {
        type: String,
        default: () => new Date().toLocaleString(),
        required: true,
    },
    announcementTitle: {
        type: String,
        required: true,
    },
    announcementDescription: {
        type: String,
        required: true,
    },
    announcementSem: {
        type: String,
        required: true,
        default : "all"
    },
    announcementBy: {
        type: String,
        required: true,
        default: "GUNI"
    },
    announcementDivision: {
        type: String,
        required: true,
        default: "all",
    },
    announcementBatch: {
        type: String,
        required: true,
        default: "all",
    },
    additionalLinks: {
        type: Object,
        required : true,
    }

});

// Exporting the model: 
// model takes a name and the schema

const Announcement = mongoose.model("announcements", AnnouncementSchema);
// Announcement.createIndexes() // used to create indexes and don't save duplicates records
// To avoid creating 2 indexes, we will remove this and we will verfiy the duplicate Fees in the code itself (auth.js)
module.exports = Announcement;