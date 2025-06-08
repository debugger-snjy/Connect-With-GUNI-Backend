import { Router } from "express";
import { body } from "express-validator";
import {
    uploadFees,
    fetchFeesById,
    fetchAllFees,
    fetchFeesBySem,
    fetchFeesBySemAndEnroll,
    updateFees,
    deleteFees
} from "../controllers/fees.controller.js";

const feesRouter = Router();

// For Uploading Fees - POST Request
// Full Route : /api/v1/fees/upload/
feesRouter.post('/upload/', [
    // Checking whether the field is available or not !!
    body("id", "Your Id is Required").exists(),
    body("date", "Your Date is Required").exists(),
    body("mode", "Your Mode is Required").exists(),
    body("amount", "Your Amount is Required").exists(),
    body("title", "Your Title is Required").exists(),
    body("sem", "Your Sem is Required").exists(),
    body("enroll", "Your Enrollment Number is Required").exists(),
    // Checking other paramaters
], uploadFees);

// For Fetching All Fees - GET Request
// Full Route : /api/v1/fees/fetch/all
feesRouter.get('/fetch/all', fetchAllFees);

// For Fetching Fees - GET Request
// Full Route : /api/v1/fees/fetch/:id
feesRouter.get('/fetch/:id', fetchFeesById);

// For Fetching Fees By Semester and Enrollment - GET Request
// Full Route : /api/v1/fees/fetch/sem/:sem/enroll/:enroll
feesRouter.get('/fetch/sem/:sem/enroll/:enroll', fetchFeesBySemAndEnroll);

// For Fetching Fees By Semester - GET Request
// Full Route : /api/v1/fees/fetch/sem/:sem
feesRouter.get('/fetch/sem/:sem', fetchFeesBySem);

// For Updating Fees - PUT Request
// Full Route : /api/v1/fees/update/:feesId
feesRouter.put('/update/:feesId', [
    // Checking whether the field is available or not !!
    body("date", "Your Date is Required").exists(),
    body("mode", "Your Mode is Required").exists(),
    body("amount", "Your Amount is Required").exists(),
    body("title", "Your Title is Required").exists(),
    body("sem", "Your Sem is Required").exists(),
    body("enroll", "Your Enrollment Number is Required").exists(),
    // Checking other paramaters
], updateFees);

// For Deleting Fees - DELETE Request
// Full Route : /api/v1/fees/delete/:feesId
feesRouter.delete('/delete/:feesId', deleteFees);

export default feesRouter;