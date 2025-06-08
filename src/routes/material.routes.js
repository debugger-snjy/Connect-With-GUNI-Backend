import { Router } from "express";
import multer from "multer";
import { body, validationResult } from "express-validator";
import {
    uploadMaterial,
    fetchAllMaterials,
    deleteMaterial,
    fetchSubjectMaterial
} from "../controllers/material.controller.js";

const MaterialStorage = multer.memoryStorage();
const material_upload = multer({ storage: MaterialStorage });

const materialRouter = Router();

// For Uploading the Material :
// Full Route : /api/v1/material/upload
materialRouter.post('/upload', material_upload.single('file'), [
    // Checking whether the field is available or not !!
    body("sem", "Your Semester is Missing").exists(),
    body("subject", "Your Subject is Missing").exists(),
    body("uploadername", "Uploader Name is Missing").exists(),
], uploadMaterial);

// For Fetching All Materials - GET Request
// Full Route : /api/v1/material/fetch/all
materialRouter.get('/fetch/all', fetchAllMaterials);

// For Deleting Material - DELETE Request
// Full Route : /api/v1/material/delete/:materialid
materialRouter.delete('/delete/:materialid', deleteMaterial);

// For Fetching Subject Material Files - POST Request
// Full Route : /api/v1/material/fetch/subject/:subjectname
materialRouter.get('/fetch/subject/:subjectname', fetchSubjectMaterial);

export default materialRouter;
