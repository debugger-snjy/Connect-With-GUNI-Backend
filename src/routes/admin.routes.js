import { Router } from "express";
import { body } from "express-validator";
import { addAdmin, deleteAdmin, fetchAdmin, fetchAllAdmin, updateAdmin } from "../controllers/admin.controller.js";

const adminRouter = Router();

// For Adding Admin - POST Request
// Full Route : /api/v1/admin/add
adminRouter.post('/add', [

    // Checking whether the field is available or not !!
    body("role", "Your Role is Required").exists(),
    body("name", "Your Name is Required").exists(),
    body("password", "Your Password is Required").exists(),
    body("email", "Your Email is Required").exists(),
    body("gender", "Your Gender is Required").exists(),
    body("phone", "Your Phone is Required").exists(),

    // Checking other paramaters
    body("phone", "Phone Number should of 10 digits").isLength({ min: 10, max: 10 }),
    body("email", "Email ID is Invalid").isEmail(),

], addAdmin);


// For Fetching All Admin - GET Request
// Full Route : /api/v1/admin/fetch/all
adminRouter.get('/fetch/all', fetchAllAdmin);

// For Fetching Admin - GET Request
// Full Route : /api/v1/admin/fetch/:id
adminRouter.get('/fetch/:id', fetchAdmin);

// For Deleting Admin - DEL Request
// Full Route : /api/v1/admin/delete/:id
adminRouter.delete('/delete/:id', deleteAdmin);

// For Updating Admin - PUT Request
// Full Route : /api/v1/admin/update/:id
adminRouter.put('/update/:id', [

    // Checking whether the field is available or not !!
    body("role", "Your Role is Required").exists(),
    body("name", "Your Name is Required").exists(),
    body("password", "Your Password is Required").exists(),
    body("email", "Your Email is Required").exists(),
    body("gender", "Your Gender is Required").exists(),
    body("phone", "Your Phone is Required").exists(),

    // Checking other paramaters
    body("phone", "Phone Number should of 10 digits").isLength({ min: 10, max: 10 }),
    body("email", "Email ID is Invalid").isEmail(),

], updateAdmin)

export default adminRouter;