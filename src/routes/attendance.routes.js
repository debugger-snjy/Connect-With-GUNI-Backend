import { Router } from "express";
import { body, validationResult } from "express-validator";
import multer from "multer";
import { uploadAttendance, fetchAllAttendance } from "../controllers/attendance.controller.js";

const attendanceRouter = Router();
const AttendanceStorage = multer.memoryStorage();
const attendance_upload = multer({ storage: AttendanceStorage });

// For Uploading Attendance - POST Request
// Full Route : /api/v1/attendance/upload
attendanceRouter.post('/upload', attendance_upload.single('file'), [
    // Checking whether the field is available or not !!
    body("sem", "Your Semester is Missing").exists(),
    body("subject", "Your Subject is Missing").exists(),
    body("title", "Your Title is Missing").exists(),
    body("uploadedBy", "Your UploadedBy is Missing").exists(),
], uploadAttendance);

// For Fetching Attendance - GET Request
// Full Route : /api/v1/attendance/fetch
attendanceRouter.get('/fetch', fetchAllAttendance);

export default attendanceRouter;