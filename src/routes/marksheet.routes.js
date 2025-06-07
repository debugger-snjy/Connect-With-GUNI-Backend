import { Router } from "express";
import { body } from "express-validator";
import {
    uploadMarksheet,
    fetchMarksheetById,
    fetchAllMarksheet,
    fetchMarksheetBySem,
    fetchMarksheetBySemAndEnroll,
    updateMarksheet,
    deleteMarksheet
} from "../controllers/marksheet.controller.js";

const marksheetRouter = Router();

// For Uploading Marksheet - POST Request
// Full Route : /api/admin/upload/marksheet/
marksheetRouter.post('/upload/marksheet/', [
    // Checking whether the field is available or not !!
    body("date", "Your Date is Required").exists(),
    body("sem", "Your Sem is Required").exists(),
    body("enroll", "Your Enrollment Number is Required").exists(),
    body("result", "Your Result is Required").exists(),
    body("grade", "Your Grade is Required").exists(),
    body("data", "Your Data is Required").exists(),
    // Checking other paramaters
], uploadMarksheet);

// For Fetching Marksheet - GET Request
// Full Route : /api/admin/fetch/marksheet/:id
marksheetRouter.get('/fetch/marksheet/:id', fetchMarksheetById);

// For Fetching All Marksheet - GET Request
// Full Route : /api/admin/fetch/marksheet/all
marksheetRouter.get('/fetch/allmarksheet', fetchAllMarksheet);

// For Fetching Marksheet By Semester - GET Request
// Full Route : /api/admin/fetch/marksheet/sem/:sem
marksheetRouter.get('/fetch/marksheet/sem/:sem', fetchMarksheetBySem);

// For Fetching Marksheet By Semester and Enroll - GET Request
// Full Route : /api/admin/fetch/marksheet/sem/:sem/enroll/:enroll
marksheetRouter.get('/fetch/marksheet/sem/:sem/enroll/:enroll', fetchMarksheetBySemAndEnroll);

// For Updating Marksheet - PUT Request
// Full Route : /api/admin/update/marksheet/:marksheetId
marksheetRouter.put('/update/marksheet/:marksheetId', [
    // Checking whether the field is available or not !!
    // Checking other paramaters
], updateMarksheet);

// For Deleting Marksheet - DELETE Request
// Full Route : /api/admin/delete/marksheet/:marksheetId
marksheetRouter.delete('/delete/marksheet/:marksheetId', deleteMarksheet);

export default marksheetRouter;