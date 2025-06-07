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
// Full Route : /api/admin/upload/fees/
feesRouter.post('/upload/fees/', [
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

// For Fetching Fees - GET Request
// Full Route : /api/admin/fetch/fees/:id
feesRouter.get('/fetch/fees/:id', fetchFeesById);

// For Fetching All Fees - GET Request
// Full Route : /api/admin/fetch/fees/all
feesRouter.get('/fetch/allfees', fetchAllFees);

// For Fetching Fees By Semester - GET Request
// Full Route : /api/admin/fetch/fees/sem/:sem
feesRouter.get('/fetch/fees/sem/:sem', fetchFeesBySem);

// For Fetching Fees By Semester - GET Request
// Full Route : /api/admin/fetch/fees/sem/:sem/enroll/:enroll
feesRouter.get('/fetch/fees/sem/:sem/enroll/:enroll', fetchFeesBySemAndEnroll);

// For Updating Fees - PUT Request
// Full Route : /api/admin/update/fees/:feesId
feesRouter.put('/update/fees/:feesId', [
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
// Full Route : /api/admin/delete/fees/:feesId
feesRouter.delete('/delete/fees/:feesId', deleteFees);

export default feesRouter;