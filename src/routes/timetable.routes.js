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
// Full Route : /api/admin/upload/timetable

// TODO : Remaining !
timetableRouter.post('/upload/timetable', [
    // Checking whether the field is available or not !!
    body("sem", "Your Sem is Required").exists(),
    body("batch", "Your Batch is Required").exists(),
    body("division", "Your Division is Required").exists(),
    body("data", "Your Data is Required").exists(),
    // Checking other paramaters
], uploadTimetable);

timetableRouter.post('/fetch/timetable', [
    // Checking whether the field is available or not !!
    body("sem", "Your Sem is Required").exists(),
    body("division", "Your Division is Required").exists(),
    body("batch", "Your Batch is Required").exists(),
    // Checking other paramaters
], fetchTimetable);

timetableRouter.get('/fetch/alltimetables', fetchAllTimetables);

timetableRouter.put('/edit/timetable/:timetableId', [
    // Checking whether the field is available or not !!
    // Add validation if needed
], updateTimetable);

timetableRouter.delete("/delete/timetable/:timetableId", deleteTimetable);

export default timetableRouter;
