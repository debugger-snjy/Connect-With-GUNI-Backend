import { body } from 'express-validator';

// Importing the express Package
import { Router } from 'express';

import { addFaculty, fetchDepartmentfaculty, fetchAllfaculties, fetchFaculty, deleteFaculty, updateFaculty } from '../controllers/faculty.controller.js';
const facultyRouter = Router();

// Add Faculty Operation
// For Adding Faculty - POST Request
// Full Route : /api/admin/add/faculty
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

// For Fetching Faculty - GET Request
// Full Route : /api/admin/fetch/departmentfaculty
facultyRouter.get('/fetch/departmentfaculty/:dept',fetchDepartmentfaculty);

// For Fetching Faculty - GET Request
// Full Route : /api/admin/fetch/allfaculties
facultyRouter.get('/fetch/allfaculties',fetchAllfaculties);

// For Fetching Faculty - GET Request
// Full Route : /api/admin/fetch/faculty/:id
facultyRouter.get('/fetch/:id',fetchFaculty);

// For Deleting Student - DEL Request
// Full Route : /api/admin/delete/student/:id
facultyRouter.delete('/delete/:id',deleteFaculty);

// For Adding Faculty - POST Request
// Full Route : /api/admin/add/faculty
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

],updateFaculty);

// Exporting the Router
export default facultyRouter;