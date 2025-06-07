import { validationResult } from "express-validator";
import Marksheet from "../models/marksheet.model.js";
import { APIError } from "../utils/apiError.js";
import { APIResponse } from "../utils/apiResponse.js";
import { MongoClient } from "mongodb";

// For Uploading Marksheet - POST Request
// Full Route : /api/admin/upload/marksheet/
const uploadMarksheet = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Marksheet has NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            // Setting up the parameters
            msg = "Marksheet has NOT Uploaded Successfully"
            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        // If no errors are present or found
        const { title, sem, result, grade, data, enroll, date } = req.body;

        // Checking for the existing Record : 
        const searchedMarksheet = await Marksheet.find({
            $and: [
                { "marksheetSem": sem },
                { "marksheetEnroll": enroll },
            ]
        })

        if (searchedMarksheet.length === 0) {
            // Create a newMarksheet Object with the new Updated Data 
            const newMarksheet = new Marksheet({
                marksheetEnroll: enroll,
                marksheetSem: sem,
                marksheetDate: date,
                marksheetResult: result,
                marksheetGrade: grade,
                marksheetData: data,
            });

            const marksheetRecord = await newMarksheet.save()

            // Save the Marksheet document to the database
            if (marksheetRecord) {
                // Setting up the parameters
                msg = "Marksheet has been Uploaded Successfully"
                // Finding all the Students 
                console.log(newMarksheet)
            }

            return res.json(new APIResponse(200, newMarksheet, msg));
        }
        else {
            msg = "Marksheet already Exists !";
            return res.status(409).json(new APIError(409, msg));
        }

    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        // Setting up the parameters
        msg = "Marksheet has Not Uploaded Successfully"
        return res.status(500).json(new APIError(500, msg, error.message))
    }
}

// For Fetching Marksheet - GET Request
// Full Route : /api/admin/fetch/marksheet/:id
const fetchMarksheetById = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Marksheet has NOT Fetched Successfully";

    try {
        // Finding all the Marksheets 
        const marksheetData = await Marksheet.find({ _id: req.params.id });

        if (marksheetData.length !== 0) {
            // Setting up the parameters
            msg = "Marksheet has been Fetched Successfully"
            // Printing all the marksheet Data
            console.log(marksheetData)
        }

        return res.json(new APIResponse(200, marksheetData, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message))
    }
};

// For Fetching All Marksheet - GET Request
// Full Route : /api/admin/fetch/marksheet/all
const fetchAllMarksheet = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "All Marksheets has NOT Fetched Successfully";

    try {
        const client = new MongoClient("mongodb://127.0.0.1:27017/ConnectWithGUNI", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const databaseObject = client.db('ConnectWithGUNI');
        const collection = databaseObject.collection("marksheets");

        // Use the find method to retrieve all records
        const cursor = collection.find();

        // Convert the cursor to an array of documents
        const allMarksheet = await cursor.toArray();

        if (allMarksheet.length !== 0) {
            // Setting up the parameters
            msg = "All Marksheets has been Fetched Successfully"
            // Finding all the Marksheets
            console.log(allMarksheet)
        }

        return res.json(new APIResponse(200, allMarksheet, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message))
    }
};

// For Fetching Marksheet By Semester - GET Request
// Full Route : /api/admin/fetch/marksheet/sem/:sem
const fetchMarksheetBySem = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "All Semester Marksheets has NOT Fetched Successfully";

    try {
        // Finding all the Marksheet 
        const allSemMarksheet = await Marksheet.find({ marksheetSem: req.params.sem });

        if (allSemMarksheet.length !== 0) {
            // Setting up the parameters
            msg = "All Semester Marksheets has been Fetched Successfully"
            // Finding all the Marksheet 
            console.log(allSemMarksheet)
        }

        return res.json(new APIResponse(200, allSemMarksheet, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message))
    }
};

// For Fetching Marksheet By Semester and Enroll - GET Request
// Full Route : /api/admin/fetch/marksheet/sem/:sem/enroll/:enroll
const fetchMarksheetBySemAndEnroll = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "All Semester Marksheets has NOT Fetched Successfully";

    try {
        // Finding all the Marksheet 
        const allSemMarksheet = await Marksheet.find({
            $and: [
                { marksheetSem: req.params.sem },
                { marksheetEnroll: req.params.enroll }
            ]
        });

        if (allSemMarksheet.length !== 0) {
            // Setting up the parameters
            msg = "All Semester Marksheets has been Fetched Successfully"
            // Finding all the Marksheet 
            console.log(allSemMarksheet)
        }

        return res.json(new APIResponse(200, allSemMarksheet, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message))
    }
};

// For Updating Marksheet - PUT Request
// Full Route : /api/admin/update/marksheet/:marksheetId
const updateMarksheet = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Marksheet has NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            // Setting up the parameters
            msg = "Marksheet NOT Uploaded Successfully"
            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        // If no errors are present or found
        const { sem, result, grade, data, enroll, date } = req.body;

        // Fetching Marksheet Data :
        const marksheetData = await Marksheet.find({ _id: req.params.marksheetId })

        console.log(marksheetData)

        if (marksheetData) {
            console.log("Record Found")

            // Updating the Record : 
            const updatedMarksheetData = await Marksheet.findByIdAndUpdate(marksheetData[0]._id, {
                $set: {
                    marksheetEnroll: enroll,
                    marksheetSem: sem,
                    marksheetDate: date,
                    marksheetResult: result,
                    marksheetGrade: grade,
                    marksheetData: data,
                }
            }, { new: true });

            if (updatedMarksheetData) {
                // console.log("Done")
                // Setting up the parameters
                msg = "Marksheet has been Updated Successfully"
            }
            else {
                // console.log("Not Done")
                // Setting up the parameters
                msg = "Marksheet has NOT Updated Successfully"
            }

            return res.json(new APIResponse(200, updatedMarksheetData, msg));

        }
        else {
            console.log("Record NOT Found")
            // Setting up the parameters
            msg = "Marksheet has NOT Found"
        }

        return res.status(404).json(new APIError(404, msg));
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        // Setting up the parameters
        msg = "Marksheet Not Updated"
        return res.status(500).json(new APIError(500, msg, error.message))
    }
}

// For Deleting Marksheet - DELETE Request
// Full Route : /api/admin/delete/marksheet/:marksheetId
const deleteMarksheet = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Marksheet NOT Deleted Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            // Setting up the parameters
            msg = "Marksheet NOT Uploaded Successfully"
            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        const marksheetRecord = await Marksheet.findOneAndDelete({ _id: req.params.marksheetId })

        if (marksheetRecord) {
            msg = "Marksheet has been Deleted Successfully";
        }
        else {
            msg = "Marksheet has NOT Deleted Successfully";
        }

        return res.json(new APIResponse(200, marksheetRecord, msg));
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        // Setting up the parameters
        msg = "Marksheet Record Not Updated"
        return res.status(500).json(new APIError(500, msg, error.message))
    }
}

export {
    uploadMarksheet,
    fetchMarksheetById,
    fetchAllMarksheet,
    fetchMarksheetBySem,
    fetchMarksheetBySemAndEnroll,
    updateMarksheet,
    deleteMarksheet
}