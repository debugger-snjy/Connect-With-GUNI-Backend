import { Router } from "express";
import { body, validationResult } from "express-validator";
import {
    uploadTimetable,
    fetchTimetable,
    fetchAllTimetables,
    updateTimetable,
    deleteTimetable
} from "../controllers/timetable.controller.js";

const timetableRouter = Router();

// For Updating Subject - PUT Request
// Full Route : /api/v1/timetable/upload
timetableRouter.post('/upload', [
    // Checking whether the field is available or not !!
    body("sem", "Your Sem is Required").exists(),
    body("batch", "Your Batch is Required").exists(),
    body("division", "Your Division is Required").exists(),
    body("data", "Your Data is Required").exists(),
    // Checking other paramaters
], uploadTimetable);

// For Fetching Timetable - POST Request
// Full Route : /api/v1/timetable/fetch
timetableRouter.post('/fetch', [
    // Checking whether the field is available or not !!
    body("sem", "Your Sem is Required").exists(),
    body("division", "Your Division is Required").exists(),
    body("batch", "Your Batch is Required").exists(),
    // Checking other paramaters
], fetchTimetable);

// For Fetching All Timetables - GET Request
// Full Route : /api/v1/timetable/fetch/all
timetableRouter.get('/fetch/all', fetchAllTimetables);

// For Updating Timetable - PUT Request
// Full Route : /api/v1/timetable/update/:timetableId
timetableRouter.put('/update/:timetableId', [
    // Checking whether the field is available or not !!
    // Add validation if needed
], updateTimetable);

// For Deleting Timetable - DELETE Request
// Full Route : /api/v1/timetable/delete/:timetableId
timetableRouter.delete("/delete/:timetableId", deleteTimetable);

export default timetableRouter;
