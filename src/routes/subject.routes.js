// Importing the express Package
import { Router } from 'express';

// Create a router of the express
const subjectRouter = Router()

// Importing the express-validator
import { body } from 'express-validator';
import { addSubject, fetchAllSubjects, fetchAllSemSubjects, deleteSubject, updateSubject, fetchSubjectById } from '../controllers/subject.controller.js';

// For Adding Subject - POST Request
// Full Route : /api/v1/subject/add
subjectRouter.post('/add', [

    // Checking whether the field is available or not !!
    body("sem", "Your Sem is Required").exists(),
    body("subjectName", "Your Subject Name is Required").exists(),
    body("subjectCode", "Your Subject Code is Required").exists(),
    body("subjectShortForm", "Your Subject Short Form is Required").exists(),
    body("faculties", "Faculties is Required").exists(),

    // Checking other paramaters

], addSubject);

// For Fetching All Subjects - GET Request
// Full Route : /api/v1/subject/fetch/all
subjectRouter.get('/fetch/all', fetchAllSubjects);

// For Fetching Subject by Semester - GET Request
// Full Route : /api/v1/subject/fetch/sem/:sem
subjectRouter.get('/fetch/sem/:sem', fetchAllSemSubjects);

// For Fetching Subject by ID - GET Request
// Full Route : /api/v1/subject/fetch/:id
subjectRouter.get('/fetch/:id', fetchSubjectById);

// For Deleting Subject - DEL Request
// Full Route : /api/v1/subject/delete/:id
subjectRouter.delete('/delete/:id', deleteSubject)

// For Updating Subject - PUT Request
// Full Route : /api/v1/subject/update/:id
subjectRouter.put('/update/:id', [

    // Checking whether the field is available or not !!
    body("sem", "Your Sem is Required").exists(),
    body("subjectName", "Your Subject Name is Required").exists(),
    body("subjectCode", "Your Subject Code is Required").exists(),
    body("subjectShortForm", "Your Subject Short Form is Required").exists(),

    // Checking other paramaters

], updateSubject);

export default subjectRouter;
