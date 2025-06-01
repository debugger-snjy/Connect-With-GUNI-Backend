// Importing the Faculties Model
import Faculties from "../models/faculty.model.js";

// Importing the Async Promise Handler 
import { asyncPromiseHandler } from "../utils/asyncPromiseHandler.js";

// Importing the Express Validator
import { validationResult } from "express-validator";

// Importing the APIError & API Response Class
import { APIError } from "../utils/apiError.js";
import { APIResponse } from "../utils/apiResponse.js";

// Add Faculty Operation
// For Adding Faculty - POST Request
// Full Route : /api/admin/add/faculty
const addFaculty = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "Faculty Not Added Successfully";

        try {

            // Getting the Results after validations
            const errors = validationResult(req);

            // If we have errors, sending bad request with errors
            if (!errors.isEmpty()) {

                // Setting up the parameters
                msg = "Faculty Not Added Successfully !"

                // sending the errors that are present
                return res.status(400).json(new APIError(400, msg, errors.array()));
            }

            // If no Errors are found !!
            const { facultyId, phone, name, password, role, cabinLocation, email, date, gender, designation, dept, subjectTeachingShortForm, facultyShortForm } = req.body;

            const searchFaculty = await Faculties.find({ facultyId, email, facultyShortForm })

            if (searchFaculty.length === 0) {
                // Create a new faculty document
                const newFaculty = new Faculties({
                    facultyId,
                    phone,
                    name,
                    password,
                    email,
                    role,
                    date,
                    gender,
                    designation,
                    dept,
                    cabinLocation,
                    facultyShortForm
                    // Add more fields here
                });

                // Save the faculty document to the database
                // If saved successfully !
                if (await newFaculty.save()) {

                    // Setting up the parameters
                    msg = "Faculty Record has been Added Successfully"

                    // Printing the Faculty Details
                    console.log(newFaculty)

                    return res.json(new APIResponse(200, newFaculty, msg));
                }

            }
            else {
                // Setting up the parameters
                msg = "Faculty Record with Parameters Exists"

                return res.status(409).json(new APIError(409, msg, "Duplicate faculty record"));
            }

        }
        catch (error) {

            if (error.code === 11000) {
                return res.status(409).json(new APIError(409, "Record Already Exists !", error.message));
            } else {
                return res.status(500).json(new APIError(500, msg, error.message));
            }
        }
    }
);

// For Fetching Faculty - GET Request
// Full Route : /api/admin/fetch/faculty/:id
const fetchFaculty = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "Faculty Record has NOT Fetched Successfully";

        try {
            // Finding all the Faculties
            const faculty = await Faculties.find({ _id: req.params.id });

            if (faculty.length !== 0) {

                // Setting up the parameters
                msg = "Faculty Record has been Fetched Successfully"

                // Printing the Faculty 
                console.log(faculty)

            }

            return res.json(new APIResponse(200, faculty, msg));

        } catch (error) {
            return res.status(500).json(new APIError(500, msg, error.message));
        }
    }
);

// For Fetching Faculty - GET Request
// Full Route : /api/admin/fetch/departmentfaculty
const fetchDepartmentfaculty = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "Faculty Record has NOT Fetched Successfully";

        try {

            // Finding all the Faculties
            const faculty = await Faculties.find({ dept: req.params.dept })

            if (faculty.length !== 0) {
                // Setting up the parameters
                msg = "Faculty Record has been Fetched Successfully"

                // Printing the Faculty 
                console.log(faculty)
            }

            return res.json(new APIResponse(200, faculty, msg));

        } catch (error) {
            return res.status(500).json(new APIError(500, msg, error.message));
        }
    }
);

// For Fetching Faculty - GET Request
// Full Route : /api/admin/fetch/allfaculties
const fetchAllfaculties = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "Faculties Record has NOT Fetched Successfully";

        try {

            // Finding all the Faculties
            const faculties = await Faculties.find()

            if (faculties.length !== 0) {
                // Setting up the parameters
                msg = "Faculties Record has been Fetched Successfully"

                // Printing the Faculties 
                console.log(faculties)
            }

            return res.json(new APIResponse(200, faculties, msg));

        } catch (error) {
            return res.status(500).json(new APIError(500, msg, error.message));
        }
    }
);

// For Deleting Student - DEL Request
// Full Route : /api/admin/delete/student/:id
const deleteFaculty = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "Faculty Record NOT Found !";

        try {

            // Finding the faculty from the database, whether the faculty exists or not
            // To access the key from the url, we use req.params.<key>
            // Here, we access the id from the url, we use req.params.id
            const faculty = await Faculties.findById(req.params.id);

            // If that Faculties doesn't exists, then returning the Bad Response
            if (!faculty) {

                // Setting up the parameters
                msg = "Faculty Record Not Found"

                return res.status(404).json(new APIError(404, msg, "Faculty Record Not Found !"))
            }

            const deletedFaculty = await Faculties.findByIdAndDelete(req.params.id);

            // Setting up the parameters
            msg = "Faculty Record has been Deleted Successfully"

            return res.json(new APIResponse(200, deletedFaculty, msg));
        }
        catch (error) {
            msg = "Faculty Record has NOT been Deleted"
            return res.status(500).json(new APIError(500, msg, error.message));
        }
    }
);

// For Adding Faculty - POST Request
// Full Route : /api/admin/add/faculty
const updateFaculty = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "Faculty Record Not Updated Successfully";

        try {
            // Getting the Results after validations
            const errors = validationResult(req);

            // If we have errors, sending bad request with errors
            if (!errors.isEmpty()) {

                // Setting up the parameters
                msg = "Faculty Record Not Updated Successfully"

                // sending the errors that are present
                return res.status(400).json(new APIError(400, msg, errors.array()));
            }

            // If no errors are present or found
            const { facultyId, phone, name, password, role, cabinLocation, email, date, gender, designation, dept, subjectTeachingShortForm, facultyShortForm } = req.body;

            // Create a newFaculty Object with the new Updated Data 
            const newFaculty = {
                facultyId,
                phone,
                name,
                password,
                email,
                role,
                date,
                gender,
                designation,
                dept,
                cabinLocation,
                facultyShortForm
                // Add more fields here
            };

            // Finding the faculty from the database, whether the faculty exists or not
            // To access the key from the url, we use req.params.<key>
            // Here, we access the id from the url, we use req.params.id
            const faculty = await Faculties.findById(req.params.id);

            // If that subject doesn't exists, then returning the Bad Response
            if (!faculty) {

                // Setting up the parameters
                msg = "Faculty Record Not Updated Successfully"

                return res.status(404).json(new APIError(404, msg, "Faculty Record Not Found !"));
            }

            // If code is reached here, that's means the subject is belong to the user which is logged in and also that subject exists
            const updatedFaculty = await Faculties.findByIdAndUpdate(req.params.id, { $set: newFaculty }, { new: true });
            // Setting up the parameters
            msg = "Faculty Record Updated Successfully"
            return res.json(new APIResponse(200, updatedFaculty, msg));
        }
        catch (error) {
            return res.status(500).json(new APIError(500, msg, error.message));
        }
    }
);


export {
    addFaculty,
    deleteFaculty,
    fetchAllfaculties,
    fetchDepartmentfaculty,
    fetchFaculty,
    updateFaculty
}