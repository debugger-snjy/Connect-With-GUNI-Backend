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
materialRouter.post('/materials/upload', material_upload.single('file'), [
    // Checking whether the field is available or not !!
    body("sem", "Your Semester is Missing").exists(),
    body("subject", "Your Subject is Missing").exists(),
    body("uploadername", "Uploader Name is Missing").exists(),
], uploadMaterial);

// For Fetching All Materials - GET Request
materialRouter.get('/fetch/allmaterials', fetchAllMaterials);

// For Deleting Material - DELETE Request
materialRouter.delete('/delete/material/:materialid', deleteMaterial);

// For Fetching Subject Material Files - POST Request
// Full Route : /pai/student/fetch/material/:subjectname
materialRouter.post('/fetch/material/:subjectname', fetchSubjectMaterial);

export default materialRouter;
