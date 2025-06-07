import { validationResult } from "express-validator";
import Fees from "../models/fees.model.js";
import { APIError } from "../utils/apiError.js";
import { APIResponse } from "../utils/apiResponse.js";
import { MongoClient } from "mongodb";

// For Uploading Fees - POST Request
// Full Route : /api/admin/upload/fees/
export const uploadFees = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Fees Record has NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            // Setting up the parameters
            msg = "Fees Record has NOT Uploaded Successfully"
            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        // If no errors are present or found
        const { id, date, mode, amount, title, sem, enroll } = req.body;

        const searchFees = await Fees.find({ feesTitle: title })

        if (searchFees.length === 0) {
            // Create a newFees Object with the new Updated Data 
            const newFees = new Fees({
                feesId: id,
                feesDate: date,
                feesMode: mode,
                feesAmount: amount,
                feesTitle: title,
                feesSem: sem,
                feesEnroll: enroll,
            });

            const feesRecord = await newFees.save()

            // Setting up the parameters
            msg = "Fees Record has been Uploaded Successfully"

            return res.json(new APIResponse(200, newFees, msg));
        }
        else {
            // Setting up the parameters
            msg = "Fees With Same Title Exists !"
            return res.status(409).json(new APIError(409, msg));
        }
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        // Setting up the parameters
        msg = "Fees Record has Not Uploaded Successfully"
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}

// For Fetching Fees - GET Request
// Full Route : /api/admin/fetch/fees/:id
export const fetchFeesById = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Fees Record has NOT Fetched Successfully";

    try {
        // Finding all the Subjects 
        const feesData = await Fees.find({ _id: req.params.id });

        if (feesData.length !== 0) {
            // Setting up the parameters
            msg = "Fees Record has been Fetched Successfully"
            // Printing all the fees Data
            console.log(feesData)
        }

        return res.json(new APIResponse(200, feesData, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message));
    }
};

// For Fetching All Fees - GET Request
// Full Route : /api/admin/fetch/fees/all
export const fetchAllFees = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "All Fees Records has NOT Fetched Successfully";

    console.log("Fetching the Fees")

    try {
        
        // Using the lean() function to get plain JavaScript objects instead of Mongoose documents
        // This can improve performance for read operations
        const allFees = await Fees.find({}).lean();

        if (allFees.length !== 0) {
            // Setting up the parameters
            msg = "All Fees Records has been Fetched Successfully"
            // Finding all the Subjects
            console.log(allFees)
        }

        return res.json(new APIResponse(200, allFees, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message));
    }
};

// For Fetching Fees By Semester - GET Request
// Full Route : /api/admin/fetch/fees/sem/:sem
export const fetchFeesBySem = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "All Semester Fees Records has NOT Fetched Successfully";

    try {
        // Finding all the Fees 
        const allSemFees = await Fees.find({ feesSem: req.params.sem });

        if (allSemFees.length !== 0) {
            // Setting up the parameters
            msg = "All Semester Fees Records has been Fetched Successfully"
            // Finding all the Fees 
            console.log(allSemFees)
        }

        return res.json(new APIResponse(200, allSemFees, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message));
    }
};

// For Fetching Fees By Semester and Enrollment - GET Request
// Full Route : /api/admin/fetch/fees/sem/:sem/enroll/:enroll
export const fetchFeesBySemAndEnroll = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "All Fees Receipts of Student has NOT Fetched Successfully";

    try {
        // Finding all the Fees 
        const allSemFees = await Fees.find({
            $and: [
                { feesSem: req.params.sem },
                { feesEnroll: req.params.enroll }
            ]
        });

        if (allSemFees.length !== 0) {
            // Setting up the parameters
            msg = "All Fees Receipts of Student has been Fetched Successfully"
            // Finding all the Fees 
            console.log(allSemFees)
        }

        return res.json(new APIResponse(200, allSemFees, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message));
    }
};

// For Updating Fees - PUT Request
// Full Route : /api/admin/update/fees/:feesId
export const updateFees = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Fees Record has NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            // Setting up the parameters
            msg = "Fees Record NOT Uploaded Successfully"
            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        // If no errors are present or found
        const { date, mode, amount, title, sem, enroll } = req.body;

        // Fetching Fees Data :
        const feesData = await Fees.find({ feesId: req.params.feesId })

        if (feesData) {
            console.log("Record Found")

            // Updating the Record : 
            const updatedFeesData = await Fees.findByIdAndUpdate(feesData[0]._id, { $set: { feesDate: date, feesMode: mode, feesAmount: amount, feesTitle: title, feesSem: sem, feesEnroll: enroll } }, { new: true });

            if (updatedFeesData) {
                // console.log("Done")
                // Setting up the parameters
                msg = "Fees Record has been Updated Successfully"
            }
            else {
                // console.log("Not Done")
                // Setting up the parameters
                msg = "Fees Record has NOT Updated Successfully"
            }

            return res.json(new APIResponse(200, updatedFeesData, msg));
        }
        else {
            console.log("Record NOT Found")
            // Setting up the parameters
            msg = "Fees Record has NOT Found"
        }

        return res.status(404).json(new APIError(404, msg));
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        // Setting up the parameters
        msg = "Fees Record Not Updated"
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}

// For Deleting Fees - DELETE Request
// Full Route : /api/admin/delete/fees/:feesId
export const deleteFees = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Fees Record NOT Deleted Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            // Setting up the parameters
            msg = "Fees Record NOT Deleted Successfully"
            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        const feesRecord = await Fees.findOneAndDelete({ feesId: req.params.feesId })

        if (feesRecord) {
            msg = "Fees Record has been Deleted Successfully";
        }
        else {
            msg = "Fees Record has NOT Deleted Successfully";
        }

        return res.json(new APIResponse(200, feesRecord, msg));
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        // Setting up the parameters
        msg = "Fees Record Not Deleted"
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}