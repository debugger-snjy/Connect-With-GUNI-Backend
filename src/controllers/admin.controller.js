import { asyncPromiseHandler } from "../utils/asyncPromiseHandler.js";
import { validationResult } from "express-validator";
import Admin from "../models/admin.model.js";
import { APIError } from "../utils/apiError.js";
import { APIResponse } from "../utils/apiResponse.js";

// Adding Admin
const addAdmin = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "Admin Record has NOT Added Successfully";

        try {

            // Getting the Results after validations
            const errors = validationResult(req);

            // If we have errors, sending bad request with errors
            if (!errors.isEmpty()) {

                // Setting up the parameters
                msg = "Admin Not Added Successfully !"

                // sending the errors that are present
                return res.status(400).json(new APIError(400, msg, errors.array()));
            }

            // If no Errors are found !!
            const { role, name, password, email, gender, phone } = req.body;

            // Create a new admin document
            const admin = new Admin({
                role,
                name,
                password,
                email,
                gender,
                phone
            });

            // Save the admin document to the database
            // If saved successfully
            if (await admin.save()) {

                // Setting up the parameters
                msg = "Admin Record has been Added Successfully"

                // Printing all the admin 
                console.log(admin)
            }

            return res.json(new APIResponse(200, admin, msg));
        }
        catch (error) {

            if (error.code === 11000) {
                // Duplicate key error (e.g., unique index violation)
                console.error('Duplicate key error:', error.message);
                return res.status(409).json(new APIError(409, 'Record Already Exists !', error.message));
            } else {
                // Handle other errors
                console.error('Error:', error.message);
                return res.status(500).json(new APIError(500, 'Internal Server Error !', error.message));
            }
        }
    }
);

// Fetching Admin by ID
const fetchAdmin = asyncPromiseHandler(
    async (req, res) => {
        // Making a Variable to track the success or not
        let msg = "Admin Record has NOT Fetched Successfully";

        try {
            // Finding all the Admin 
            const admin = await Admin.find({ _id: req.params.id });

            if (admin.length !== 0) {
                // Setting up the parameters
                msg = "Admin Record has been Fetched Successfully"

                // Printing the admin
                console.log(admin)
            }

            return res.json(new APIResponse(200, admin, msg));

        } catch (error) {
            msg = "Internal Server Error !";
            return res.status(500).json(new APIError(500, msg, error.message));
        }
    }
);

// Fetching All Admin
const fetchAllAdmin = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "No Admin Records Found !";

        try {

            const allAdmin = await Admin.find({});

            if (allAdmin.length !== 0) {

                // Setting up the parameters
                msg = "All Admin Record has been Fetched Successfully"

                // Finding all the Admin 
                console.log(allAdmin)
            }

            return res.json(new APIResponse(200, allAdmin, msg));

        } catch (error) {
            msg = "Internal Server Error !";
            return res.status(500).json(new APIError(500, msg, error.message));
        }
    }
);

// Deleting Admin by ID
const deleteAdmin = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "Admin Record Not Found";

        try {

            // Finding the admin from the database, whether the admin exists or not
            // To access the key from the url, we use req.params.<key>
            // Here, we access the id from the url, we use req.params.id
            const admin = await Admin.findById(req.params.id);

            // If that Admin doesn't exists, then returning the Bad Response
            if (!admin) {

                // Setting up the parameters
                msg = "Admin Record Not Found"

                return res.status(404).json(new APIError(404, msg, "Admin Record Not Found !"))
            }

            const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);

            // Setting up the parameters
            msg = "Admin Record has been Deleted Successfully"

            return res.json(new APIResponse(200, deletedAdmin, msg));
        }
        catch (error) {
            console.log("Error Occured !")
            console.error("Error : ", error.message)

            // Setting up the parameters
            msg = "Admin Record Not Deleted Successfully"

            return res.status(500).json(new APIError(500, msg, error.message));
        }
    }
);

// Updating Admin by ID
const updateAdmin = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "Admin Record Not Updated Successfully";

        try {
            // Getting the Results after validations
            const errors = validationResult(req);

            // If we have errors, sending bad request with errors
            if (!errors.isEmpty()) {

                // Setting up the parameters
                msg = "Admin Record Not Updated Successfully"

                // sending the errors that are present
                return res.status(400).json(new APIError(400, msg, errors.array()));
            }

            // If no errors are present or found
            const { role, name, password, email, gender, phone } = req.body;

            // Create a newAdmin Object with the new Updated Data 
            const newAdmin = {
                role,
                name,
                password,
                email,
                gender,
                phone
            }

            // Finding the admin from the database, whether the admin exists or not
            // To access the key from the url, we use req.params.<key>
            // Here, we access the id from the url, we use req.params.id
            const admin = await Admin.findById(req.params.id);

            // If that admin doesn't exists, then returning the Bad Response
            if (!admin) {

                // Setting up the parameters
                msg = "Admin Record Not Updated Successfully"

                return res.status(404).json(new APIError(404, msg, "Admin Record Not Found !"));
            }

            // If code is reached here, that's means the admin is belong to the user which is logged in and also that admin exists
            const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, { $set: newAdmin }, { new: true });
            // Setting up the parameters
            msg = "Admin Record Updated Successfully"
            return res.json(new APIResponse(200, updatedAdmin, msg));
        }
        catch (error) {
            console.log("Error Occured !")
            console.error("Error : ", error.message)

            // Setting up the parameters
            msg = "Admin Record Not Updated Successfully"

            return res.status(500).json(new APIError(500, msg, error.message))
        }
    }
);

export {
    addAdmin,
    fetchAdmin,
    fetchAllAdmin,
    deleteAdmin,
    updateAdmin
};