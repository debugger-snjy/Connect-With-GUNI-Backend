// Importing the required modules
import { validationResult } from "express-validator";

// Importing the Student Model
import Students from "../models/student.model.js";

// Importing the APIError and APIResponse classes for error handling and responses
import { APIError } from "../utils/apiError.js";
import { APIResponse } from "../utils/apiResponse.js";
import { asyncPromiseHandler } from "../utils/asyncPromiseHandler.js";

// Function to add a new student
const addStudent = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "Student Record has NOT Added Successfully";

        try {

            // Getting the Results after validations
            const errors = validationResult(req);

            // If we have errors, sending bad request with errors
            if (!errors.isEmpty()) {

                // Setting the Message
                msg = "Student Not Added Successfully !"

                // sending the errors that are present
                return res.status(400).json(new APIError(400, msg, errors.array()));
            }

            // If no Errors are found !!
            const { enrollNo, batch, division, sem, role, phone, name, password, email, date, gender } = req.body;

            // Create a new student document
            // Adding the Subject IDs to the student record
            const student = new Students({
                enrollNo,
                batch,
                sem,
                division,
                phone,
                name,
                password,
                role,
                email,
                date,
                gender,
                // subjectIds,
                // materialData,
                // Add more fields here
            });

            // Save the student document to the database
            // If saved successfully
            if (await student.save()) {

                // Setting the Message
                msg = "Student Record has been Added Successfully"

                // Printing all the Students 
                console.log(student)
            }

            return res.status(200).json(new APIResponse(200, student, msg));
        }
        catch (error) {

            if (error.code === 11000) {
                // Duplicate key error (e.g., unique index violation)
                console.error('Duplicate key error:', error.message);
                res.status(200).json(new APIResponse(200, "Record Already Exists !", "A student with this enroll number or email already exists."));
            } else {
                // Handle other errors
                console.error('Error:', error.message);
                res.status(500).json(new APIError(500, "Internal Server Error !", error.message));
            }
        }
    }
);

// Function to fetch a student by ID
const fetchStudentById = asyncPromiseHandler(
    async (req, res) => {
        // Making a Variable to track the success or not
        let msg = "Student Record has NOT Fetched Successfully";

        try {
            // Finding all the Students 
            const student = await Students.find({ _id: req.params.id });

            if (student.length !== 0) {
                // Setting up the parameters
                msg = "Student Record has been Fetched Successfully"

                // Printing the Student
                console.log(student)
            }
            else {
                msg = "No Student Found with this ID";
            }

            return res.json(new APIResponse(200, student, msg));

        } catch (error) {
            console.log("Error Occured !")
            console.error("Error : ", error.message)
            return res.status(500).json(new APIError(500, msg, "Internal Server Error !", error.message));
        }
    }
);

// Function to fetch a student by Semester
const fetchStudentBySem = asyncPromiseHandler(
    async (req, res) => {
        // Making a Variable to track the success or not
        let msg = "Student Record has NOT Fetched Successfully";

        try {
            // Finding all the Students 
            const student = await Students.find({ sem: req.params.sem });

            if (student.length !== 0) {
                // Setting up the parameters
                msg = "Student Record has been Fetched Successfully"

                // Printing all the Semester Students 
                console.log(student)
            }
            else {
                msg = "No Student Found in this Semester";
            }

            return res.json(new APIResponse(200, student, msg));

        } catch (error) {
            console.log("Error Occured !")
            console.error("Error : ", error.message)
            return res.status(500).json(new APIError(500, msg, "Internal Server Error !", error.message));
        }
    }
);

// Function to fetch a student by Division
const fetchStudentByDivision = asyncPromiseHandler(
    async (req, res) => {
        // Making a Variable to track the success or not
        let msg = "Student Record has NOT Fetched Successfully";

        try {
            // Finding all the Students 
            const student = await Students.find({ division: req.params.division, sem: req.params.sem });

            if (student.length !== 0) {
                // Setting up the parameters
                msg = "Student Record has been Fetched Successfully"

                // Printing all the Semester Students 
                console.log(student)
            }
            else {
                msg = "No Student Found in this Division for given Semester";
            }

            return res.json(new APIResponse(200, student, msg));

        } catch (error) {
            console.log("Error Occured !")
            console.error("Error : ", error.message)
            return res.status(500).json(new APIError(500, msg, "Internal Server Error !", error.message));
        }
    }
);

