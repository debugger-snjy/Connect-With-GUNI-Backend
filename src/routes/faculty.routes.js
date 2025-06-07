import { body } from 'express-validator';

// Importing the express Package
import { Router } from 'express';

import { addFaculty, fetchDepartmentfaculty, fetchAllfaculties, fetchFaculty, deleteFaculty, updateFaculty } from '../controllers/faculty.controller.js';
const facultyRouter = Router();

// Add Faculty Operation
// For Adding Faculty - POST Request
// Full Route : /api/v1/faculty/add
facultyRouter.post('/add', [

    // Checking whether the field is available or not !!

    body("facultyId", "Your Faculty Id is Required").exists(),
    body("phone", "Your Phone is Required").exists(),
    body("name", "Your Name is Required").exists(),
    body("password", "Your Password is Required").exists(),
    body("email", "Your Email is Required").exists(),
    body("role", "Your Role is Required").exists(),
    body("gender", "Your Gender is Required").exists(),
    body("designation", "Your Designation is Required").exists(),
    body("dept", "Your Department is Required").exists(),
    body("cabinLocation", "Your Cabin Location is Required").exists(),
    body("facultyShortForm", "Your Faculty Short Name is Required").exists(),

    // Checking other paramaters
    body("phone", "Phone Number should of 10 digits").isLength({ min: 10, max: 10 }),
    body("email", "Email ID is Invalid").isEmail(),

], addFaculty);

// For Fetching Faculty by Department - GET Request
// Full Route : /api/v1/faculty/fetch/department/:dept
facultyRouter.get('/fetch/department/:dept', fetchDepartmentfaculty);

// For Fetching All Faculties - GET Request
// Full Route : /api/v1/faculty/fetch/all
facultyRouter.get('/fetch/all', fetchAllfaculties);

// For Fetching Faculty by ID - GET Request
// Full Route : /api/v1/faculty/fetch/:id
facultyRouter.get('/fetch/:id', fetchFaculty);

// For Deleting Faculty - DEL Request
// Full Route : /api/v1/faculty/delete/:id
facultyRouter.delete('/delete/:id', deleteFaculty);

// For Updating Faculty - PUT Request
// Full Route : /api/v1/faculty/update/:id
facultyRouter.put('/update/:id', [

    // Checking whether the field is available or not !!

    body("facultyId", "Your Faculty Id is Required").exists(),
    body("phone", "Your Phone is Required").exists(),
    body("name", "Your Name is Required").exists(),
    body("password", "Your Password is Required").exists(),
    body("email", "Your Email is Required").exists(),
    body("gender", "Your Gender is Required").exists(),
    body("designation", "Your Designation is Required").exists(),
    body("cabinLocation", "Your cabinLocation is Required").exists(),
    body("dept", "Your Department is Required").exists(),

    // Checking other paramaters
    body("phone", "Phone Number should of 10 digits").isLength({ min: 10, max: 10 }),
    body("email", "Email ID is Invalid").isEmail(),

], updateFaculty);

// Exporting the Router
export default facultyRouter;