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
// Full Route : /api/v1/marksheet/upload
marksheetRouter.post('/upload', [
    // Checking whether the field is available or not !!
    body("date", "Your Date is Required").exists(),
    body("sem", "Your Sem is Required").exists(),
    body("enroll", "Your Enrollment Number is Required").exists(),
    body("result", "Your Result is Required").exists(),
    body("grade", "Your Grade is Required").exists(),
    body("data", "Your Data is Required").exists(),
    // Checking other paramaters
], uploadMarksheet);

// For Fetching All Marksheet - GET Request
// Full Route : /api/v1/marksheet/fetch/all
marksheetRouter.get('/fetch/all', fetchAllMarksheet);

// For Fetching Marksheet By Semester and Enroll - GET Request
// Full Route : /api/v1/marksheet/fetch/sem/:sem/enroll/:enroll
marksheetRouter.get('/fetch/sem/:sem/enroll/:enroll', fetchMarksheetBySemAndEnroll);

// For Fetching Marksheet By Semester - GET Request
// Full Route : /api/v1/marksheet/fetch/sem/:sem
marksheetRouter.get('/fetch/sem/:sem', fetchMarksheetBySem);

// For Fetching Marksheet By ID - GET Request
// Full Route : /api/v1/marksheet/fetch/:id
marksheetRouter.get('/fetch/:id', fetchMarksheetById);

// For Updating Marksheet - PUT Request
// Full Route : /api/v1/marksheet/update/:marksheetId
marksheetRouter.put('/update/:marksheetId', [
    // Checking whether the field is available or not !!
    // Checking other paramaters
], updateMarksheet);

// For Deleting Marksheet - DELETE Request
// Full Route : /api/v1/marksheet/delete/:marksheetId
marksheetRouter.delete('/delete/:marksheetId', deleteMarksheet);

export default marksheetRouter;