// Function to fetch all students
const fetchAllStudents = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "No Student Records Found !";

        try {

            // Convert the cursor to an array of documents
            let allStudents = await Students.find({});

            console.log("All Students : ", allStudents)

            if (allStudents.length !== 0) {

                // Setting up the parameters
                msg = "All Students Record has been Fetched Successfully"

                // Finding all the Students 
                console.log(allStudents)
            }

            return res.json(new APIResponse(200, allStudents, msg));

        } catch (error) {
            console.log("Error Occured !")
            console.error("Error : ", error.message)
            return res.status(500).json(new APIError(500, msg, "Internal Server Error !", error.message));
        }
    }
);

// Function to delete a student by ID
const deleteStudent = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "Student Record Not Found";

        try {

            // Finding the student from the database, whether the student exists or not
            // To access the key from the url, we use req.params.<key>
            // Here, we access the id from the url, we use req.params.id
            const student = await Students.findById(req.params.id);

            // If that Student doesn't exists, then returning the Bad Response
            if (!student) {

                // Setting up the parameters
                msg = "Student Record Not Found"

                return res.status(404).json(new APIError(404, msg, "Student Record Not Found !"));
            }

            const deletedStudent = await Students.findByIdAndDelete(req.params.id);

            // Setting up the parameters
            msg = "Student Record has been Deleted Successfully"

            return res.json(new APIResponse(200, deletedStudent, msg));
        }
        catch (error) {
            console.log("Error Occured !")
            console.error("Error : ", error.message)

            // Setting up the parameters
            msg = "Student Record Not Deleted Successfully"

            return res.status(500).json(new APIError(500, msg, "Internal Server Error !", error.message));
        }
    }
);

// Function to update a student by ID
const updateStudent = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "Student Record Not Updated Successfully";

        try {
            // Getting the Results after validations
            const errors = validationResult(req);

            // If we have errors, sending bad request with errors
            if (!errors.isEmpty()) {

                // Setting up the parameters
                msg = "Student Record Not Updated Successfully"

                // sending the errors that are present
                return res.status(400).json(new APIError(400, msg, errors.array()));
            }

            // If no errors are present or found
            const { enrollNo, batch, sem, division, phone, name, password, email, date, gender } = req.body;

            // Create a newStudent Object with the new Updated Data 
            const newStudent = {
                enrollNo,
                batch,
                sem,
                phone,
                name,
                password,
                division,
                email,
                date,
                gender,
            }

            // Finding the student from the database, whether the student exists or not
            // To access the key from the url, we use req.params.<key>
            // Here, we access the id from the url, we use req.params.id
            const student = await Students.findById(req.params.id);

            // If that student doesn't exists, then returning the Bad Response
            if (!student) {

                // Setting up the parameters
                msg = "Student Record Not Updated Successfully"
                return res.status(404).json(new APIError(404, msg, "Student Record Not Found!"));
            }

            // If code is reached here, that's means the student is belong to the user which is logged in and also that student exists
            const updatedStudent = await Students.findByIdAndUpdate(req.params.id, { $set: newStudent }, { new: true });
            // Setting up the parameters
            msg = "Student Record Updated Successfully"
            return res.status(200).json(new APIResponse(200, updatedStudent, msg));
        }
        catch (error) {
            console.log("Error Occured !")
            console.error("Error : ", error.message)

            // Setting up the parameters
            msg = "Student Record Not Updated Successfully"
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

// Exporting the functions to use in the routes
export {
    addStudent,
    fetchStudentById,
    fetchStudentBySem,
    fetchStudentByDivision,
    fetchAllStudents,
    deleteStudent,
    updateStudent
};