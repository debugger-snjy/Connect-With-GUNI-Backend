import { validationResult } from "express-validator";
import Timetable from "../models/timetable.model.js";
import { APIError } from "../utils/apiError.js";
import { APIResponse } from "../utils/apiResponse.js";

// For Uploading Timetable - POST Request
// Full Route : /api/admin/upload/timetable
const uploadTimetable = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Timetable NOT Updated Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            // Setting up the parameters
            msg = "Subject Not Updated Successfully"
            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        // If no errors are present or found
        const { sem, batch, division, data } = req.body;

        const newTimetable = new Timetable({
            sem,
            batch,
            division,
            data
        })

        // Save the Timetable document to the database
        // If saved successfully
        if (await newTimetable.save()) {
            // Setting up the parameters
            msg = "Timetable has been Added Successfully"
            // Printing all the timetable 
            console.log(newTimetable)
            return res.json(new APIResponse(200, newTimetable, msg));
        } else {
            msg = "Timetable has NOT Added Successfully"
            return res.status(500).json(new APIError(500, msg, "Internal Server Error !"));
        }
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        msg = "Subject Not Updated Successfully"
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}

// For Fetching Timetable - POST Request
// Full Route : /api/admin/fetch/timetable
const fetchTimetable = async (req, res) => {
    let msg = "Timetable has NOT Fetched Successfully";
    try {
        // Finding all the Fees 
        const semesterTimetable = await Timetable.find({ sem: req.body.sem, batch: req.body.batch, division: req.body.division });

        if (semesterTimetable.length !== 0) {
            // Setting up the parameters
            msg = "Timetable has been Fetched Successfully"
            // Finding all the Fees 
            console.log(semesterTimetable)
        }

        return res.json(new APIResponse(200, semesterTimetable, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message));
    }
};

// For Fetching All Timetables - GET Request
// Full Route : /api/admin/fetch/alltimetables
const fetchAllTimetables = async (req, res) => {
    let msg = "Timetable has NOT Fetched Successfully";
    try {
        // Finding all the Fees 
        const semesterTimetable = await Timetable.find({});

        if (semesterTimetable.length !== 0) {
            // Setting up the parameters
            msg = "Timetable has been Fetched Successfully"
            // Finding all the Fees 
            console.log(semesterTimetable)
        }

        return res.json(new APIResponse(200, semesterTimetable, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message));
    }
};

// For Updating Timetable - PUT Request
// Full Route : /api/admin/edit/timetable/:timetableId
const updateTimetable = async (req, res) => {
    let msg = "Timetable NOT Updated Successfully";
    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            msg = "Timetable Not Updated Successfully"
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        // If no errors are present or found
        console.log("Data from API : ", req.body.allData)
        const { sem, batch, division, data } = req.body.allData;

        // Fetching Timetable Data :
        const timetableData = await Timetable.find({ _id: req.params.timetableId })

        console.log("API View : ", timetableData)

        if (timetableData) {
            console.log("Record Found")

            // Updating the Record : 
            const updatedTimetableData = await Timetable.findByIdAndUpdate(req.params.timetableId, {
                $set: {
                    sem,
                    batch,
                    division,
                    data
                }
            }, { new: true });

            if (updatedTimetableData) {
                // console.log("Done")
                msg = "Timetable has been Updated Successfully"
            }
            else {
                // console.log("Not Done")
                msg = "Timetable has NOT Updated Successfully"
            }

            return res.json(new APIResponse(200, updatedTimetableData, msg));
        }
        else {
            console.log("Record NOT Found")
            msg = "Timetable has NOT Found"
        }

        return res.status(404).json(new APIError(404, msg));
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        msg = "Subject Not Updated Successfully"
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}

// For Deleting Timetable - DELETE Request
// Full Route : /api/admin/delete/timetable/:timetableId
const deleteTimetable = async (req, res) => {
    let msg = "Timetable has NOT Deleted Successfully";
    try {
        // Finding the subject from the database, whether the subject exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const timetable = await Timetable.findById(req.params.timetableId);

        // If that subject doesn't exists, then returning the Bad Response
        if (!timetable) {
            msg = "Timetable Record Not Found"
            return res.status(404).json(new APIError(404, msg, "Timetable Record Not Found !"))
        }

        const deletedTimetable = await Timetable.findByIdAndDelete(req.params.timetableId);

        msg = "Timetable has been Deleted Successfully"

        return res.json(new APIResponse(200, deletedTimetable, msg));
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        msg = "Timetable Not Deleted Successfully"
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}


export {
    uploadTimetable,
    fetchTimetable,
    fetchAllTimetables,
    updateTimetable,
    deleteTimetable
}