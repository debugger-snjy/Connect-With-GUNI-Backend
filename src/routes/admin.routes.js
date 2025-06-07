import { Router } from "express";
import { body } from "express-validator";
import { addAdmin, deleteAdmin, fetchAdmin, fetchAllAdmin, updateAdmin } from "../controllers/admin.controller";

const adminRouter = Router();

// For Adding Admin - POST Request
// Full Route : /api/admin/add/admin
adminRouter.post('/add/admin', [

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

// For Fetching Admin - GET Request
// Full Route : /api/admin/fetch/admin/:id
adminRouter.get('/fetch/admin/:id', fetchAdmin);

// For Fetching All Admin - GET Request
// Full Route : /api/admin/fetch/alladmin
adminRouter.get('/fetch/alladmin', fetchAllAdmin);

// For Deleting Admin - DEL Request
// Full Route : /api/admin/delete/admin/:id
adminRouter.delete('/delete/admin/:id', deleteAdmin);

// For Updating Admin - PUT Request
// Full Route : /api/admin/update/admin/:id
adminRouter.put('/update/admin/:id', [

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