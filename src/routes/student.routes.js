// Importing the required modules
import { body } from "express-validator";

// importing the express module
import express from "express";

// Creating a Router Object
const studentRouter = express.Router();

// Importing the Controller Functions
import {
    addStudent,
    deleteStudent,
    fetchAllStudents,
    fetchStudentByDivision,
    fetchStudentById,
    fetchStudentBySem,
    updateStudent
} from '../controllers/student.controller.js';

// For Adding Student - POST Request
// Full Route : /api/v1/student/add
studentRouter.post('/add', [

    // Checking whether the field is available or not !!
    body("enrollNo", "Your Enrollnment Number is Required").exists(),
    body("sem", "Your Semester is Required").exists(),
    body("batch", "Your Batch is Required").exists(),
    body("division", "Your Division is Required").exists(),
    body("phone", "Your Phone is Required").exists(),
    body("name", "Your Name is Required").exists(),
    body("password", "Your Password is Required").exists(),
    body("email", "Your Email is Required").exists(),
    body("role", "Your role is Required").exists(),
    body("gender", "Your Gender is Required").exists(),

    // Checking other paramaters
    body("phone", "Phone Number should of 10 digits").isLength({ min: 10, max: 10 }),
    body("email", "Email ID is Invalid").isEmail(),
    body("sem", "Your Semester is Invalid").toInt().isNumeric(),

], addStudent);

// ! NOTE : Make Sure to add the parameter route at the end of the route list

// For Fetching All Class Student - GET Request
// Full Route : /api/v1/student/fetch/sem/:sem/division/:division
studentRouter.get('/fetch/sem/:sem/division/:division', fetchStudentByDivision);

// For Fetching All Semester Student - GET Request
// Full Route : /api/v1/student/fetch/sem/:sem
studentRouter.get('/fetch/sem/:sem', fetchStudentBySem);

// For Fetching All Students - GET Request
// Full Route : /api/v1/student/fetch/all
studentRouter.get('/fetch/all', fetchAllStudents);

// For Fetching Student - GET Request
// Full Route : /api/v1/student/fetch/:id
studentRouter.get('/fetch/:id', fetchStudentById);

// For Deleting Student - DEL Request
// Full Route : /api/v1/student/delete/:id
studentRouter.delete('/delete/:id', deleteStudent)

// For Updating Student - PUT Request
// Full Route : /api/v1/student/update/:id
studentRouter.put('/update/:id', updateStudent)

// Exporting the Router Object
export default studentRouter;