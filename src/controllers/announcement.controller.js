import { validationResult } from "express-validator";
import Announcement from "../models/announcement.model.js";
import { APIError } from "../utils/apiError.js";
import { APIResponse } from "../utils/apiResponse.js";

// For Uploading Announcement - POST Request
export const uploadAnnouncement = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Announcement has NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            // Setting up the parameters
            msg = "Announcement has NOT Uploaded Successfully"
            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        // If no errors are present or found
        const { title, description, sem, division, batch, links, announcedBy } = req.body;

        // Create a newAnnouncement Object with the new Updated Data 
        const newAnnouncement = new Announcement({
            announcementTitle: title,
            announcementDescription: description,
            announcementSem: sem,
            announcementDivision: division,
            announcementBatch: batch,
            announcementBy: announcedBy,
            additionalLinks: links
        });

        const announcementRecord = await newAnnouncement.save()

        // Save the Announcement document to the database
        if (announcementRecord) {
            // Setting up the parameters
            msg = "Announcement has been Uploaded Successfully"
            // Finding all the Students 
            console.log(newAnnouncement)
        }

        return res.json(new APIResponse(200, newAnnouncement, msg));
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        // Setting up the parameters
        msg = "Announcement has Not Uploaded Successfully"
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}

// For Fetching All Announcement - GET Request
// Full Route : /api/admin/fetch/announcement/all
export const fetchAllAnnouncements = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "All Announcements has NOT Fetched Successfully";

    try {

        const allAnnouncement = await Announcement.find({});

        if (allAnnouncement.length !== 0) {
            // Setting up the parameters
            msg = "All Announcements has been Fetched Successfully"
            // Finding all the Announcements
            console.log(allAnnouncement)
        }

        return res.json(new APIResponse(200, allAnnouncement, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message));
    }
};

// For Fetching Announcement By Semester - GET Request
// Full Route : /api/admin/fetch/announcement/sem/:sem
export const fetchAnnouncementsBySemDivBatch = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "All Semester Announcements has NOT Fetched Successfully";

    try {
        // Finding all the Announcements 
        const announcements = await Announcement.find({
            $and: [
                { $or: [{ announcementBatch: req.params.batch }, { announcementBatch: "all" }] },
                { $or: [{ announcementDivision: req.params.div }, { announcementDivision: "all" }] },
                { $or: [{ announcementSem: req.params.sem }, { announcementSem: "all" }] },
            ]
        });

        if (announcements.length !== 0) {
            // Setting up the parameters
            msg = "All Semester Announcements has been Fetched Successfully"
            // Finding all the Announcements 
            console.log(announcements)
        }

        return res.json(new APIResponse(200, announcements, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message));
    }
};

// For Fetching Announcement By Announcer - GET Request
// Full Route : /api/admin/fetch/announcement/:announcedBy
export const fetchAnnouncementsByAnnouncer = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "All Announcements has NOT Fetched Successfully";

    try {
        // Finding all the Announcements
        const announcements = await Announcement.find({ announcementBy: req.params.announcedBy });

        if (announcements.length !== 0) {
            // Setting up the parameters
            msg = "All Announcements has been Fetched Successfully"
            // Finding all the Announcements 
            console.log(announcements)
        }

        return res.json(new APIResponse(200, announcements, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message));
    }
};

// For Updating Announcement - PUT Request
// Full Route : /api/admin/update/announcement/:announcementId
export const updateAnnouncement = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Announcement has NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            // Setting up the parameters
            msg = "Announcement NOT Uploaded Successfully"
            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        // If no errors are present or found
        const { title, description, sem, division, batch, links, announcedBy } = req.body;

        // Fetching Announcement Data :
        const announcementData = await Announcement.find({ _id: req.params.announcementId })

        console.log(announcementData)

        if (announcementData) {
            console.log("Record Found")

            // Updating the Record : 
            const updatedAnnouncementData = await Announcement.findByIdAndUpdate(announcementData[0]._id, {
                $set: {
                    announcementTitle: title,
                    announcementDescription: description,
                    announcementSem: sem,
                    announcementDivision: division,
                    announcementBatch: batch,
                    announcementBy: announcedBy,
                    additionalLinks: links
                }
            }, { new: true });

            if (updatedAnnouncementData) {
                // console.log("Done")
                // Setting up the parameters
                msg = "Announcement has been Updated Successfully"
            }
            else {
                // console.log("Not Done")
                // Setting up the parameters
                msg = "Announcement has NOT Updated Successfully"
            }

            return res.json(new APIResponse(200, updatedAnnouncementData, msg));
        }
        else {
            console.log("Record NOT Found")
            // Setting up the parameters
            msg = "Announcement has NOT Found"
        }

        return res.status(404).json(new APIError(404, msg));
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        // Setting up the parameters
        msg = "Announcement Not Updated"
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}

// For Deleting Announcement - DELETE Request
// Full Route : /api/admin/delete/announcement/:announcementId
export const deleteAnnouncement = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Announcement NOT Deleted Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            // Setting up the parameters
            msg = "Announcement NOT Uploaded Successfully"
            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        const AnnouncementRecord = await Announcement.findOneAndDelete({ _id: req.params.announcementId })

        if (AnnouncementRecord) {
            msg = "Announcement has been Deleted Successfully";
        }
        else {
            msg = "Announcement has NOT Deleted Successfully";
        }

        return res.json(new APIResponse(200, AnnouncementRecord, msg));
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        // Setting up the parameters
        msg = "Announcement Record Not Updated"
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}