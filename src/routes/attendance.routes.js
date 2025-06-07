import { Router } from "express";
import { body, validationResult } from "express-validator";
import multer from "multer";
import { uploadAttendance, fetchAllAttendance } from "../controllers/attendance.controller.js";

const attendanceRouter = Router();
const AttendanceStorage = multer.memoryStorage();
const attendance_upload = multer({ storage: AttendanceStorage });

// ===========================================================================================================================================================================
// ----- ATTENDANCE ROUTES ---------- ATTENDANCE ROUTES ---------- ATTENDANCE ROUTES ---------- ATTENDANCE ROUTES ---------- ATTENDANCE ROUTES ---------- ATTENDANCE ROUTES --
// ===========================================================================================================================================================================

// For Uploading Attendance - POST Request
// Full Route : /api/admin/attendance/upload
attendanceRouter.post('/attendance/upload', attendance_upload.single('file'), [
    // Checking whether the field is available or not !!
    body("sem", "Your Semester is Missing").exists(),
    body("subject", "Your Subject is Missing").exists(),
    body("title", "Your Title is Missing").exists(),
    body("uploadedBy", "Your UploadedBy is Missing").exists(),
], uploadAttendance);

// For Fetching Attendance - GET Request
// Full Route : /api/admin/attendance/fetch
attendanceRouter.get('/attendance/fetch', fetchAllAttendance);

export default attendanceRouter;