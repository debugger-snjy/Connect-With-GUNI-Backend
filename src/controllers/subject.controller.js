import Subjects from "../models/subject.model.js";
import { validationResult } from "express-validator";
import { APIError } from "../utils/apiError.js";
import { APIResponse } from "../utils/apiResponse.js";
import asyncPromiseHandler from "../middlewares/asyncPromiseHandler.js";

// For Adding Subject - POST Request
// Full Route : /api/admin/add/subject
const addSubject = asyncPromiseHandler(async (req, res, next) => {

    // Making a Variable to track the success or not
    let msg = "Subject NOT Added Successfully";

    try {

        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            msg = "Subject Not Added Successfully !"

            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        // If no Errors are found !!
        let { sem, subjectName, subjectCode, subjectShortForm, faculties } = req.body;

        faculties = faculties.split(",")

        const findSubject = await Subjects.find({ subjectCode })

        if (findSubject.length == 0) {
            // Create a new subject document
            const subject = new Subjects({
                sem,
                subjectCode,
                subjectName,
                subjectShortForm,
                faculties
                // Add more fields here
            });

            // Save the subject document to the database
            if (await subject.save()) {

                // Setting up the parameters
                msg = "Subject has been Added Successfully"

                // Finding all the Students 
                console.log(subject)
            }

            return res.json(new APIResponse(200, subject, msg));

        }
        else {
            msg = "Subject is Already Exists";
            return res.status(409).json(new APIError(409, msg));
        }

    }
    catch (error) {

        if (error.code === 11000) {
            // Duplicate key error (e.g., unique index violation)
            console.error('Duplicate key error:', error.message);
            return res.status(409).json(new APIError(409, 'Subject Record Already Exists !', error.message));
        } else {
            // Handle other errors
            console.error('Error:', error.message);
            return res.status(500).json(new APIError(500, 'Internal Server Error !', error.message));
        }
    }
});

// For Fetching Subject - GET Request
// Full Route : /api/admin/fetch/subject/:id
const fetchSubjectById = asyncPromiseHandler(async (req, res, next) => {
    // Making a Variable to track the success or not
    let msg = "Subject has NOT Fetched Successfully";

    try {
        // Finding all the Subjects 
        const subject = await Subjects.find({ _id: req.params.id });

        if (subject.length !== 0) {
            // Setting up the parameters
            msg = "Subject has been Fetched Successfully"

            // Finding all the Subjects 
            console.log(subject)

        } else {
            // If not found
            msg = "Subject Not Found";
            return res.status(404).json(new APIError(404, msg));
        }

        return res.json(new APIResponse(200, subject, msg));

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message));
    }
});

// For Fetching All Subjects - GET Request
// Full Route : /api/admin/fetch/allsubjects
const fetchAllSubjects = asyncPromiseHandler(async (req, res, next) => {

    // Making a Variable to track the success or not
    let msg = "All Subjects has NOT Fetched Successfully";

    try {
        const allSubjects = await Subjects.find({});

        if (allSubjects.length !== 0) {
            // Setting up the parameters
            msg = "All Subjects has been Fetched Successfully"

            // Finding all the Subjects
            console.log(allSubjects)
        } else {
            msg = "No Subjects Found";
        }

        return res.json(new APIResponse(200, allSubjects, msg));

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message));
    }
});

// For Fetching Subject - GET Request
// Full Route : /api/admin/fetch/allsemsubjects/:sem
const fetchAllSemSubjects = asyncPromiseHandler(async (req, res, next) => {
    // Making a Variable to track the success or not
    let msg = "All Semester Subject has NOT Fetched Successfully";

    try {
        // Finding all the Subjects 
        const allSemSubject = await Subjects.find({ sem: req.params.sem });

        if (allSemSubject.length !== 0) {
            // Setting up the parameters
            msg = "All Semester Subject has been Fetched Successfully"

            // Finding all the Subjects 
            console.log(allSemSubject)
        } else {
            msg = "No Semester Subjects Found";
        }

        return res.json(new APIResponse(200, allSemSubject, msg));

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message));
    }
});

// For Deleting Subject - DEL Request
// Full Route : /api/admin/delete/subject/:id
const deleteSubject = asyncPromiseHandler(async (req, res, next) => {

    // Making a Variable to track the success or not
    let msg = "Subject has NOT Deleted Successfully";

    try {

        // Finding the subject from the database, whether the subject exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const subject = await Subjects.findById(req.params.id);

        // If that subject doesn't exists, then returning the Bad Response
        if (!subject) {

            // Setting up the parameters
            msg = "Subject Record Not Found"

            return res.status(404).json(new APIError(404, msg, "Subject Record Not Found !"))
            // return res.status(404).json("subject Record Not Found !");
        }

        const deletedSubject = await Subjects.findByIdAndDelete(req.params.id);

        // Setting up the parameters
        msg = "Subject has been Deleted Successfully"

        return res.json(new APIResponse(200, deletedSubject, msg));
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        msg = "Subject Not Deleted Successfully"

        return res.status(500).json(new APIError(500, msg, error.message));
    }
});

// For Updating Subject - PUT Request
// Full Route : /api/admin/update/subject/:id
const updateSubject = asyncPromiseHandler(async (req, res, next) => {

    // Making a Variable to track the success or not
    let msg = "Subject NOT Updated Successfully";

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
        const { sem, subjectName, subjectCode, subjectShortForm, subjectLectures } = req.body;

        // Create a newSubject Object with the new Updated Data 
        const newSubject = {
            sem,
            subjectName,
            subjectCode,
            subjectShortForm,
            subjectLectures
        }

        // Finding the subject from the database, whether the subject exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const subject = await Subjects.findById(req.params.id);

        // If that subject doesn't exists, then returning the Bad Response
        if (!subject) {

            // Setting up the parameters
            msg = "Subject Not Updated Successfully"

            return res.status(404).json(new APIError(404, msg, "Subject Not Found !"));
        }

        // If code is reached here, that's means the subject is belong to the user which is logged in and also that subject exists
        const updatedSubject = await Subjects.findByIdAndUpdate(req.params.id, { $set: newSubject }, { new: true });

        // Setting up the parameters
        msg = "Subject Updated Successfully"

        return res.json(new APIResponse(200, updatedSubject, msg));
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        msg = "Subject Not Updated Successfully"

        return res.status(500).json(new APIError(500, msg, error.message));
    }
});

export {
    addSubject,
    fetchSubjectById,
    fetchAllSubjects,
    fetchAllSemSubjects,
    deleteSubject,
    updateSubject
};